import React from 'react'
import { MessagePrompt, CustomHookStateType, CustomHookActions } from '@/types/common';

type ActionType<T> = 
  | { type: 'set_data'; payload: T } // the CUSTOM HOOK main data source, API data results
  | { type: 'set_count'; payload: number }
  | { type: 'set_loading'; payload: boolean } // loader controller
  | { type: 'set_message'; payload: MessagePrompt } // messages prompts
  | { type: 'refresh_controller'; payload: null }
  | { type: 'set_all'; payload: {
      data: T;
      count: number;
      loading: boolean;
      message: MessagePrompt;
    }}; // most of our API calls are called inside a useEffect (after the component has been mounted), this variable state is it's dependency, we call this if we want to re-fetch the data.
  

export default function reducer<T>(
  state: CustomHookStateType<T>,
  action: ActionType<T>
): CustomHookStateType<T> {

  console.log('ch reducer: ',action);
  switch (action.type) {
    case 'set_data':
      return { 
        ...state, 
        data: action.payload // the generic part of our reducer. 
      };
    case 'set_count':
      return {
        ...state, 
        count: action.payload
      }
    case 'set_loading':
      return {
        ...state,
        loading: action.payload as boolean,
      };
    case 'set_message':
      return {
        ...state,
        message: action.payload as MessagePrompt,
      };
    case 'refresh_controller':
      return {
        ...state,
        useEffectController: state.useEffectController + 1,
      };
    case 'set_all':
      return { 
        ...state,         
        ...action.payload // the generic part of our reducer. 
      };
    default:
      throw new Error("Unhandled action type");
  }
}
