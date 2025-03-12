import { useContext, Context } from "react";

export function useGenericContext<T>(
  context: Context<T | undefined>,
  errorMessage?: string
): T {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error(
      `useGenericContext must be within a Provider: ${errorMessage}`
    );
  }
  return ctx;
}
