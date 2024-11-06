import * as fs from "fs";
import * as path from "path";

const rootDir = path.join(__dirname, "..");
const srcDir = path.join(rootDir, "src");

// Files to remove
const filesToRemove = [
  "logo.svg",
  "App.test.tsx",
  "setupTests.ts",
  "reportWebVitals.ts",
  "react-app-env.d.ts",
  "serviceWorker.ts",
];

// Create new directory structure
const directories = [
  "components",
  "contexts",
  "services",
  "styles",
  "utils",
  "hooks",
  "types",
  "assets",
];

console.log("🚀 Starting project cleanup...");

// Remove unused files
filesToRemove.forEach((file) => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Removed: ${file}`);
  }
});

// Create directories
directories.forEach((dir) => {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log(`📁 Created directory: ${dir}`);
  }
});

console.log("🎉 Cleanup complete!");
