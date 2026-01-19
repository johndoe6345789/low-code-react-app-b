/**
 * @name Imports of converted JSON components
 * @description Flags imports of components now in json-components to help update call sites.
 * @kind problem
 * @severity warning
 * @id custom/imports-converted-json-components
 */
import javascript

predicate isConvertedType(string name) {
  name = "NavigationMenu"
}

from ImportDeclaration imp, ImportSpecifier spec, string name
where
  spec = imp.getASpecifier() and
  name = spec.getImportedName() and
  isConvertedType(name) and
  imp.getRawImportPath().regexpMatch("^@/components/")
select imp, "Import converted to JSON: " + name
