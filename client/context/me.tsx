import { Loader } from "@mantine/core";
import { RefetchOptions, RefetchQueryFilters, useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";
import { getUser } from "../pages/api";
import { Me, QueryKeys } from "../types";

// @ts-ignore
const meContext = createContext<{user: Me, refetch:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => any }>(null)

const MeContextProvider = ({children}: {children: ReactNode}) => {
  const { data, isLoading, refetch } = useQuery([QueryKeys.me], getUser)

  return (
    <meContext.Provider value={{ user: data, refetch }}>
      { isLoading ? <Loader /> : children }
    </meContext.Provider>
  )
}

const useMe = () => useContext(meContext)

export { MeContextProvider, useMe }