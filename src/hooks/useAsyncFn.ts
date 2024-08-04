import {FunctionReturningPromise, PromiseType} from "../misc/types";
import {DependencyList, useCallback, useRef, useState} from "react";
import useMountedState from "./useMountedState";

export type AsyncState<T> = {
  loading: boolean;
  error?: undefined;
  value?: undefined;
} | {
  loading: true;
  error?: Error | undefined;
  value?: T;
} | {
  loading: false;
  error: Error;
  value?: undefined;
} | {
  loading: false;
  error?: undefined;
  value: T;
};

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> = AsyncState<
  PromiseType<ReturnType<T>>
>;

export type AsyncFnReturn<T extends FunctionReturningPromise> = [
  StateFromFunctionReturningPromise<T>,
  T
];

export default function useAsyncFn<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = {loading: false},
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const isMounted = useMountedState()
  const [state, set] = useState<StateFromFunctionReturningPromise<T>>(initialState);

  // useCallback here only store our fetch function here, multiple clicks would still trigger many fetch, see example
  // https://codesandbox.io/p/sandbox/frosty-moon-rfyjg4?file=%2Fsrc%2Fhooks%2FuseAsyncFn.ts%3A50%2C1
  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    // for sure if multiple requests in same time, more than two in pending, we don't get the first one response
    // always retrieve the result from last one. Why? Because the url is single, so we perceive that the last one
    // of batch of requests is most latest result.
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({...prevState, loading: true}));
    }

    return fn(...args).then(
      (value) => {
        isMounted() && callId === lastCallId.current && set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() && callId === lastCallId.current && set({ error, loading: false });

        return error;
      }
    ) as ReturnType<T>;
  }, deps);

  return [state, callback as unknown as T];
}