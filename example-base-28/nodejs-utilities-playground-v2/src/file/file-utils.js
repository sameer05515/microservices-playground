const fs = require("node:fs");
const path = require("node:path");
function readFile(filePath) { return fs.readFileSync(filePath, "utf8"); }
function writeFile(filePath, content) { fs.writeFileSync(filePath, content, "utf8"); }
function appendFile(filePath, content) { fs.appendFileSync(filePath, content, "utf8"); }
function fileExists(filePath) { return fs.existsSync(filePath); }
function getFileStats(filePath) {
  const stats = fs.statSync(filePath);
  return { size: stats.size, isFile: stats.isFile(), isDirectory: stats.isDirectory(), createdAt: stats.birthtime, modifiedAt: stats.mtime };
}
function listFiles(directoryPath) { return fs.readdirSync(directoryPath).map(name => path.join(directoryPath, name)); }
module.exports = { readFile, writeFile, appendFile, fileExists, getFileStats, listFiles };
