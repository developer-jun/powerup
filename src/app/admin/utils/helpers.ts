import React from "react";
import { SearchProductTypes } from "@/types/product"
import { ContextState, Miscellaneous } from '@/types/common'
import { reducer } from "../reducers/contextStateReducer";

export const buildQueryString = (searchArgs: SearchProductTypes) => {
  let queryString = [
    `take=${searchArgs.pagination.itemsPerPage}`,
    `skip=${searchArgs.pagination.itemsPerPage * (searchArgs.pagination.currentPage - 1)}`,
    `sortBy=${searchArgs.sorting.field}`,
    `order=${searchArgs.sorting.direction}`,
    `currentPage=${searchArgs.pagination.currentPage}`,
  ];
  if(searchArgs.filters.search)
    queryString.push(`search=${searchArgs.filters.search}`);
  if(searchArgs.filters.category)
    queryString.push(`category=${searchArgs.filters.category}`);

  return queryString.join('&');
  
}

export const formatSlug = (data: string) : string => {
  return data.replace(/[^a-zA-Z0-9- ]/g, "").replace(/ /g, "-").toLowerCase(); // used for the slug, exclude non-numeric chars
}


/**
 * Data Hub function * 
 * @param initialState 
 * @returns state objects and setter functions
 * 
 *  - We could simply place the content of this inside Provider component
 *  - BUT placing it in a function gives us flexibility while giving createContext an easy type definition via ReturnType
 */
//export const dataHub = () => {
 