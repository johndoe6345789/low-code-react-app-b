/**
 * @name Component files with JSX
 * @description Lists component TSX files that contain JSX (candidate for JSON conversion).
 * @kind problem
 * @severity warning
 * @id custom/component-files-with-jsx
 */
import javascript
import semmle.javascript.JSX

predicate isComponentFile(File f) {
  f.getRelativePath().regexpMatch("^src/components/.*\\.tsx$")
}

from JsxElement jsx, File f
where f = jsx.getFile() and isComponentFile(f)
select f, "Component file contains JSX"
