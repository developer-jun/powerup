// global constants
export const ACTIONS = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  ADD: 'add',
  RESET: 'reset',
}

// Could become complicated for larger projects, having a structure defined here make's it more clearer
interface Action {
  type: string,
  payload?: any
}
// might be helpful to visualize the content of our state.
interface State {
  count: number,  
}


// Initial value as well as structure of our state
export const COUNT_INITIAL_STATE : State = {
  count: 0
}

// pure function
export const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      return { ...state, count: state.count + 1 }
    case ACTIONS.DECREMENT:
      return { ...state, count: state.count - 1 }
    case ACTIONS.ADD:
      return { ...state, count: action.payload }
    case ACTIONS.RESET:
      return { ...state, count: state.count = 0}
    default:
     return { state }
  }
}