import React from 'react'
import { CommonState } from '@/types/common';

type ActionType<T> = 
  | { type: 'set_data'; payload: T } // the CUSTOM HOOK main data source, API data results
  | { type: 'set_field'; payload: Partial<T> | T }; // most of our API calls are called inside a useEffect (after the component has been mounted), this variable state is it's dependency, we call this if we want to re-fetch the data.
  

export default function reducer<T>(
  state: CommonState<T>,
  action: ActionType<T>
): CommonState<T> {

  console.log('ch reducer: ',action);
  switch (action.type) {
    case 'set_data':
      return { 
        ...state, 
        data: action.payload // the generic part of our reducer. 
      };
    case 'set_field':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      }
    default:
      throw new Error("Unhandled action type");
  }
}
