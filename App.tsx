import React, { useState } from 'react';
import LoadingScreen from './src/Components/LoadingScreen';
import GlobalContext from './src/Context';

import Navigator from './src/Navigator';
type IUser={
  id:number;
  name:string;
}

const App = () => {
  const [userData,setUserData]=useState<IUser>({});
  const [isLoading,setIsLoading]=useState(false);
  return (
    <GlobalContext.Provider value={{userData, setUserData, isLoading, setIsLoading}}>
      <Navigator />
      <LoadingScreen isLoading={isLoading}/>
    </GlobalContext.Provider>
  );
};

export default App;
export type {IUser};