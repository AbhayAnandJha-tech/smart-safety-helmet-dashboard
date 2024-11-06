// Run this script to check for unused dependencies
import { exec } from "child_process";
import * as fs from "fs";

const checkUnusedDependencies = () => {
  exec("depcheck", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log("Unused dependencies:");
    console.log(stdout);
  });
};

// Run: npx ts-node cleanup.ts
checkUnusedDependencies();
