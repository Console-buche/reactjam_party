import React from 'react';

/** @see https://antfu.me/posts/destructuring-with-object-or-array */
export function createIsomorphicDestructurable<
  T extends Record<string, unknown>,
  //@
  A extends readonly any[],
>(obj: T, arr: A): T & A {
  const clone = { ...obj };

  Object.defineProperty(clone, Symbol.iterator, {
    enumerable: false,
    value() {
      let index = 0;
      return {
        next: () => ({
          value: arr[index++],
          done: index > arr.length,
        }),
      };
    },
  });

  return clone as T & A;
}

export interface CreateContextOptions<Value, Initial extends Value = Value> {
  /**
   * If `true`, React will throw if context is `null` or `undefined`
   * In some cases, you might want to support nested context, so you can set it to `false`
   */
  strict?: boolean;
  /**
   * Error message to throw if the context is `undefined`
   */
  errorMessage?: string;
  /**
   * The display name of the context
   */
  name: string;
  /**
   * The display name of the context
   */
  initialValue?: Initial | undefined;
}

type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>] & {
  Provider: React.Provider<T>;
  hook: () => T;
  Context: React.Context<T>;
  Consumer: React.Consumer<T>;
};

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
export function createContextWithHook<ContextType>(
  options: CreateContextOptions<ContextType>,
): CreateContextReturn<ContextType>;
export function createContextWithHook<ContextType>(
  name: string,
  options?: CreateContextOptions<ContextType>,
): CreateContextReturn<ContextType>;
export function createContextWithHook<ContextType>(
  nameOrOptions: string | CreateContextOptions<ContextType>,
  optionsProp: CreateContextOptions<ContextType> = { name: undefined },
): CreateContextReturn<ContextType> {
  const options =
    typeof nameOrOptions === 'string' ? optionsProp : nameOrOptions;
  const name = typeof nameOrOptions === 'string' ? nameOrOptions : options.name;
  const {
    strict = false,
    errorMessage = `useContext: "${
      name || 'context'
    }" is undefined. Seems you forgot to wrap component within the Provider`,
  } = options;

  const Context = React.createContext<ContextType | undefined>(
    options.initialValue,
  );

  Context.displayName = name;

  function useContext() {
    const context = React.useContext(Context);

    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = 'ContextError';

      // @ts-ignore
      Error.captureStackTrace?.(error, useContext);
      throw error;
    }

    return context;
  }

  return createIsomorphicDestructurable(
    {
      Consumer: Context.Consumer,
      hook: useContext,
      Context: Context,
      Provider: Context.Provider,
    },
    [Context.Provider, useContext, Context],
  ) as CreateContextReturn<ContextType>;
}
