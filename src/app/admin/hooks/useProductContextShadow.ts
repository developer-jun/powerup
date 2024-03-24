import { useRef } from 'react'
import { Product, Pagination, PageRange, Sorting, ProductSorting } from '@/types/product';
/**
 * Shadow of Product Context Hook
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
export default function useProductContextShadow({
  data,
}: {
  data: Product[];
}) {
  // local data storage
  const localData = useRef<Product[]>([]);    
  // Create a dictionary to track page indices
  const pageIndices = useRef<Record<number, PageIndex> | null>(null);
  
  // will fall under single reponsibility, could just integrate it with updateData
  const addPageIndex = (page: number, indices: PageIndex) =>{
    console.log('[addPageIndex]: ', page, indices);
    if(!pageIndices.current) pageIndices.current = {};
    pageIndices.current[page] = indices;

    console.log('[addPageIndex] result: ', pageIndices.current);
  }

  // Update the local data (e.g., after fetching new data)
  const setData = ({data}: {data: Product[] | null}): void => {
    console.log('[setData] ',data);
    //const total = (localData.current) ? localData.current.length : 0;
    //let indices: PageIndex = {startIndex: total, endIndex: total}

    // step 1: check if page already exists
    if(data && data.length > 0) {
      //for (let i = 0; i < data.length; i++) {
      //  localData.current.push(data[i]);
      //}
      localData.current = [...data];

      //indices.endIndex = (localData.current) ? localData.current.length : 0;      
      //addPageIndex(pageNumber, indices);
      //console.log('[updateData] result: ', localData.current);
    }
  };

  // Update the local data (e.g., after fetching new data)
  const updateData = ({data, pageNumber, paginationData}: {data: Product[] | null, pageNumber: number, paginationData?: Partial<Pagination> | null}): void => {
    console.log('[updateData] ',pageNumber, data);
    const total = (localData.current) ? localData.current.length : 0;
    let indices: PageIndex = {startIndex: total, endIndex: total}

    // step 1: check if page already exists
    if(data && data.length > 0) {
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
      localData.current = localData.current.map(item=>({...item, isSelected: userSelection}));
    }
  }

  const sortData = (sort: ProductSorting) => {
    if(localData.current) {      
      if(sort.field === 'price') {
        localData.current = localData.current.sort((a, b) => {
          let valueA = (a[sort.field] as Partial<Product>) as number;
          let valueB = (b[sort.field] as Partial<Product>) as number;
          
          if (sort.direction === 'desc') {
            [valueA, valueB] = [valueB, valueA]; // Swap values for descending sort
          }
          return valueA - valueB; // Compare numbers directly
        });
      } else {
        localData.current = localData.current.sort((a, b) => {
          let nameA = (a[sort.field] as Partial<Product>) as string;
          let nameB = (b[sort.field] as Partial<Product>) as string;

          if (sort.direction === 'desc') {
            [nameA, nameB] = [nameB, nameA]; // Swap values for descending sort
          }

          if (typeof nameA === 'string' && typeof nameB === 'string') {
            return nameA.localeCompare(nameB);
          }
        
          // Handle cases where the values are not strings (e.g., handle numeric comparisons)
          return 0;
        });
      }
      
    }
    console.log('Sorted to: ', sort.field, sort.direction);
    console.log(localData.current);
  }

  // Get data for the specified page
  const getRangeData = ({start, end}: PageRange): Product[] | boolean => {
    console.log('[useProductContextShadow getPageData] page:', start, end);
    //console.log(pageIndices.current);
    console.log('[localData.current]',localData.current);
    //if(!pageIndices.current || !pageIndices.current[page]) return false; // guard
    return localData.current?.slice(start, end) || [];
  };

  const getPageData = (page: number): Product[] | null => {
    if(!pageIndices.current || !pageIndices.current[page]) return null; // guard
    return localData.current?.slice(pageIndices.current[page].startIndex, pageIndices.current[page].endIndex) || [];
  };

  const pageIndexExists = (page: number): boolean => {
    if(pageIndices.current && pageIndices.current[page]) {
      return true;
    }
    return false;  
  }

  return { getPageData, updateData, updateUserSelection, pageIndexExists, sortData, setData, getRangeData };
}