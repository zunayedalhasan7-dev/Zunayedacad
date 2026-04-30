import { execSync } from 'child_process';
try {
  const result = execSync('git log -n 5 --oneline').toString();
  console.log("GIT LOG:", result);
} catch (e) {
  console.error("GIT ERROR:", e);
}
