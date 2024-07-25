import useMountedState from "../src/hooks/useMountedState";
import {renderHook} from "@testing-library/react-hooks";

// jest rely on babel to transpile the file firstly
describe('', () => {
  it('should be defined', () => {
    expect(useMountedState).toBeDefined();
  })

  it('should return a function', () => {
    const hook = renderHook(() => useMountedState(), { initialProps: false });

    expect(typeof hook.result.current).toEqual('function');
  })
})