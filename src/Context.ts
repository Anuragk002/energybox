import { createContext } from "react";

const GlobalContext = createContext({
  userData: [],
  setUserData: (user:any) => [],
  isLoading: false,
  setIsLoading: (input:boolean) => {}
});

export default GlobalContext ;