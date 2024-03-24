import { Product, ProductWithSelection, StateInit, ProductPaginable } from '@/types/product';
import { searchProductsActions } from '@/actions/productActions';

export const ACTIONS = {
  // on page load, only paging is applied.
  // Pagination: set the Total number of products then compute how many pages are there.
  // Sorting: the default is the data published.
  // THOSE TWO ABOVE can be set on page render, or when the props changes.

  // ACTIONS AFTER the PAGE LOADED
  // 1. Pagination
  // 2. Sorting
  // 3. Filtering
  // 4. Searching
  // 5. Filter by Category dropdown
  // 6. Bulk Action, move to trash or draft
  UPDATE_PRODUCT: 'update_product',
  UPDATE_PRODUCT_SELECTION: 'update_product_selection',
  UPDATE_STATE: 'update_state',


  // Pagination Actions
  // ------------------  
  NEXTPAGE: 'nextpage',
  PREVIOUSPAGE: 'previouspage',
  GOTOPAGE: 'gotopage',
  // ------------------

  // Sorting Actions
  // ------------------  
  SORTBY: 'sortbyField',
  // SORTASCENDING:'sortascending',
  // SORTDESCENDING:'sortdescending',
  // ------------------

  // Filtering Actions
  // ------------------  
  FILTERBYCATEGORY: 'filterbycategory',
  FILTERBYTYPE: 'filterbytype', // Active | Draft | Trashed
  // ------------------

  // Search Actions
  // ------------------  
  SEARCH: 'search',
  SEARCH_ACTION: 'search_action',
  // ------------------
 
  // Bulk Actions
  // ------------------  
  MOVETOTRASH:'movetothetrash',
  MOVETODRAFT:'movetodraft',
  // ------------------


  // sort

  // filter

  // pagination

  // refresh/reset
};

// STATE STRUCTURE
/*
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
  selectAll: false
});
*/

export const initialState: StateInit = {
  products: [],
  originalProducts: [],
  totalProducts: 0,
  productsPerPage: 5,
  pageCount: 1,
  currentPage: 1,
  
  sortByField: '',
  sortAscending: false,
  sortDescending: false,
  sortingDirection: '',

  draftTotal: 0,
  trashTotal: 0,
  activeTotal: 0,

  filterByCategory: '',
  filterByType: '',
  searchTerm: '',
  
  bulkAction: '',
  selectAllValue: false,
  productFormFiltersCounter: 0
};

export const reducer = (state: ProductPaginable, action: any) => {
  console.log('REDUCER CALLED:', action.type, action.payload);
  //console.log('current state:', state);
  // reducer is a pure function
  // we are not modifying the state here, that's against pure function
  // rather, we are creating a new object and return it.
  // the returned object will now be the new state value
  // this is the main purpose of reducer, it's a function with some logic to create a new state object which when returned will replace the new state
  // this is where spread operator is very useful, why is that? simply because we still need the original state value or properties, we only update what needs to be updated.
  switch(action.type) {
    case ACTIONS.UPDATE_PRODUCT_SELECTION: {
      return {
        ...state,
        items: state.items.map(
          product => (product.id === action.payload) 
            ? { ...product, isSelected: !product.isSelected }
            : product          
        )
      }
    }
    case ACTIONS.SEARCH_ACTION: {
      const { isSearching, filters} = action.payload;
      return {
        ...state,
        status: {
          ...state.status,
          isSearching: isSearching,
        },
        filters: filters
      };
    }
    case ACTIONS.SEARCH: {
      console.log('triggered search', action.payload);
      // the payload will have all the new data
      // let's destructure it
      const {totals, originalItems,items,selectAll,isSearching, pagination,sorting} = action.payload;
      return {
        ...state,
        originalItems: originalItems ? originalItems : [],
        items: items ? items : [],
        selectAll: selectAll,
        pagination: {
          ...pagination,
          totals: totals,
          pageCount: Math.ceil(totals/state.pagination.itemsPerPage)
        },
        status: {
          ...state.status,
          isSearching: isSearching,
        },
        sorting: sorting,
      };
      /*
      const newFilters = {
        ...state.filters,
        search: action.payload
      };
      const {totals, items } = searchProductsActions(
        {pagination: { ...state.pagination, currentPage: 1  }, filters: {...state.filters, search: action.payload}, sorting: state.sorting}, 
      );

      console.log('FINAL RESULTS');
      console.log('totals:', totals);
      console.log('items:', items);

        */
      /*
      if(action.payload === '') {
        const filters = {
          ...state.filters,
          search: action.payload
        };
        const {totals, items} = await searchProducts({pagination: state.pagination, filters: filters, sorting: state.sorting});
        return {
          ...state,
          filters: {
            ...state.filters,
            search: action.payload
          }
          searchTerm: action.payload,
          products: [...state.originalItems]
        }
      } else {      
        return {
          ...state,
          searchTerm: action.payload,
          products: state.originalItems.filter(
            product => (
              product.name.toLowerCase().includes(action.payload.toLowerCase())
              || (product.summary.toLowerCase().includes(action.payload.toLowerCase()))
            )          
          )
        }
      }*/
    }
    case ACTIONS.UPDATE_STATE: {
      /*console.log(action.payload);
      const temp = {
        ...state,
        ...action.payload
      };
      console.log('new state:', temp);*/
      
      return {
        ...state,
        ...action.payload
      };  
    }
    case ACTIONS.NEXTPAGE: {
      return {
      ...state,
        currentPage: state.currentPage + 1
      };
    }
    case ACTIONS.PREVIOUSPAGE: {
      return {
      ...state,
        currentPage: state.currentPage - 1
      };
    }
    case ACTIONS.GOTOPAGE: {
      return {
      ...state,
        currentPage: action.payload.topage
      };
    }
    case ACTIONS.SORTBY: {
      let sortingDirection = 'ASC';      
      if(state.sortByField === action.payload.sortByField) {
        if(state.sortingDirection === 'ASC') {
          sortingDirection = 'DESC';
        }
      }
      return {
        ...state,
        sortingDirection: sortingDirection,
        sortByField: action.payload.sortByField,
      };
    }
    case 'MULTI': {// multiple fields
      return {
        ...state,
        ...action.payload
      };
    }
    default: {
      console.log('STATE set to ' + state);
      return state;
    }
  }
}