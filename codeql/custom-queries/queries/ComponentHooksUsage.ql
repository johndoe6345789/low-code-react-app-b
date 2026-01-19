/**
 * @name React hook usage in components
 * @description Flags component files that call React hooks (likely needs custom hook extraction).
 * @kind problem
 * @severity warning
 * @id custom/component-hooks-usage
 */
import javascript

predicate isComponentFile(File f) {
  f.getRelativePath().regexpMatch("^(src/)?components/.*\\.tsx$")
}

predicate isReactHookName(string name) {
  name = "useState" or
  name = "useEffect" or
  name = "useMemo" or
  name = "useCallback" or
  name = "useReducer" or
  name = "useLayoutEffect" or
  name = "useRef"
}

from CallExpr call, File f, VarRef ref
where
  f = call.getFile() and
  isComponentFile(f) and
  ref = call.getCallee() and
  isReactHookName(ref.getName())
select call, "React hook call in component: " + ref.getName()
