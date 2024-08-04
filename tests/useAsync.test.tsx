import {useAsync} from "../src/hooks";
import {renderHook} from "@testing-library/react-hooks";
import {act, useCallback} from "react";

describe('useAsync', () => {
  it('should be defined', () => {
    expect(useAsync).toBeDefined()
  })

  describe('a success', () => {
    let hook;
    let callCount = 0

    const resolver = async () => {
      return new Promise((resolve) => {
        callCount++

        const wait = setTimeout(() => {
          clearTimeout(wait)
          resolve('done')
        }, 0)
      })
    }

    beforeEach(() => {
      callCount = 0;
      // @ts-ignore
      hook = renderHook(({fn}) => useAsync(fn, [fn]), {
        initialProps: {
          fn: resolver,
        },
      })
    })

    it('initially starts loading', async () => {
      expect(hook.result.current.loading).toEqual(true)
      await hook.waitForNextUpdate()
    })

    it('resolves', async () => {
      expect.assertions(4)

      // only component render, but can't control about hook async logic
      act(() => hook.rerender({fn: resolver}))
      // wait the hook async code total completed, so loading should be false
      await hook.waitForNextUpdate()

      expect(callCount).toEqual(1);
      expect(hook.result.current.loading).toBeFalsy();
      expect(hook.result.current.value).toEqual('done');
      expect(hook.result.current.error).toEqual(undefined);
    })
  })

  describe('an error', () => {
    let hook;
    let callCount = 0

    const rejection = async () => {
      return new Promise((_, reject) => {
        callCount++

        const wait = setTimeout(() => {
          clearTimeout(wait)
          reject('yuck')
        }, 0)
      })
    }

    beforeEach(() => {
      callCount = 0;
      // @ts-ignore
      hook = renderHook(({fn}) => useAsync(fn, [fn]), {
        initialProps: {fn: rejection},
      })
    })

    it('initially starts loading', async () => {
      expect(hook.result.current.loading).toBeTruthy()
      await hook.waitForNextUpdate()
    })

    it('resolves', async () => {
      expect.assertions(4)

      hook.rerender({fn: rejection})
      await hook.waitForNextUpdate()

      expect(callCount).toEqual(1);
      expect(hook.result.current.loading).toBeFalsy()
      expect(hook.result.current.value).toEqual(undefined)
      expect(hook.result.current.error).toEqual('yuck')
    })
  })

  describe('re-evaluates when dependencies change', () => {
    describe('the fn is a dependency', () => {
      let hook;
      let callCount = 0

      const initialFn = async () => {
        callCount++
        return 'value'
      }

      const newFn = async () => {
        callCount++
        return 'new value'
      }

      beforeEach(() => {
        callCount = 0;

        // @ts-ignore
        hook = renderHook(({fn}) => useAsync(fn, [fn]), {
          initialProps: {fn: initialFn}
        })
      })

      it('renders the first value', () => {
        expect(hook.result.current.value).toEqual('value')
      })

      it('renders a new value when deps change', async () => {
        expect.assertions(3)

        expect(callCount).toEqual(1)

        act(() => hook.rerender({fn: newFn}))

        await hook.waitForNextUpdate()

        expect(callCount).toEqual(2)
        expect(hook.result.current.value).toEqual('new value')
      })
    })
  })

  describe('the additional dependencies list changes', () => {
    let callCount = 0;
    let hook;

    const staticFunction = async (counter: number) => {
      callCount++;
      return `counter is ${counter} and callCount is ${callCount}`;
    };

    beforeEach(() => {
      callCount = 0;
      hook = renderHook(
        ({fn, counter}) => {
          const callback = useCallback(() => fn(counter), [counter]);
          // @ts-ignore
          return useAsync<any>(callback, [callback]);
        },
        {
          initialProps: {
            counter: 0,
            fn: staticFunction,
          },
        }
      );

      // hook.waitForNextUpdate().then(done);
    });

    it('initial renders the first passed pargs', () => {
      expect(hook.result.current.value).toEqual('counter is 0 and callCount is 1');
    });

    it('renders a different value when deps change', async () => {
      expect.assertions(1);

      act(() => hook.rerender({fn: staticFunction, counter: 1}))

      await hook.waitForNextUpdate();

      expect(hook.result.current.value).toEqual('counter is 1 and callCount is 2');
    });
  });
})