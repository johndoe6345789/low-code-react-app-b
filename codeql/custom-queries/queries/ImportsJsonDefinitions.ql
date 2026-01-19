/**
 * @name Direct JSON definition imports
 * @description Flags imports from '@/components/json-definitions' to enforce centralized exports.
 * @kind problem
 * @severity warning
 * @id custom/imports-json-definitions
 */
import javascript

from ImportDeclaration imp
where imp.getRawImportPath().regexpMatch("^@/components/json-definitions/")
select imp, "Direct JSON definition import: " + imp.getRawImportPath()
