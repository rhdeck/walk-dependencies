# walk-dependencies

Function for recursively walking dependencies of a project

# Usage

```
wd = require("@raydeck/walk-dependencies");
wd(process.cwd(), false, (path, projectObj) => {
    console.log("My path is " + path)
    console.log("Project file contains:")
    console.log(JSON.stringify(projectObj, null, 2))
});
```
