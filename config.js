import {
  resolve
} from "path";
import {
  existsSync
} from "fs";

const envFile = process.env.NODE_ENV == "development" ? ".env" : ".env.prod";
const envPath = resolve(process.cwd(), envFile);
const defaultEnvPath = resolve(process.cwd(), ".env");

require("dotenv").config({
  path: existsSync(envPath) ? envPath : defaultEnvPath
});