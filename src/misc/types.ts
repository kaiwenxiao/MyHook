// if don't have any export in a file, tsc will compile it as a empty file since tree shaking

// get promise.resolve return type, infer means we don't know the type of what we extract from something now
// (in this case, "P extends Promise<infer T>" represents that something), but we get the eventually type of that.

// infer always be paired with extends
export type PromiseType<P extends Promise<any>> = P extends Promise<infer T> ? T : never;

export type FunctionReturningPromise = (...args: any[]) => Promise<any>;