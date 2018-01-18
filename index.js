const fs = require("fs");
const Path = require("path");
function walkDependencies(path, useDevDependencies, cb, ancestors) {
  if (!path) return null;
  const p = readPackageFromPath(path);
  if (!ancestors) ancestors = [];
  ancestors.push({ name: p.name, version: p.version });
  if (p) {
    Object.keys(returnif(p.dependencies)).forEach(key => {
      walkDependencies(resolve(key), useDevDependencies, cb, ancestors);
    });
    if (useDevDependencies) {
      Object.keys(returnif(p.devDependencies)).forEach(key => {
        walkDependencies(resolve(key), useDevDependencies, cb, ancestors);
      });
    }
    cb(path, p, ancestors);
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
