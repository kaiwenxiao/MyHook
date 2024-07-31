import {useMount} from "../src/hooks";
import {renderHook} from "@testing-library/react-hooks";

const mockCallback = jest.fn();

afterEach(() => {
  jest.restoreAllMocks();
})

describe("useMount", () => {
  it('should call provided callback on mount', () => {
    renderHook(() => useMount(mockCallback));

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call provided callback on unmount', () => {
    const { unmount } = renderHook(() => useMount(mockCallback));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call provided callback on rerender', () => {
    const { rerender } = renderHook(() => useMount(mockCallback));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    rerender();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  })
})
