import {useRef} from "react";
import {useEffectOnce} from "./index";

const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn)

  fnRef.current = fn

  // when component unmount will call the return function `() => fnRef.current()`
  // point free style, normally we use `useEffectOnce(fn)`, but for the return we should use `useEffectOnce(() => () => fn())`
  // the first case `fn` as effect function, the second case `fn` as cleanup function
  useEffectOnce(() => () => fnRef.current())
}

export default useUnmount