import useRafState from "./useRafState";
import {isBrowser, off, on} from "../misc/util";
import {useEffect} from "react";

export interface State {
  x: number;
  y: number;
}

const useWindowScroll = (): State => {
  const [state, setState] = useRafState<State>(() => ({
    x: isBrowser ? window.pageXOffset : 0,
    y: isBrowser ? window.pageYOffset : 0,
  }));

  useEffect(() => {
    const handler = () => {
      setState((state) => {
        const {pageXOffset, pageYOffset} = window

        return state.x !== pageXOffset || state.y !== pageYOffset
          ? {
            x: pageXOffset,
            y: pageYOffset,
          }
          : state
      })
    }

    handler()

    on(window, 'scroll', handler, {
      capture: false,
      passive: true,
    })

    return () => {
      off(window, 'scroll', handler)
    }
  }, []);


  return state;
}

export default useWindowScroll;