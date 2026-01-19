/**
 * @name Legacy component imports
 * @description Finds imports still referencing legacy components instead of JSON components.
 * @kind problem
 * @severity warning
 * @id custom/legacy-component-imports
 */
import javascript

from ImportDeclaration imp
where imp.getRawImportPath().regexpMatch("^@/components/")
select imp, "Legacy component import: " + imp.getRawImportPath()
