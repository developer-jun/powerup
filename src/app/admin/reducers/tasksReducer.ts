import { Task } from "../types/task";

export const initialTasks: Task[] = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];


export const tasksReducer = (state: Task[], action: any) => {
  switch (action.type) {
    case 'added': {
      return [...state, {
        id: action.id,
        text: action.text,
        done: false
      } as Task];
    }
    case 'changed': {
      return state.map(_task => {
        if (_task.id === action.task.id) {
          return action.task;
        } else {
          return _task;
        }
      });
    }
    case 'deleted': {
      return state.filter(_task => _task.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

