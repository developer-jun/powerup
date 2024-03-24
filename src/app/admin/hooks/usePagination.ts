import React, { useEffect, useRef, useState } from 'react'
import { Product, Pagination } from '@/types/product';
import useProductsShadow from './useProductsShadow';
import { PRODUCT } from '../utils/constants';
/**
 * Pagination Hook
 * - Store data related to pagination
 * - Pagination related info only so that it can be reused
 * - If we add filters then it would be too specific to one page like products.
 * 
 * How should the data be received?
 * - On instantiation it's starts with empty array and the default pagination settings
 * - As the data trickles in, we passed that data via an exposed functions
 *   - addData(data: Product[] | null) - where we add the array of products into our localData variable
 *   - addTotal(total: number) - the api result count method.
 *   - setCurrentPage(pagenum: string) - given the page number, we can compute the startIndex and endIndex
 *     - startIndex = pagenum * itemsPerPage;
 *     - endIndex = startIndex + ((totals >= startIndex + itemsPerPage)?startIndex + itemsPerPage:totals);
 */

type PageIndex = {
  startIndex: number;
  endIndex: number; 
}
export default function usePagination<T>({
  data,
  pagination,
}: {
  data: T[];
  pagination: Pagination;
}) {
  // local data storage
  const localData = useRef([...data]);    
  // Create a dictionary to track page indices
  const pageIndices = useRef<Record<number, PageIndex> | null>(null);
  // required for the pagination settings if we want to store it here.
  const paginationObject = useRef<Pagination>(pagination);
  
  /**
   * Check if the given page number which is the ceiling is found in the list of indices
   * @param page used to be empty as we reply on the local paginationObject which has the property: pageCount
   * @returns true if found else false
   */
  const isCeiling = (page: number = 0): boolean => {
    return Boolean(pageIndices.current && pageIndices.current[page]);
  }

  // uses paginationObject to check the ceiling
  //const isCeiling = (): boolean => {
  //  return Boolean(pageIndices.current 
  //    && paginationObject 
  //    && pageIndices.current[paginationObject.current.pageCount]);    
  //}

  // will fall under single reponsibility, could just integrate it with updateData
  const addPageIndex = (page: number, indices: PageIndex) =>{
    console.log('[addPageIndex]: ', page, indices);
    if(!pageIndices.current) pageIndices.current = {};
    pageIndices.current[page] = indices;

    console.log('[addPageIndex] result: ', pageIndices.current);
  }

  // Update the local data (e.g., after fetching new data)
  const updateData = ({data, pageNumber, paginationData}: {data: T[] | null, pageNumber: number, paginationData?: Partial<Pagination> | null}): void => {
    console.log('[updateData] ',pageNumber, data);
    const total = (localData.current) ? localData.current.length : 0;
    let indices: PageIndex = {startIndex: total, endIndex: total}
    
    // currently not used, but we might want to use it later.
    /*
    if(paginationData) {
      if(paginationData.pageCount 
          && pageIndices.current 
          && pageIndices.current[paginationData.pageCount]) {
            console.log('exiting: [updateData]');
            return; // exit early and no need to proceed
          }
      console.log(paginationData);
      paginationObject.current = {...paginationObject.current, ...paginationData};        
    }
    */

    // step 1: check if page already exists
    if(data && data.length > 0) {
      //console.log('[updateData] is called');
      //console.log(data);
      // localData.current?.push(...data);
      //setLocalData(prevState=>[...prevState, ...data]);
      for (let i = 0; i < data.length; i++) {
        localData.current.push(data[i]);
      }

      indices.endIndex = (localData.current) ? localData.current.length : 0;      
      addPageIndex(pageNumber, indices);
      console.log('[updateData] result: ', localData.current);
    }
  };
  const updateUserSelection = (userSelection: boolean) => {
    if(localData.current) {
      //for (let i = 0; i < paginationObject.current.length; i++) {
      //  localData.current[i].idSelected = paginationObject.current[i];
      //}

      localData.current = localData.current.map(item=>({...item, isSelected: userSelection}));
    }
  }

  // Get data for the specified page
  const getPageData = (page: number): T[] | boolean => {
    console.log('[getPageData] page:', page);
    console.log(pageIndices.current);
    console.log('[localData.current]',localData.current);
    if(!pageIndices.current || !pageIndices.current[page]) return false; // guard
    
    //const startIndex = (page - 1) * paginationObject.current.itemsPerPage;
    //const endIndex = Math.min(startIndex + paginationObject.current.itemsPerPage, localData.current?.length || 0);
    
    return localData.current?.slice(pageIndices.current[page].startIndex, pageIndices.current[page].endIndex) || [];
  };

  const pageIndexExists = (page: number): boolean => {
    if(pageIndices.current && pageIndices.current[page]) {
      return true;
    }
    return false;  
  }

  /*
  const refreshLocalData = ({shadowQueryString, pageNumber}
    :{shadowQueryString: string, pageNumber: number }) => {
      console.log('[refreshLocalData]');
      console.log(shadowQueryString)
      //refreshLocalData({shadowQueryString, currentPage: productState.pagination.currentPage});
      
      //const abortController = new AbortController();
      //fetchShadowProducts({shadowQueryString, currentPage: productState.pagination.currentPage, signal: abortController.signal});
      //return () => {
      //  abortController.abort(); // if user deliberately cancelled the operation, this will trigger and fetchProducts will also be notified, if there's still pending API request, it will be aborted thus prevent any possible data mismatched.
      //}

    if(shadowQueryString) {
      querystring.current = shadowQueryString;
      currentPage.current = pageNumber; // could also trigger useEffect
      localDataRefresher.current = localDataRefresher.current + 1; // trigger the useEffect
    }
    
  }  
  const fetchShadowProducts = async (signal: AbortSignal) => { 
    if(querystring.current) {
      console.log('[fetchShadowProducts]')
      console.log('[shadowQueryString]: ', querystring.current);   
      const shadowData = await fetchProducts(PRODUCT.api_url.concat('?', querystring.current), signal);
      console.log('[shadowData]: ', shadowData);
      if(shadowData) {
        updateData({data: shadowData, pageNumber: currentPage.current});
      }
    }
  }
  useEffect(()=>{
    console.log('[usePagination]: ');
    //console.log(local);
    console.log(localData.current);
    console.log(pageIndices.current);
    
    const abortController = new AbortController();
    fetchShadowProducts(abortController.signal);

    return () => {
      abortController.abort();
    }    
  }, [localDataRefresher.current]);
  */
  return { getPageData, updateData, updateUserSelection, isCeiling, pageIndexExists };
}