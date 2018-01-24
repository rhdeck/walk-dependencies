const fs = require("fs");
const Path = require("path");
function getModulePath(m, pathArray) {
  //OK, so lets find this package
  var out = null;
  pathArray.forEach(path => {
    if (!path) return;
    if (out) return;
    while (true) {
      if (!path) break;
      const mp = scanNodeModules(m, path);
      if (mp) {
        out = mp;
        break;
      }
      path = Path.dirname(path);
      if (fs.existsSync(Path.join(path, "package.json"))) {
        break;
      }
    }
  });
  return out;
}
function scanNodeModules(m, path) {
  const nmp = Path.join(path, "node_modules");
  if (!fs.existsSync(nmp)) return null;
  const mp = Path.join(nmp, m);
  if (fs.existsSync(mp)) return mp;
  return null;
}
function walkDependencies(
  path,
  useDevDependencies,
  cb,
  ancestors,
  ancestorpaths
) {
  if (!path) return null;
  path = getPackagePath(path);
  const p = readPackageFromPath(path);
  var dobreak = false;
  if (ancestors) {
    ancestors.forEach(o => {
      if (o.name == p.name) {
        dobreak = true;
      }
    });
  }
  if (!ancestorpaths) ancestorpaths = [];
  ancestorpaths.push(path);
  if (dobreak) return null;
  if (!ancestors) ancestors = [];
  if (p) {
    ancestors.push({ name: p.name, version: p.version });
    const ds = returnif(p.dependencies);
    Object.keys(ds).forEach(key => {
      try {
        walkDependencies(
          getModulePath(key, ancestorpaths),
          useDevDependencies,
          cb,
          ancestors
        );
      } catch (e) {}
    });
    if (useDevDependencies) {
      Object.keys(returnif(p.devDependencies)).forEach(key => {
        try {
          walkDependencies(
            getModulePath(key, ancestorpaths),
            useDevDependencies,
            cb,
            ancestors
          );
        } catch (e) {}
      });
    }
    cb(path, p, ancestors);
  } else {
  }
}
function returnif(obj) {
  if (obj) return obj;
  else return {};
}
function getPackagePath(path) {
  if (!path) path = process.cwd();
  const op = path;
  //Now iterate until you find a package or hit node_modules
  while (true) {
    if (Path.basename(path) == "node_modules") break;
    const packagePath = Path.resolve(path, "package.json");
    if (fs.existsSync(packagePath)) {
      //we done
      return path;
    }
    path = Path.dirname(path);
  }
}
function readPackageFromPath(path) {
  const packagePath = Path.resolve(path, "package.json");
  if (fs.existsSync(packagePath)) {
    str = fs.readFileSync(packagePath, "utf8");
    try {
      const package = JSON.parse(str);
      return package;
    } catch (err) {}
  }
}
module.exports = walkDependencies;
