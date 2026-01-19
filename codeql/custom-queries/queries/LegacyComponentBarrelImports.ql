/**
 * @name Legacy component barrel imports
 * @description Flags imports from '@/components/atoms', '@/components/molecules', '@/components/organisms', or '@/components/ui'.
 * @kind problem
 * @severity warning
 * @id custom/legacy-component-barrel-imports
 */
import javascript

from ImportDeclaration imp
where imp.getRawImportPath().regexpMatch("^@/components/(atoms|molecules|organisms|ui)(/.*)?$")
select imp, "Legacy component barrel import: " + imp.getRawImportPath()
