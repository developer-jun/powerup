import { Product, Sorting, ProductWithSelection, ProductPaginable, SearchProductTypes, ProductListContextData, Pagination, ProductModifiers } from '@/types/product';
/*
export const buildQueryString = (searchArgs: SearchProductTypes) => {
  console.log('searchArgs: ', searchArgs);
  let queryString = [];
  if(searchArgs.pagination) {
    if(searchArgs.pagination.itemsPerPage && searchArgs.pagination.itemsPerPage !== undefined) {
      queryString.push(`take=${searchArgs.pagination.itemsPerPage}`);
      if(searchArgs.pagination.currentPage && searchArgs.pagination.currentPage !== undefined) {
        queryString.push(`skip=${searchArgs.pagination.itemsPerPage * (searchArgs.pagination.currentPage - 1)}`);
        queryString.push(`currentPage=${searchArgs.pagination.currentPage}`);
      }
    }    
  }
  if(searchArgs.sorting && searchArgs.sorting !== undefined) {
    queryString.push(`sortBy=${searchArgs.sorting.field}`);
    queryString.push(`order=${searchArgs.sorting.direction}`);
  }
  if(searchArgs.filters.search) {
    queryString.push(`search=${searchArgs.filters.search}`);
  }
  if(searchArgs.filters.category) {
    queryString.push(`category=${searchArgs.filters.category}`);
  }
  
  return queryString.join('&');
  
}
*/
export const buildQueryString = ({ pagination, filters, sorting }: SearchProductTypes) => {
  let queryString = [];
  const { itemsPerPage, currentPage } = pagination;
  const { search, category } = filters;
  const { field, direction } = sorting;  

  if(itemsPerPage) {
    queryString.push(`take=${itemsPerPage}`);
    if(currentPage) {
      queryString.push(`skip=${itemsPerPage * (currentPage - 1)}`);
      queryString.push(`currentPage=${currentPage}`);
    }
  }
  if(field && direction) {
    queryString.push(`sortBy=${field}`);
    queryString.push(`order=${direction}`);
  }
  if(search) {
    queryString.push(`search=${search}`);
  }
  if(category) {
    queryString.push(`category=${category}`);
  }
  
  return queryString.join('&');
}


export const addSelectionField = (products: Product[], isSelected:boolean = false)
  : ProductWithSelection[] => {
  if(!products) return [];
  // we used map because we want a new array, if we didn't, forEach would have been better.
  const productsWithSelection = products.map(
    product => ({
    ...product,
    isSelected: isSelected,
  }));
  return productsWithSelection;
}

export const integrateUrlParams = ({ productModifiers, urlParams }: { productModifiers: ProductModifiers, urlParams: any }): ProductModifiers => {
  console.log({ productModifiers, urlParams });
  const paginableObject = { ...productModifiers };

  if(urlParams) {
    const { take, currentPage, sortBy, order, search, category } = urlParams;
    if(take) {
      paginableObject.pagination.itemsPerPage = parseInt(take);
    }
    if(currentPage) {
      paginableObject.pagination.currentPage = parseInt(currentPage);
    }
    if(sortBy) {
      paginableObject.sorting.field = sortBy;
      if(order) {
        paginableObject.sorting.direction = order;
      }
    }
    if(search) {
      paginableObject.filters.search = search;
    }
    if(category) {
      paginableObject.filters.category = parseInt(category);
    }
  }

  return paginableObject;
}

export const computeActiveRange = ({currentPage, itemsPerPage, totalItems}: {currentPage: number, itemsPerPage: number, totalItems: number}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  if(endIndex > totalItems) {
    endIndex = totalItems;
  }
  console.log('[computeActiveRange] ',startIndex,endIndex);
  return {start: startIndex, end: endIndex};
}

export const getProductPageStructure = (): ProductPaginable => ({
  items: [],
  originalItems: [],
  pagination: {
    totals: 0,
    itemsPerPage: 5,
    pageCount: 0,
    currentPage: 1,
  },
  filters: {
    search: '',
    category: 0,
    publicationType: '',
  },
  sorting: {
    field: 'id',
    direction: 'asc',
  },
  status: {
    isSearching: false,
    isFiltering: false,
    isProcessing: false,
  },
  validActions: 'initialize',
  selectAll: false
});

export const getProductListStruct = (): ProductListContextData<Product> => ({
  items: [],
  count: 0,
  productModifiers: {
    pagination: {
      totals: 0, // this is the total number of items
      itemsPerPage: 5, // active products per page
      pageCount: 0, // Math.ceil(totals/itemsPerPage) - can be removed and calculated when needed
      currentPage: 1, // current active page position
    },
    filters: {
      search: '',
      category: 0,
      publicationType: '',
    },
    sorting: {
      field: 'id',
      direction: 'asc',
    },  
    selectAll: false // for select all handle,
  },
  dialog: {
    isOpen: false,
    productId: 0
  }
  
});