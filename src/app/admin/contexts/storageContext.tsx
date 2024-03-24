'use client';
import React, { useRef, createContext, useCallback } from "react";
import { DataType } from '@/app/admin/types/data';

function useStorage(initialData: DataType) {
  const data = useRef(initialData);
  const listeners = useRef(Array<() => void>());

  // A callable function that useSyncExternalStore uses to access the specific data
  const getSnapshot = useCallback((key: keyof DataType) => {
    //console.log('data:', data.current);
    return data.current[key]; 
  }, []);

  const set = useCallback((newPartialData: Partial<DataType>) => {
    data.current = {...data.current, ...newPartialData};
    broadcastChange(); // we need to let useSyncExternalStore know that something has changed
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    console.log('callback: ',callback);
    listeners.current = [...listeners.current, callback]; // useSyncExternalStore calls this automatically with the callback argument.
    
    return () => {
      listeners.current = listeners.current.filter(cb => cb !== callback); // this is just to avoid duplicate callback
    };
  }, []);

  const broadcastChange = () => {
    for (let listener of listeners.current) {
      listener(); // we just executing the callback that useSyncExternalStore prepared before.
    }
  }
  
  return {
    set,
    subscribe,
    getSnapshot
  };
}

export const DataContext = createContext<ReturnType<typeof useStorage> | null>(null);

// needs to be exported, mostly used on topmost level component
export function Provider({ defaultValue, children }: { defaultValue: DataType, children: React.ReactNode }) {
  return (
    <DataContext.Provider value={useStorage(defaultValue)}>
      {children}
    </DataContext.Provider>
  );
}
