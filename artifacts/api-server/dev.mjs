import { execSync } from "node:child_process";

process.env.NODE_ENV = "development";
execSync("npm run build", { stdio: "inherit" });
execSync("npm run start", { stdio: "inherit" });
