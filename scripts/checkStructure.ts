import * as fs from "fs";
import * as path from "path";

const requiredFiles = [
  "src/index.tsx",
  "src/App.tsx",
  "src/components/Dashboard.tsx",
  "src/components/LandingPage.tsx",
  "src/components/WorkerMonitoring.tsx",
  "src/components/SafetyMap.tsx",
  "src/components/SafetyStats.tsx",
  "src/components/AlertManagement.tsx",
  "src/components/InfiniteMine.tsx",
  "src/components/MiningLocationTracker.tsx",
  "src/services/firebase.ts",
  "src/services/workerMonitoring.ts",
  "src/services/AlertService.ts",
  "src/services/DataSimulator.ts",
  "src/contexts/AuthContext.tsx",
  "src/contexts/SafetyContext.tsx",
  "src/styles/index.css",
  "src/styles/Dashboard.css",
  "src/styles/LandingPage.css",
  "src/styles/WorkerMonitoring.css",
  ".env",
  "package.json",
  "tsconfig.json",
];

const unnecessaryFiles = [
  "src/logo.svg",
  "src/App.test.tsx",
  "src/setupTests.ts",
  "src/reportWebVitals.ts",
  "src/react-app-env.d.ts",
  "src/serviceWorker.ts",
  "src/firebase.tsx",
  "src/firebase/Firebase.tsx",
  "public/logo192.png",
  "public/logo512.png",
  "public/robots.txt",
  "public/manifest.json",
];

console.log("🔍 Checking project structure...\n");

// Check required files
console.log("Required files check:");
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${exists ? "✅" : "❌"} ${file}`);
});

console.log("\nChecking for unnecessary files:");
unnecessaryFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    console.log(`⚠️  Found unnecessary file: ${file}`);
  }
});
