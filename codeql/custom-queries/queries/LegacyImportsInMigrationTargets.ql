/**
 * @name Legacy imports in migration targets
 * @description Flags imports from '@/components/*' inside atoms/molecules/organisms.
 * @kind problem
 * @severity warning
 * @id custom/legacy-imports-in-migration-targets
 */
import javascript

predicate isTargetComponentFile(File f) {
  f.getRelativePath().regexpMatch("^(src/)?components/(atoms|molecules|organisms)/.*\\.tsx$")
}

from ImportDeclaration imp, File f
where
  f = imp.getFile() and
  isTargetComponentFile(f) and
  imp.getRawImportPath().regexpMatch("^@/components/")
select imp, "Legacy import in migration target: " + imp.getRawImportPath()
