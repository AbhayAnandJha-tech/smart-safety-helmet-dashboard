import * as fs from "fs";
import * as path from "path";

const srcDir = path.join(__dirname, "../src");
const publicDir = path.join(__dirname, "../public");

const unusedFiles = [
  // src directory
  { path: path.join(srcDir, "logo.svg"), type: "file" },
  { path: path.join(srcDir, "App.test.tsx"), type: "file" },
  { path: path.join(srcDir, "setupTests.ts"), type: "file" },
  { path: path.join(srcDir, "reportWebVitals.ts"), type: "file" },
  { path: path.join(srcDir, "react-app-env.d.ts"), type: "file" },
  { path: path.join(srcDir, "serviceWorker.ts"), type: "file" },

  // public directory
  { path: path.join(publicDir, "logo192.png"), type: "file" },
  { path: path.join(publicDir, "logo512.png"), type: "file" },
  { path: path.join(publicDir, "robots.txt"), type: "file" },
  { path: path.join(publicDir, "manifest.json"), type: "file" },
];

console.log("🔍 Checking for unused files...");

unusedFiles.forEach((file) => {
  if (fs.existsSync(file.path)) {
    console.log(`❌ Found unused file: ${file.path}`);
    try {
      fs.unlinkSync(file.path);
      console.log(`✅ Removed: ${file.path}`);
    } catch (error) {
      console.error(`❌ Error removing ${file.path}:`, error);
    }
  }
});

console.log("✨ Cleanup check complete!");
