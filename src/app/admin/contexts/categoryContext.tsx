'use client';
import { useCallback, useReducer, createContext, useRef } from "react";
import { Category, CategoryHierarchy, ContextDataCategory, ReducerAction } from "@/types/category";
import { reducer } from "@/app/admin/reducers/categoryReducer";

//export type DataType = Record<string, any>;

const categoryHub = (initState: ContextDataCategory) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const categoriesCounter = useRef(0);
  const categoryCounter = useRef(0);

  // useCallback should make sure our reference to these functions remains the same since we are passing them to the provider as it is.
  const storeCategory = useCallback(
    (category: Category | null) => {
      categoryCounter.current = categoryCounter.current + 1;
      dispatch({ 
        type: 'set_category',  
        payload: category 
      } as ReducerAction);        
    }, []);
  const storeCategories = useCallback(
    (categories: Category[]) => {
      categoriesCounter.current = categoriesCounter.current + 1;
      dispatch({ 
        type: 'set_categories', 
        payload: categories
      } as ReducerAction);
    }, []);
  const storeHierarchedCategories = useCallback(
    (categories: CategoryHierarchy[]) => {
      categoriesCounter.current = categoriesCounter.current + 1;
      dispatch({ 
        type: 'set_hierarched_categories', 
        payload: categories
      } as ReducerAction);
    }, []);
  const getTotalCategories = useCallback(
    (): number => state.categories.length
  , [state.categories]);
  
  return {
    state,
    storeCategory,
    storeCategories,
    storeHierarchedCategories,
    getTotalCategories
  }
}

export const CategoryContext = createContext<ReturnType<typeof categoryHub> | null>(null);
export const Provider = ({ initialValue, children }: { initialValue: ContextDataCategory, children: React.ReactNode }) => {
  return (
    <CategoryContext.Provider value={categoryHub(initialValue)}>
      {children}
    </CategoryContext.Provider>
  )
}