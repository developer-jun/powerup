import { Option } from "./option"
import { Category } from "./category"
import { Product } from "./product"

export interface ContextState<T, U> {
  item: T,
  items: T[],
  misc: U
}

export type ContextState2 = 
  | { type: 'option', item: Option, items: Option[] }
  | { type: 'category', item: Category, items: Category[] }
  | { type: 'product', item: Product, items: Product[] }

export type ContextState3 = {    
  item: Option | Product | Category, 
  items: Option[] | Product[] | Category[], 
}

export type Miscellaneous = {
  message: MessagePrompt | null,
  loading: boolean,
}

type ContextSpecific = 
| { type: 'option' }
| { type: 'product' }
| { type: 'category' }

export type ContextMisc = Miscellaneous & ContextSpecific



interface OptionContextState {
  item: Option,
  items: Option[]
}

interface CategoryContextState {
  item: Category,
  items: Category[]
}

interface ProductContextState {
  item: Product,
  items: Product[]
}

export type TheContextState = OptionContextState | CategoryContextState | ProductContextState








export type MessagePrompt = {
  messageType: 'success' | 'error' | 'warning' | undefined; // why not just the word 'type'? Boils down to it's usage down in the component, such that {form.messageType} is more concise than just {form.type}
  message: string;  
};

export type ComponentForm = MessagePrompt & {
  action: 'standby' | 'processing' | 'complete';
};

export type ComponentForm2 = 
  | { action: 'standby' } 
  | { action: 'processing' }
  | ({ action: 'complete' } & MessagePrompt);


export type QueryReturnType<T> = {  
  status: 'success' | 'error';
  message: string;
  data: T | T[];
  errorDetails?: string,  
}

export type QueryReturn<T> = 
  | { status: 'success'; data: T | T[] }
  | { status: 'error'; message: string; details: string};


export type JSONReturn<T> = 
  | { status: 'success'; data: T | T[] }
  | { status: 'error'; message: string; details: string};

export type FetchResult<T> = {
    data: T[] | null;
    loading: boolean;
    message: MessagePrompt | null;
  };


/*
export type JSONReturn<T> = {
  status: string;
  message: string;
  details?: string;
  data: T | null;
}
*/

export type CommonState<T> = {
  data: T;
}

export type CustomHookActions = 'set_loading' | 'set_message' |'refresh_controller';
export type CustomHookStateType<T> = {
  loading: boolean;
  message: MessagePrompt | null;
  useEffectController: number;
  data: T | null;
  count: number;
}


export type ComponentStatus = 'init' | 'loaded' | 'unloaded';

// export type ReducerEvents = 'set_category' | 'set_categories' | 'set_hierarched_categories'; // this will give intellisense to those that use this type
// this will ensure that when dispatching, user has to use the correct type for it to work.
// dispatch({type: 'reducer_action', payload: 1} as ReducerAction<'reducer_action', number>);
export type ReducerAction<T, V> = {
  type: T,
  payload: V | null,
}


// generic testing only
const addIdToObject = <T>(obj: T): T & { id: string } => {
	return {
		...obj,
		id: '123'
	}
}