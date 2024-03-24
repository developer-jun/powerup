import { ReactNode, createContext, useContext, useState } from "react";

const useData = () => {
  const [data, setData] = useState('');

  const setValue = (value: string) => {
    setData(value);
    console.log('context Value has changed to: ', value);
  }

  return { data, setValue };
}

const SimpleContext = createContext<ReturnType<typeof useData> | null>(null);

const Provider = ({children}: { children: React.ReactNode}) => {

  return (
    <SimpleContext.Provider value={useData()}>
      {children}
    </SimpleContext.Provider>
  )
}

export const useSimpleContext = (): {data: string, setValue: (value: string) => void} => {
  const state = useContext(SimpleContext);
  if(!state) return console.error('Context must be used inside Provider');

  return { data: state.data, setValue: state.setValue };
}




export default Provider;