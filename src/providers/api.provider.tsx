"use client";
import { useGenericContext } from "@/hooks/useGenericContext";
import { api } from "@/services/api";
import React, { createContext, useContext } from "react";
import AuthContext from "./AuthContext";

type APIType = ReturnType<typeof api>;

export const APIContext = createContext<APIType | undefined>(undefined);

type WithApiProps = {
  api: APIType;
};

export const withApi =
  <P extends object>(Component: React.ComponentType<P & WithApiProps>) =>
  (props: P) => {
    const _api = useContext(APIContext);
    if (!_api) throw Error("withApi must be used in Api Provider.");
    return <Component {...props} api={_api} />;
  };

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useGenericContext(AuthContext);

  const AuthHeaders: { role?: string; Authorization?: string } = {};

  AuthHeaders.Authorization = `Bearer ${accessToken}`;
  // TODO: handle when user is not logged in case
  const _api = api(AuthHeaders);

  return <APIContext.Provider value={_api}>{children}</APIContext.Provider>;
};
