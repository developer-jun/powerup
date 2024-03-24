'use client';

import { ContextDataCategory, Category, CategoryHierarchy, ReducerAction, ReducerEvents } from "@/types/category";

// state modification actions
const SET_CATEGORY: ReducerEvents = 'set_category';
const SET_CATEGORIES: ReducerEvents = 'set_categories';
const SET_HIERARCHED_CATEGORIES: ReducerEvents = 'set_hierarched_categories';

export const reducer = (state: ContextDataCategory, action: ReducerAction): ContextDataCategory => {
  console.log('reducer and type: ', action.type);
  switch (action.type) {
    case SET_CATEGORY:
      console.log('CATEGORY: ', action.payload);
      return { 
        ...state, 
        selectedCategory: action.payload as Category | null      
      }
    case SET_CATEGORIES:
      console.log('CATEGORIES: ', action.payload);
      return { 
        ...state, 
        categories: action.payload as Category[]
      }    
    case SET_HIERARCHED_CATEGORIES:
      console.log('HIERARCHED CATEGORIES: ', action.payload);
      return { 
        ...state, 
        hierarchedCategories: action.payload as CategoryHierarchy[]
      }    
    default:
      throw new Error()
  }
}