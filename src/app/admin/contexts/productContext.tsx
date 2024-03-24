'use client';

import { useReducer, createContext } from "react";
import { Product, ProductListContextData } from "@/types/product";
import { reducer as productListReducer, productListInit } from "@/app/admin/reducers/productListReducer";
import useProductContextShadow from "../hooks/useProductContextShadow";
import useUrlParams from "../hooks/useUrlParams";

const productListHub = (initState: ProductListContextData<Product>) => {
  const { getCurrentParams } = useUrlParams();
  const [contextState, dispatch] = useReducer(productListReducer, {defaultParams: initState, urlParams: getCurrentParams()}, productListInit);
  //const [contextState, dispatch] = useReducer(productListReducer, initState);
  console.log('[productContext] ', contextState); 
  //const paginate = usePaginate({itemsPerPage: 5, totalItems: contextState.productModifiers.pagination.totals});
  const shadowData = useProductContextShadow(contextState.items);
  return {
    contextState,
    dispatch,
    shadowData,
  };
};


export const ProductContext = createContext<ReturnType<typeof productListHub> | null>(null);
export const Provider = ({ initialValue, children }: { 
    initialValue: ProductListContextData<Product>, 
    children: React.ReactNode 
  }) => {
    return (
      <ProductContext.Provider value={productListHub(initialValue)}>
        {children}
      </ProductContext.Provider>
    )
}