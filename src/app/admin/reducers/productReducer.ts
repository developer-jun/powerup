'use client';

// import { ContextDataCategory, Category, CategoryHierarchy, ReducerAction, ReducerEvents } from "@/types/category";
import { Product, ActionType, ReducerEvents, ContextDataProduct } from "@/types/product";
import { ReducerAction } from '@/types/common';




// state modification actions
//const SET_PRODUCT: ReducerEvents = 'set_product';
//const SET_PRODUCTS: ReducerEvents = 'set_products';

// export const reducer = (state: ContextDataProduct, action: ReducerAction<ReducerEvents, T>): ContextDataProduct => {
export function reducer<T>(state: ContextDataProduct<T>, action: ActionType<T>): ContextDataProduct<T> {
  console.log('product reducer: ', action);
  switch (action.type) {
    case 'set_product':
      return { 
        ...state, 
        selectedProduct: action.payload     
      }
    case 'set_products':
      return { 
        ...state, 
        products: action.payload
      }        
    default:
      throw new Error()
  }
}