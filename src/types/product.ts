export enum StockStatuses {
  INSTOCK = 'INSTOCK',
  OUTOFSTOCK = 'OUTOFSTOCK',
  ONBACKORDER = 'ONBACKORDER'
}

export interface Product {
  id?         : number;
  sku         : string;
  name        : string;
  slug        : string;
  summary     : string;
  description : string;
  price       : number;
  thumbUrl    : string;
  imageUrl    : string;
  inStock     : StockStatuses | string;
  published   : boolean;
  createdAt?   : string;
  updatedAt?   : string;

  category?    : string;
  productcategoryid?: number
}

export interface ProductWithSelection extends Product {
  productcategory?: [] | null;
  isSelected?: boolean; 
}

export type SearchProductTypes = {
  pagination: Partial<Pagination> | Pagination, 
  filters: Partial<ProductFilter> | ProductFilter, 
  sorting: Partial<Sorting> | Sorting
}

export type Pagination = {
  totals: number;
  itemsPerPage: number;
  pageCount: number;
  currentPage: number;
};

export type ProductFilter = {
  search: string;
  category: number;
  publicationType: string
}

export type Sorting = {
  field: string;
  direction: string;
}


export type SortFields = 'id' | 'name' | 'price' | 'category' | 'description';
export type ProductSorting = {
  field: SortFields;
  direction: 'asc' | 'desc';
}

export type FormStatus = {
  isSearching: boolean; // specific to search filter
  isFiltering: boolean; // categororizations and other filter related
  isProcessing: boolean; // generalized status, like doing a bulk task like delete multiple items or moving them to draft or to published.
}

export interface ProductPaginable {
  items: ProductWithSelection[];
  originalItems?: Product[];
  pagination: Pagination,
  filters: ProductFilter,
  sorting: Sorting,
  status?: FormStatus,
  selectAll: boolean,
  validActions?: PageActions,

}

export type Paginate = {
  pageNum: number,
  paginationObj: Pagination
}


export interface StateInit {
  products: ProductWithSelection[];
  originalProducts: Product[];
  totalProducts: number;
  productsPerPage: number;
  pageCount: number;
  currentPage: number;
  
  sortByField: string;
  sortAscending: boolean;
  sortDescending: boolean;
  sortingDirection: string;

  draftTotal: number;
  trashTotal: number;
  activeTotal: number;

  filterByCategory: string;
  filterByType: string;
  searchTerm: string;
  
  bulkAction: string;
  selectAllValue: false;
  productFormFiltersCounter: number;
};

export type ProductModifiers = {
  pagination: Pagination,
  filters: ProductFilter,
  sorting: Sorting,  
  selectAll: boolean,
}
export interface ProductListContextData<T> {  
  items: T[],
  count: number,
  productModifiers: ProductModifiers,  
  dialog: {
    isOpen: boolean;
    productId: number
  }
}

export type PageRange = {
  start: number;
  end: number;
}
/*
export type ProductListContextData<T> = {
  items: T[] | [],
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
  selectAll: false,
}
*/






// this is what we expect for our data structure to look like
// currently used by productContext, it is generic to make it flexible
// we can add more data into it if needed, any type will do, if we want, could the form filters, pagination, etc..
export type ContextDataProduct<T> = {
  products: T[] | [];
  // selectedProduct: T | null;
  //loading: boolean;
  //message: MessagePrompt | null;
}
// defines what is going to be the content of the dispatch, add more type/action as the reducer grows.
export type ActionType<T> = 
  | { type: 'set_product'; payload: T | null }
  | { type: 'set_products'; payload: T[] | null };

// not currently in used, was replaced by ActionType<T> above
// export type ReducerEvents = 'set_product' | 'set_products'; // this will give intellisense to those that use this type
export type PageActions = 'paginate' | 'filter' | 'search' | 'initialize';

export const getPaginableProductStructure = (): ProductPaginable => ({
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
  selectAll: false,
  validActions: 'initialize'
});

export const emptyProductStructure = (): Product => {
  return {
    id          : 0,
    sku         : '',
    name        : '',
    slug        : '',
    summary     : '',
    description : '',
    price       : 0,
    thumbUrl    : '',
    imageUrl    : '',
    inStock     : StockStatuses.INSTOCK,
    published   : false
  }
}