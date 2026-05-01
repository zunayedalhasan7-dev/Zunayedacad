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
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Initialize Firebase Admin (Module-level state)
let firebaseApp: any;
let db: any;

const JWT_SECRET = process.env.JWT_SECRET || "zunayed-academy-super-secret-key-2024";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "xpeee01@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Zun@yedExveeXp123!";

// ================== CLOUDINARY CONFIG ==================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dw2dsrhfb",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
  fileFilter: (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
      cb(null, true);
    } else {
      cb(new Error("শুধুমাত্র JPG, PNG বা WEBP ছবি আপলোড করা যাবে।"));
    }
  },
});

// Extend Request type for custom user property
interface AuthRequest extends Request {
  user?: {
    uid: string;
    role: string;
    email: string;
  };
}

// ================== AUTH MIDDLEWARE ==================
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const authHeader = req.headers.authorization;

  // 1. Try JWT from cookie
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      return next();
    } catch (error) {
      // Continue to check header
    }
  }

      // 2. Try Firebase ID Token from Authorization header
      if (authHeader && authHeader.startsWith("Bearer ") && firebaseApp) {
        const idToken = authHeader.split("Bearer ")[1];
        try {
          const authInstance = getAuth(firebaseApp);
          const decodedToken = await authInstance.verifyIdToken(idToken);
          
          // We often need role, so we check Firestore if possible
          // Use the admin db instance which bypasses rules
          let role = "student";
          if (db) {
            try {
              const userDoc = await db.collection("users").doc(decodedToken.uid).get();
              if (userDoc.exists) {
                role = userDoc.data()?.role || "student";
              }
            } catch (dbErr: any) {
              console.error(`[Auth] Middleware DB fetch failed for UID ${decodedToken.uid}:`, dbErr.message);
              // If we can't fetch role, we still allow the request if the token is valid,
              // but fallback to the most restricted role.
            }
          }

          req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || "",
            role: role
          };
          return next();
        } catch (error: any) {
          console.error("[Auth] Firebase ID Token verification failed:", error.message);
        }
      }

  return res.status(401).json({ error: "No token provided. Please login." });
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
      const activeId = firebaseApp?.options?.projectId || 'unknown';
      return res.status(503).json({ 
        error: "Database service unavailable.", 
        details: "Firebase Admin failed to initialize or connectivity test failed.",
        projectId: activeId,
        hint: "The server-side service account lacks permissions for project '" + activeId + "'. This typically requires 'Set up Firebase' in AI Studio."
      });
    }
  next();
};

async function seedAdmin(attempt = 1) {
  const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  if (!db) {
    console.warn("Firestore database not initialized. Skipping Admin seeding.");
    return;
  }

  // Delay seeding to allow for network/IAM propagation
  if (attempt === 1) {
    console.log("Waiting for network/IAM propagation before seeding admin (40s)...");
    await new Promise(resolve => setTimeout(resolve, 40000));
  }

  try {
    console.log(`[Seed] Checking admin account (Attempt ${attempt}/7): ${ADMIN_EMAIL}`);
    // Check for admin user by email
    const userSnapshot = await db.collection("users").where("email", "==", ADMIN_EMAIL).limit(1).get();
    
    if (userSnapshot.empty) {
      console.log(`[Seed] Seeding admin account: ${ADMIN_EMAIL}`);
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const newUserRef = db.collection("users").doc();
      
      await newUserRef.set({
        uid: newUserRef.id,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        displayName: "System Admin",
        failedAttempts: 0,
        lockedUntil: null,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log("[Seed] Admin account seeded successfully.");
    } else {
      const adminDoc = userSnapshot.docs[0];
      if (adminDoc.data().role !== "admin") {
        console.log(`[Seed] Updating role to admin for ${ADMIN_EMAIL}`);
        await adminDoc.ref.update({ 
          role: "admin",
          updatedAt: FieldValue.serverTimestamp()
        });
      } else {
        console.log(`[Seed] Admin user already exists.`);
      }
    }
  } catch (error: any) {
    console.error(`[Seed] Error seeding admin (Attempt ${attempt}):`, error.message);
    const isPermissionDenied = error.message?.includes('PERMISSION_DENIED') || error.code === 7;
    
    if (attempt < 7) {
      const delay = isPermissionDenied ? 30000 : 15000;
      console.log(`[Seed] Retrying admin seeding in ${delay/1000} seconds...`);
      setTimeout(() => seedAdmin(attempt + 1), delay);
    } else {
      console.error("[Seed] Admin seeding failed after 7 attempts.");
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin (Moved from top-level to avoid blocking module load)
  try {
    const pId = firebaseConfig.projectId?.trim();
    
    if (getApps().length === 0) {
      console.log(`Initializing Firebase Admin. Project ID: ${pId || 'auto-detect'}`);
      firebaseApp = initializeApp({
        credential: applicationDefault(),
        projectId: pId, 
      });
    } else {
      firebaseApp = getApp();
    }
    
    const activeProjectId = firebaseApp?.options?.projectId;
    if (activeProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT = activeProjectId;
      process.env.GCLOUD_PROJECT = activeProjectId;
    }

    const dbId = firebaseConfig.firestoreDatabaseId;
    async function tryInitializeFirestore(databaseId?: string) {
      try {
        const dbInstance = databaseId ? getFirestore(firebaseApp, databaseId) : getFirestore(firebaseApp);
        const dbLabel = databaseId || "(default)";
        console.log(`[Firestore] Testing connectivity to database: "${dbLabel}"...`);
        
        // Timeout for test operation to avoid hanging the startup
        const testPromise = dbInstance.collection("_health_init_test").limit(1).get();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));
        
        try {
          await Promise.race([testPromise, timeoutPromise]);
          console.log(`[Firestore] SUCCESS: Connected to "${dbLabel}"`);
          return dbInstance;
        } catch (testErr: any) {
          if (testErr.message === "Timeout") {
            console.warn(`[Firestore] Timeout testing "${dbLabel}". Proceeding anyway.`);
            return dbInstance;
          }
          const isPermissionDenied = testErr.message?.includes('PERMISSION_DENIED') || testErr.code === 7;
          if (isPermissionDenied) {
            console.error(`[Firestore] PERMISSION_DENIED on "${dbLabel}".`);
            return null;
          }
          console.warn(`[Firestore] Test error for "${dbLabel}":`, testErr.message);
          return dbInstance;
        }
      } catch (e: any) {
        console.error(`[Firestore] CRITICAL init error for "${databaseId || '(default)'}":`, e.message);
        return null;
      }
    }

    // Attempt DB init
    if (dbId && dbId !== "" && dbId !== "default" && dbId !== "undefined") {
      db = await tryInitializeFirestore(dbId);
    }
    if (!db) {
      db = await tryInitializeFirestore();
    }

    if (db) {
      console.log(`[Firestore] ACTIVE Database: "${db._databaseId || '(default)'}"`);
      // Start admin seeding in background
      seedAdmin();
    } else {
      console.error("CRITICAL: Failed to initialize any Firestore database instance.");
    }
  } catch (error: any) {
    console.error("CRITICAL: Firebase initialization failed:", error.message);
  }

  // Request logger
  app.use((req, res, next) => {
    console.log(`[Incoming] ${req.method} ${req.url}`);
    next();
  });

  // Fix for express-rate-limit validation warnings in proxy environments
  app.set("trust proxy", 1);

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

  // Force JSON for all API routes and Log
  app.use("/api", (req, res, next) => {
    console.log(`[API Request] ${req.method} ${req.url}`);
    res.setHeader("Content-Type", "application/json");
    next();
  });

  // ================== COURSES API = : ADDED FOR USER REQUEST ==================
  app.get("/api/courses", dbCheck, async (req: Request, res: Response) => {
    try {
      const coursesSnapshot = await db.collection("courses")
        .where("status", "==", "published")
        .get();
      
      const courses = coursesSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(courses);
    } catch (error: any) {
      console.error("Error fetching courses API:", error.message);
      res.status(500).json({ error: "Failed to fetch courses. " + error.message });
    }
  });

  // API health check (no DB required)
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Health check for Firestore
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

    // Test Auth
    try {
      const auth = getAuth(firebaseApp);
      await auth.listUsers(1); 
      results.auth = { status: "ok" };
    } catch (error: any) {
      results.auth = { status: "error", message: error.message, code: error.code };
    }

    res.json({ 
      status: (results.named?.status === "ok" || results.default?.status === "ok") && results.auth?.status === "ok" ? "ok" : "error",
      activeProjectId: firebaseApp?.options?.projectId,
      env: {
        GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
        GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
        GCP_PROJECT: (process.env as any).GCP_PROJECT
      },
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
      const isAdminByEmail = email === ADMIN_EMAIL;
      const isCorrectPassword = password === DEFAULT_ADMIN_PASSWORD || (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);

      if (!db) {
        if (isAdminByEmail && isCorrectPassword) {
           console.warn("DB unreachable, applying emergency login fallback for admin.");
           const token = jwt.sign(
             { uid: "admin_fallback", role: "admin", email: ADMIN_EMAIL },
             JWT_SECRET,
             { expiresIn: "7d" }
           );
           res.cookie("token", token, { 
             httpOnly: true, 
             secure: true, 
             sameSite: "lax", 
             maxAge: 7 * 24 * 60 * 60 * 1000 
           });
           return res.json({
             user: { uid: "admin_fallback", email: ADMIN_EMAIL, role: "admin", displayName: "System Admin" }
           });
        }
        return res.status(503).json({ error: "Database unreachable and fallback failed." });
      }

      const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      
      if (userSnapshot.empty) {
        return res.status(401).json({ 
          error: "Invalid credentials.",
          hint: "If you just registered, ensure the database is working. Email might not exist in project: " + (firebaseApp?.options?.projectId || "unknown")
        });
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
    } catch (error: any) {
      console.error("Login error:", error);
      const isPermissionDenied = error.message?.includes('PERMISSION_DENIED') || error.code === 7;
      res.status(isPermissionDenied ? 503 : 500).json({ 
        error: isPermissionDenied ? "Database permission denied." : "Internal server error.",
        details: error.message,
        projectId: firebaseApp?.options?.projectId
      });
    }
  });

  // ================== DEDICATED ADMIN LOGIN ENDPOINT ==================
  app.post("/api/auth/admin-login", loginLimiter, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Use specific admin credentials from environment or defaults
    const isCorrectAdmin = email === ADMIN_EMAIL && 
                          (password === DEFAULT_ADMIN_PASSWORD || (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD));

    if (!isCorrectAdmin) {
      console.warn(`Unauthorized admin login attempt for email: ${email}`);
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    try {
      console.log(`Successful admin login for: ${email}`);
      
      // Generate admin token
      const token = jwt.sign(
        { uid: "admin_system", role: "admin", email: ADMIN_EMAIL },
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
          uid: "admin_system",
          email: ADMIN_EMAIL,
          role: "admin",
          displayName: "System Administrator",
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error during admin login." });
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
    } catch (error: any) {
      console.error("Registration error:", error);
      const isPermissionDenied = error.message?.includes('PERMISSION_DENIED') || error.code === 7;
      res.status(isPermissionDenied ? 503 : 500).json({ 
        error: isPermissionDenied ? "Database permission denied." : "Registration failed.",
        details: error.message,
        projectId: firebaseApp?.options?.projectId,
        hint: isPermissionDenied ? "Check if Firebase is properly provisioned in AI Studio settings." : undefined
      });
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

  // ================== PROFILE PICTURE UPLOAD ==================
  app.post("/api/upload-profile", auth, dbCheck, (req: AuthRequest, res: Response) => {
    upload.single("image")(req, res, async (err) => {
      // 1. Handle Multer Errors
      if (err instanceof multer.MulterError) {
        console.error("[Upload] Multer error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "ছবির সাইজ ১ মেগাবাইটের বেশি হতে পারবে না।" });
        }
        return res.status(400).json({ error: `ফাইল আপলোড ত্রুটি: ${err.message}` });
      } else if (err) {
        console.error("[Upload] Custom filter error:", err.message);
        return res.status(400).json({ error: err.message });
      }

      try {
        console.log(`[Upload] Request received from UID: ${req.user?.uid}`);
        
        if (!req.file) {
          console.error("[Upload] No file found in request.");
          return res.status(400).json({ error: "কোনো ছবি পাওয়া যায়নি।" });
        }

        console.log(`[Upload] Processing file: ${req.file.originalname}, Size: ${req.file.size} bytes, Mime: ${req.file.mimetype}`);

        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
          console.error("[Upload] Cloudinary keys missing in environment.");
          return res.status(500).json({ 
            error: "Cloudinary সার্ভারে কনফিগার করা নেই।",
            hint: "Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the settings."
          });
        }

        // Upload to Cloudinary using stream
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "zunayed-academy/profiles",
              resource_type: "image",
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto" }
              ],
              public_id: `user_${req.user!.uid}`
            },
            (error, result) => {
              if (error) {
                console.error("[Upload] Cloudinary SDK error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          const readableStream = new Readable();
          readableStream.push(req.file!.buffer);
          readableStream.push(null);
          readableStream.pipe(uploadStream);
        });

        const cloudinaryResult = (await uploadPromise) as any;
        console.log(`[Upload] Cloudinary success: ${cloudinaryResult.secure_url}`);
        const imageUrl = cloudinaryResult.secure_url;

        // Update Firestore user profile
        console.log(`[Upload] Updating Firestore for UID: ${req.user!.uid}`);
        await db.collection("users").doc(req.user!.uid).set({
          photoURL: imageUrl,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`[Upload] Successfully completed for UID: ${req.user!.uid}`);
        res.json({ 
          message: "প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে।",
          photoURL: imageUrl 
        });

      } catch (error: any) {
        console.error("[Upload] CRITICAL FAILURE:", error);
        res.status(500).json({ 
          error: "সার্ভারে ছবি আপলোড করতে সমস্যা হয়েছে।",
          details: error.message 
        });
      }
    });
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
      let dbError = null;
      try {
        if (!db) throw new Error("Firestore instance is not available.");
        userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      } catch (dbErr: any) {
        console.error("Firestore error in Google login:", dbErr.message);
        dbError = dbErr;
      }

      const isAdminByEmail = email === ADMIN_EMAIL;
      let userData: any;
      let userDocId: string;

      if (dbError || !db) {
        // FALLBACK: If DB is unreachable but user is ADMIN_EMAIL, allow login as admin
        if (isAdminByEmail) {
          console.warn("DB unreachable, applying fallback for admin.");
          userDocId = "admin_fallback";
          userData = {
            uid: userDocId,
            email,
            role: "admin",
            displayName: name || "Admin",
            photoURL: picture || "",
          };
        } else {
          // If not admin and DB is down, we must fail
          return res.status(503).json({ 
            error: "Database service unavailable. Please try again later.",
            details: dbError?.message || "Firestore not initialized."
          });
        }
      } else if (userSnapshot && userSnapshot.empty) {
        // Create new user
        const newUserRef = db.collection("users").doc(uid); 
        userDocId = uid;
        
        // If email matches admin email, give admin role
        const role = isAdminByEmail ? "admin" : "student";

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
      } else if (userSnapshot) {
        const userDoc = userSnapshot.docs[0];
        userDocId = userDoc.id;
        userData = userDoc.data();

        // FORCED ROLE CHECK: If email matches ADMIN_EMAIL, ensure role is admin
        if (isAdminByEmail && userData.role !== "admin") {
          console.log(`Upgrading ${email} to admin role.`);
          await userDoc.ref.update({ role: "admin" });
          userData.role = "admin";
        }

        // Update photo and name if changed
        if (userData.photoURL !== picture || userData.displayName !== name) {
          await userDoc.ref.update({
            displayName: name || userData.displayName,
            photoURL: picture || userData.photoURL,
          });
          userData.displayName = name || userData.displayName;
          userData.photoURL = picture || userData.photoURL;
        }
      } else {
        // Should not happen with current logic but for type safety
        return res.status(500).json({ error: "Unexpected auth state." });
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
      const errorCode = error.code;
      const isPermissionDenied = errorMessage.includes('PERMISSION_DENIED') || 
                               errorCode === 7 ||
                               errorCode === 'PERMISSION_DENIED';
      
      const isApiDisabled = errorMessage.includes('identitytoolkit.googleapis.com') || 
                            errorMessage.includes('has not been used') ||
                            errorMessage.includes('is disabled');

      const activeId = firebaseApp?.options?.projectId || 'unknown';

      if (isApiDisabled) {
        return res.status(503).json({
          error: "Firebase API not enabled.",
          details: errorMessage,
          hint: `The Identity Toolkit API is disabled in project "${activeId}". Please click 'Set up Firebase' in AI Studio settings to enable Authentication and Firestore.`
        });
      }

      if (isPermissionDenied) {
        return res.status(503).json({ 
          error: "Database permission error.",
          details: errorMessage,
          hint: `The service account lacks permission to project "${activeId}". Please ensure Firebase is properly provisioned in AI Studio.`
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
  
  // API route not found handler
  app.all("/api/*all", (req, res) => {
    console.log(`[API 404] No match for: ${req.url}`);
    res.status(404).json({ 
      error: "API route not found", 
      path: req.url,
      method: req.method,
      message: "The requested API endpoint does not exist on this server."
    });
  });

  // Catch any other /api requests that might have slipped through
  app.all("/api", (req, res) => {
    res.status(404).json({ error: "API base route not found" });
  });

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("CRITICAL UNHANDLED ERROR:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message || "An unexpected error occurred",
      detail: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
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
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
