const fs = require("fs");
const Path = require("path");
function walkDependencies(path, useDevDependencies, cb) {
  if (!path) return null;
  const p = readPackageFromPath(path);
  if (p) {
    Object.keys(returnif(p.dependencies)).forEach(key => {
      walkDependencies(resolve(key), useDevDependencies);
    });
    if (useDevDependencies) {
      Object.keys(returnif(p.devDependencies)).forEach(key => {
        walkDependencies(resolve(key), useDevDependencies);
      });
    }
  }
}
function returnif(obj) {
  if (obj) return obj;
  else return {};
}
function readPackageFromPath(path) {
  if (!path) path = process.cwd();
  const packagePath = Path.resolve(path, "package.json");
  if (!fs.existsSync(packagePath)) return;
  str = fs.readFileSync(packagePath, "utf8");
  try {
    const package = JSON.parse(str);
    return package;
  } catch (err) {}
}
module.exports = walkDependencies;
