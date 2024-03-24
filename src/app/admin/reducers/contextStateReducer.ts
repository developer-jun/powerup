import { ContextState } from '@/types/common'

type Action<T, U> = 
  | {
      type: 'SET_ITEM',
      payload: T
    }
  | {
      type: 'SET_ITEMS',
      payload: T[]
    }
  | {
      type: 'SET_MISC',
      payload: Partial<U> | U
    }

export const reducer = <T, U> (state: ContextState<T, U>, action: Action<T, U>): ContextState<T, U> => {
  console.log('reducer [TYPE]: ', action.type, ' [PAYLOAD]: ', action.payload);
  switch(action.type) {
    case 'SET_ITEM':
      return {
        ...state,
        item: action.payload
      }

    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload
      }

    case 'SET_MISC':
      return {
        ...state,
        misc: {
          ...state.misc,
          ...action.payload
        }
      }    
  }
}