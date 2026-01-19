/**
 * @name Components in migration target folders
 * @description Lists TSX files under src/components/atoms|molecules|organisms (primary migration targets).
 * @kind problem
 * @severity warning
 * @id custom/components-in-migration-target-folders
 */
import javascript

predicate isTargetComponentFile(File f) {
  f.getRelativePath().regexpMatch("^(src/)?components/(atoms|molecules|organisms)/.*\\.tsx$")
}

from File f
where isTargetComponentFile(f)
select f, "Component file in migration target folder"
