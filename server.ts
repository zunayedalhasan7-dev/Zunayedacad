import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load Environment Variables first
dotenv.config();

// Load Firebase Config
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Set environment variables for Google Cloud/Firebase SDKs before ANY SDK import if possible
// Note: Imports are hoisted in ESM, so we use a dynamic import or ensure this runs early.
if (firebaseConfig.projectId) {
  process.env.GOOGLE_CLOUD_PROJECT = firebaseConfig.projectId.trim();
  process.env.GCLOUD_PROJECT = firebaseConfig.projectId.trim();
}

import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Initialize Firebase Admin
let firebaseApp: any;
let db: any;
try {
  const pId = firebaseConfig.projectId?.trim();
  const ambientProjectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
  
  if (getApps().length === 0) {
    console.log(`Initializing Firebase Admin. Config Project: ${pId || 'none'}, Ambient Project: ${ambientProjectId || 'none'}`);
    
    // If the config project is set, but we get PERMISSION_DENIED later, 
    // it usually means we should have used the ambient project ID.
    firebaseApp = initializeApp({
      credential: applicationDefault(),
      projectId: pId || ambientProjectId, // Prioritize config if available
    });
  } else {
    firebaseApp = getApp();
  }
  
  const activeProjectId = firebaseApp?.options?.projectId;
  console.log(`Firebase Admin active. Project ID: ${activeProjectId || 'unknown'}`);

  // Initialize Firestore
  const dbId = firebaseConfig.firestoreDatabaseId;
  try {
    if (dbId) {
      console.log(`Using named Firestore database: "${dbId}" for project: ${activeProjectId}`);
      db = getFirestore(firebaseApp, dbId);
    } else {
      console.log(`Using default Firestore database for project: ${activeProjectId}`);
      db = getFirestore(firebaseApp);
    }
  } catch (firestoreError: any) {
    console.error("Firestore initialization failed:", firestoreError.message);
    db = null;
  }
} catch (error: any) {
  console.error("CRITICAL: Firebase initialization failed:", error.message);
  if (error.message.includes("PERMISSION_DENIED")) {
    console.error("HINT: This usually means the environment's service account does not have access to the specified project. Please run 'Set up Firebase' in AI Studio.");
  }
  firebaseApp = null;
  db = null;
}
const JWT_SECRET = process.env.JWT_SECRET || "zunayed-academy-super-secret-key-2024";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "xpeee01@gmail.com";

// Extend Request type for custom user property
interface AuthRequest extends Request {
  user?: {
    uid: string;
    role: string;
    email: string;
  };
}

// ================== AUTH MIDDLEWARE ==================
const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No token provided. Please login." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ================== ROLE CHECK MIDDLEWARE ==================
const authorizeRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: Access denied." });
    }
    next();
  };
};

// ================== DB CHECK MIDDLEWARE ==================
const dbCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!db) {
    return res.status(503).json({ 
      error: "Database service unavailable.", 
      details: "Firebase Admin failed to initialize. If using an external project, a service account key might be required, or the project permissions are insufficient."
    });
  }
  next();
};

async function seedAdmin() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn("ADMIN_PASSWORD not set. Admin seeding skipped.");
    return;
  }

  if (!db) {
    console.warn("Firestore database not initialized. Skipping Admin seeding.");
    return;
  }

  try {
    const adminRef = db.collection("users").doc("admin_one");
    const doc = await adminRef.get();
// ... (rest of the code unchanged)
    if (!doc.exists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await adminRef.set({
        uid: "admin_one",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        displayName: "System Admin",
        failedAttempts: 0,
        lockedUntil: null,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log("Admin account seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Rate Limiting for Login
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased for development/testing
    message: { error: "Too many login attempts. Please try again after 15 minutes." },
  });

  // Seed Admin on startup
  console.log("Starting server and seeding admin...");
  seedAdmin().catch(err => console.error("Non-blocking seedAdmin failed:", err));

  app.get("/api/health/firestore", async (req: Request, res: Response) => {
    if (!firebaseApp || !db) {
      return res.status(503).json({
        status: "error",
        message: "Firebase Admin or Firestore not initialized.",
        projectId: firebaseConfig.projectId,
        hint: "This usually happens when the server environment lacks permissions to access the external Firebase project. Consider using the 'Set up Firebase' tool in AI Studio."
      });
    }

    const results: any = {};
    const dbId = firebaseConfig.firestoreDatabaseId;
    
    // Test Named DB
    if (dbId) {
      try {
        const namedDb = getFirestore(firebaseApp, dbId);
        await namedDb.collection("_health_test").doc("status").set({
          lastCheck: FieldValue.serverTimestamp(),
          db: "named"
        });
        results.named = { status: "ok" };
      } catch (error: any) {
        results.named = { status: "error", message: error.message, code: error.code };
      }
    }

    // Test Default DB
    try {
      const defaultDb = getFirestore(firebaseApp);
      await defaultDb.collection("_health_test").doc("status").set({
        lastCheck: FieldValue.serverTimestamp(),
        db: "default"
      });
      results.default = { status: "ok" };
    } catch (error: any) {
      results.default = { status: "error", message: error.message, code: error.code };
    }

    res.json({ 
      status: results.named?.status === "ok" || results.default?.status === "ok" ? "ok" : "error",
      activeProjectId: firebaseApp?.options?.projectId,
      results 
    });
  });

  // ================== AUTH ROUTES ==================
  app.post("/api/auth/login", loginLimiter, dbCheck, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    try {
      const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      
      if (userSnapshot.empty) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Check for account lock
      if (userData.lockedUntil && userData.lockedUntil.toDate() > new Date()) {
        const remainingMinutes = Math.ceil((userData.lockedUntil.toDate().getTime() - Date.now()) / 60000);
        return res.status(403).json({ error: `Account locked. Please try again in ${remainingMinutes} minutes.` });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, userData.password);
      
      if (!isMatch) {
        // Increment failed attempts
        const newAttempts = (userData.failedAttempts || 0) + 1;
        const updates: any = { failedAttempts: newAttempts };
        
        if (newAttempts >= 5) {
          updates.lockedUntil = Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000));
          updates.failedAttempts = 0; // Reset after lock
        }
        
        await userDoc.ref.update(updates);
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Reset failed attempts on success
      await userDoc.ref.update({ failedAttempts: 0, lockedUntil: null });

      // Generate JWT
      const token = jwt.sign(
        { uid: userDoc.id, role: userData.role, email: userData.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set HTTP-Only Cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Always true for HTTPS preview environments
        sameSite: "lax", // Lax is generally safer than strict for some iframe scenarios
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: {
          uid: userDoc.id,
          email: userData.email,
          role: userData.role,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  app.post("/api/auth/register", dbCheck, async (req: Request, res: Response) => {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    try {
      const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      if (!userSnapshot.empty) {
        return res.status(400).json({ error: "Email already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUserRef = db.collection("users").doc();
      
      const userData = {
        uid: newUserRef.id,
        email,
        password: hashedPassword,
        role: "student",
        displayName: displayName || "",
        failedAttempts: 0,
        lockedUntil: null,
        createdAt: FieldValue.serverTimestamp(),
      };

      await newUserRef.set(userData);

      res.status(201).json({ message: "Registration successful. Please login." });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  app.get("/api/auth/me", auth, dbCheck, async (req: AuthRequest, res: Response) => {
    try {
      const userDoc = await db.collection("users").doc(req.user!.uid).get();
      
      if (!userDoc.exists) {
        return res.status(401).json({ error: "User not found." });
      }

      const userData = userDoc.data()!;
      res.json({
        user: {
          uid: userDoc.id,
          email: userData.email,
          role: userData.role,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
        }
      });
    } catch (error) {
      res.status(401).json({ error: "Session expired." });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully." });
  });

  app.post("/api/auth/google", dbCheck, async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required." });
    }

    try {
      // Verify the ID token
      const decodedToken = await getAuth(firebaseApp).verifyIdToken(idToken);
      const { uid, email, name, picture, email_verified } = decodedToken;

      if (!email_verified) {
        return res.status(400).json({ error: "Email not verified by Google." });
      }

      // Check if user exists in Firestore
      let userSnapshot;
      try {
        if (!db) throw new Error("Firestore instance is not available.");
        userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      } catch (dbErr: any) {
        console.error("Firestore query error in Google login:", dbErr.message);
        if (dbErr.message.includes("PERMISSION_DENIED") || dbErr.message.includes("is disabled") || dbErr.message.includes("has not been used")) {
          return res.status(503).json({ 
            error: "Database permission error.",
            detail: dbErr.message,
            hint: "The server-side service account lacks permissions for this Firestore project. This often happens after a project migration or misconfiguration. Please use the 'Set up Firebase' tool in AI Studio to re-provision the database for project: " + (firebaseApp?.options?.projectId || "unknown")
          });
        }
        throw dbErr;
      }
      let userData: any;
      let userDocId: string;

      if (userSnapshot.empty) {
        // Create new user
        const newUserRef = db.collection("users").doc();
        userDocId = newUserRef.id;
        
        // If email matches admin email, give admin role
        const role = email === ADMIN_EMAIL ? "admin" : "student";

        userData = {
          uid: userDocId,
          email,
          role,
          displayName: name || "",
          photoURL: picture || "",
          createdAt: FieldValue.serverTimestamp(),
          authProvider: "google",
        };

        await newUserRef.set(userData);
      } else {
        const userDoc = userSnapshot.docs[0];
        userDocId = userDoc.id;
        userData = userDoc.data();

        // Update photo and name if changed
        if (userData.photoURL !== picture || userData.displayName !== name) {
          await userDoc.ref.update({
            displayName: name || userData.displayName,
            photoURL: picture || userData.photoURL,
          });
          userData.displayName = name || userData.displayName;
          userData.photoURL = picture || userData.photoURL;
        }
      }

      // Generate JWT
      const token = jwt.sign(
        { uid: userDocId, role: userData.role, email: userData.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set HTTP-Only Cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: {
          uid: userDocId,
          email: userData.email,
          role: userData.role,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
        }
      });
    } catch (error: any) {
      console.error("Google login error detail:", error);
      
      // Fix: Check if code exists and is a string before calling startsWith
      if (error && typeof error.code === 'string' && error.code.startsWith('auth/')) {
        return res.status(401).json({ error: `Verification failed: ${error.message}` });
      }
      
      const errorMessage = error.message || String(error);
      const isPermissionDenied = errorMessage.includes('PERMISSION_DENIED') || 
                               (typeof error.code === 'number' && error.code === 7) ||
                               (error.code === 'PERMISSION_DENIED');

      if (isPermissionDenied) {
        return res.status(500).json({ 
          error: "Database permission error.",
          details: "The server session lacks permission to write to Firestore. Project ID: " + (firebaseApp.options.projectId || 'unknown'),
          hint: "Verify that the Firebase project is provisioned and the Firestore database is ready."
        });
      }

      res.status(500).json({ error: "Authentication internal error. " + errorMessage });
    }
  });

  // ================== ADMIN PROTECTED ROUTES ==================
  app.get("/api/admin/users", auth, authorizeRole("admin"), dbCheck, async (req: AuthRequest, res: Response) => {
    try {
      const usersSnapshot = await db.collection("users").get();
      const users = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        delete data.password; // Security: Never return passwords
        return data;
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users." });
    }
  });

  // ================== STUDENT PROTECTED ROUTES ==================
  app.get("/api/dashboard/stats", auth, authorizeRole("student"), async (req: AuthRequest, res: Response) => {
    res.json({ message: "Welcome to your student dashboard stats." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
