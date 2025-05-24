import { LoaderFunction, LoaderFunctionArgs } from "react-router";

export const secureLoader = <T extends LoaderFunction<any>>(
  load: T
): LoaderFunction<T> => {
  return async (args: LoaderFunctionArgs) => {
    return await load(args);
  };
};