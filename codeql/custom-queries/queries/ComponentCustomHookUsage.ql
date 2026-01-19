/**
 * @name Custom hook usage in components
 * @description Flags calls to hooks (useX) inside src/components files to guide hook extraction.
 * @kind problem
 * @severity warning
 * @id custom/component-custom-hook-usage
 */
import javascript

predicate isComponentFile(File f) {
  f.getRelativePath().regexpMatch("^(src/)?components/.*\\.tsx$")
}

from CallExpr call, File f, VarRef ref
where
  f = call.getFile() and
  isComponentFile(f) and
  ref = call.getCallee() and
  ref.getName().regexpMatch("^use[A-Z].*")
select call, "Hook call in component: " + ref.getName()
