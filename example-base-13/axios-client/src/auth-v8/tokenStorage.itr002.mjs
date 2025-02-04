import fs from "fs";
import path from "path";

// Get the directory name using `import.meta.url`
const __dirname = new URL(".", import.meta.url).pathname;
const TEMP_DIR = path.join(__dirname, "temp");
const TOKEN_FILE_PATH = path.join(TEMP_DIR, "token.temp");

// const TOKEN_FILE_PATH = path.join(__dirname, "token.temp");

export const saveTokenToFile = (token /**: string*/) => {
  // Check if the directory exists; if not, create it
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }
  fs.writeFileSync(TOKEN_FILE_PATH, token, { encoding: "utf-8" });
};

export const getTokenFromFile = () /**: string | null*/ => {
  try {
    return fs.readFileSync(TOKEN_FILE_PATH, { encoding: "utf-8" });
  } catch (error) {
    return null;
  }
};

export const clearTokenFile = () => {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    fs.unlinkSync(TOKEN_FILE_PATH);
  }
};
