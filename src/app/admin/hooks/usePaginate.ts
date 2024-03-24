import { useRef, useState } from 'react'

type PaginateProps = {
  itemsPerPage?: number;
  totalItems: number;
}
const usePaginate = ({
  itemsPerPage = 5,
  totalItems = 0,
}: PaginateProps) => {
  // track the current page or the next page the user want to display
  const [renderCounter, setRenderCounter] = useState(1); // cause the re-render
  const activePage = useRef(1);
  let totalPages = 0;
  //const [count, setCount] = useState(totalItems);
  console.log('[usePaginate] totalItems: ', totalItems);
  if(totalItems) {
    totalPages = Math.ceil(totalItems / itemsPerPage); // determine the total number of pages given the total number of items and items per page.
  }
  const computeTotalPages = (totalItems: number) => {
    //totalPages.current = Math.ceil(totalItems / itemsPerPage);
  }

  const next = () => {
    goToPage(activePage.current + 1);
  }
  const previous = () => {
    goToPage(activePage.current - 1);
  }

  const goToPage = (page: number) => {
    if (page <= 0) {
      activePage.current =+ 1
    } else if (page > totalPages) {
      activePage.current = totalPages;
    } else {
      activePage.current = page;
    }
  }

  const getActiveRange = () => {
    const startIndex = (activePage.current - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    if(endIndex > totalItems) {
      endIndex = totalItems;
    }
    console.log('[getActiveRange] ',startIndex,endIndex);
    return {start: startIndex, end: endIndex};
  } 

  const reload = () => {
    setRenderCounter(prev=>prev + 1);
    console.log('[activePage] ', getActivePage())
  }

  const getActivePage = () => {
    return activePage.current;
  }
  const getTotalPages = () => {
    return totalPages;
  }

  return {getActivePage,reload,next,previous,goToPage,getActiveRange,computeTotalPages,getTotalPages}
}

export default usePaginate;