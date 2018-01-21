const fs = require("fs");
const Path = require("path");
function walkDependencies(path, useDevDependencies, cb, ancestors) {
  if (!path) return null;
  const p = readPackageFromPath(path);
  if (!ancestors) ancestors = [];
  if (p) {
    ancestors.push({ name: p.name, version: p.version });
    const ds = returnif(p.dependencies);
    const nm = Path.resolve(path, "node_modules");
    Object.keys(ds).forEach(key => {
      const paths = [nm, ...require.resolve.paths(key)];
      try {
        walkDependencies(
          require.resolve(key, { paths: paths }),
          useDevDependencies,
          cb,
          ancestors
        );
      } catch (e) {
        //console.log("Coudl not find dependency", key);
      }
    });
    if (useDevDependencies) {
      Object.keys(returnif(p.devDependencies)).forEach(key => {
        const paths = [nm, ...require.resolve.paths(key)];
        try {
          walkDependencies(
            require.resolve(key, { paths: paths }),
            useDevDependencies,
            cb,
            ancestors
          );
        } catch (e) {
          // console.log("Coudl not find dependency", key);
        }
      });
    }
    cb(path, p, ancestors);
  } else {
    console.log("No package at ", path);
  }
}
function returnif(obj) {
  if (obj) return obj;
  else return {};
}
function readPackageFromPath(path) {
  if (!path) path = process.cwd();
  if (!fs.existsSync(path)) return {};
  if (!fs.statSync(path).isDirectory()) path = Path.dirname(path);
  const packagePath = Path.resolve(path, "package.json");
  if (!fs.existsSync(packagePath)) return;
  str = fs.readFileSync(packagePath, "utf8");
  try {
    const package = JSON.parse(str);
    return package;
  } catch (err) {}
}
module.exports = walkDependencies;
