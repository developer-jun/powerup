import { MessagePrompt } from '@/types/common';

export type JSONData = {
  status: string,
  message: string,
  data?: Array<Category> | Category | undefined
}

export type Category = {
  id?         : number;
  name        : string | null;
  slug        : string;
  description : string;
  parent      : number | null;
  count?      : number;
  createdAt?  : Date; 
  updatedAt?  : Date;
}

export type CategoryHierarchy = Category & {
  children? : CategoryHierarchy[]
}

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
};


export type StateTypes = {
  category: CategoryForm,
  form: FormState,
  alertPrompt: MessagePrompt
}

export type FormState = {
  isProcessing: boolean, 
  hasSlugManuallyChanged: boolean, 
}

// TODO: remove if nothing else is using it
export interface ICategory {
  id          : number;
  name        : string;
  slug        : string;
  description : string;
  parent      : number;
  count       : number;
}
export interface ICategoryFull {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
}

export type CategoryForm = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
}

export type FormPrompt = {
  message: string;
  type: string;
}

export type ContextDataCategory = {
  categories: Category[];
  hierarchedCategories: CategoryHierarchy[];
  selectedCategory: Category | null;
}

export type ReducerEvents = 'set_category' | 'set_categories' | 'set_hierarched_categories'; // this will give intellisense to those that use this type
export type ReducerAction = {
  type: ReducerEvents,
  payload: any,
}


export type DropdownOption = {
  label: string,
  value: number | undefined,
}