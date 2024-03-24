import { Product, ProductWithSelection, StateInit, ProductPaginable, ProductListContextData } from '@/types/product';
//import { searchProductsActions } from '@/actions/productActions';

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
  UPDATE_PRODUCT_SELECTIONS: 'update_product_selections',
  UPDATE_STATE: 'update_state',
  UPDATE_PRODUCTS: 'update_products',

  SET_ACTIVE_PRODUCTS: 'set_active_products',

  UPDATE_PAGINATION: 'update_pagination',

  UPDATE_VALID_ACTIONS: 'update_valid_actions',
  UPDATE_SELECT_ALL: 'update_select_all',


  UPDATE_MODAL_STATE: 'update_modal_state',
  // SET_PRODUCT_DETAIL: 'set_product_detail',

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
  SEARCH_RESULTS: 'search_results',
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

type ProductListInitTypes = {
  defaultParams: ProductListContextData<Product>,
  urlParams: Record<string, string>
} 
export const productListInit = ({ defaultParams, urlParams }: ProductListInitTypes) => {
  console.log('[productListInit]');
  console.log({ defaultParams, urlParams });
  const paginableObject = { ...defaultParams.productModifiers };

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

  return {
    ...defaultParams,
    productModifiers: {
      ...defaultParams.productModifiers,
      paginableObject
    }
    
  };
}

// export const reducer = (state: ProductPaginable, action: any) => {
export const reducer = (state: ProductListContextData<Product>, action: any) => {
  console.log('Product List REDUCER: ', action.type, action.payload);
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
    case ACTIONS.UPDATE_PRODUCT_SELECTIONS: {
      return {
        ...state,
        items: state.items.map(item=>({...item, isSelected: action.payload.userSelection })),
        selectAll: action.payload.selectAll
      }
    }
    case ACTIONS.SEARCH_ACTION: {
      const { isSearching, filters, sorting, pagination} = action.payload;
      return {
        ...state,
        productModifiers:{
          ...state.productModifiers,
          pagination: {
            ...state.productModifiers.pagination,
            ...pagination
          },
          filters: {
            ...state.productModifiers.filters,
            ...filters
          },
          sorting: {
            ...state.productModifiers.sorting,
            ...sorting,
          }
        },
      };
    }
    case ACTIONS.SEARCH_RESULTS: {
      //console.log('ACTIONS.SEARCH_RESULTS', action.payload.pagination);
      const {items,pagination,isSearching} = action.payload;
      return {
        ...state,
        items: items ? items : [],
        productModifiers:{
          ...state.productModifiers,
          pagination: {
            ...state.productModifiers.pagination,
            ...pagination
          }
        },        
      };
      /*return {
        ...state,
        items: items ? items : [],
        status: {
          ...state.status,
          isSearching: isSearching,
        },
        pagination: {
          ...state.pagination,
          ...pagination
        }
      };*/
    }
    case ACTIONS.SET_ACTIVE_PRODUCTS: {
      const {items} = action.payload;
      return {
        ...state,
        items: items ? items : [],             
      };
    }
    case ACTIONS.GOTOPAGE: {
      return {
        ...state,
        productModifiers:{
          ...state.productModifiers,
          pagination: {
            ...state.productModifiers.pagination,
            currentPage: action.payload.page
          }
        },
      };
    }

    case ACTIONS.UPDATE_MODAL_STATE: {
      return {
        ...state,
        dialog: {
          ...state.dialog,
          ...action.payload.dialog
        }
      }
    }

    case ACTIONS.SORTBY: {
      return {
        ...state,
        productModifiers: {
          ...state.productModifiers,
          sorting: action.payload.sorting
        }
      }
    }

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
    case ACTIONS.UPDATE_PAGINATION: {
      const { pagination} = action.payload;
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      };
    }
    case ACTIONS.UPDATE_PRODUCTS: {
      return {
        ...state,
        items: action.payload.items,
        //originalItems: action.payload.products,
      }; 
    }
    case ACTIONS.UPDATE_STATE: {   
      
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
        pagination: {
          ...state.pagination,
          currentPage: state.pagination.currentPage - 1
        }
      };
    }    
    case ACTIONS.UPDATE_SELECT_ALL: {
      return {
        ...state,
        selectAll: action.payload.selectAll
      };
    }
    case ACTIONS.UPDATE_VALID_ACTIONS: {
      return {
        ...state,
        validActions: action.payload.validAction
      }
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