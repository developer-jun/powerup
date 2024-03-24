import { useCallback } from 'react';
import { Product, ProductWithSelection, Pagination, Sorting, ProductFilter, SearchProductTypes, getPaginableProductStructure } from "@/types/product"
import { ACTIONS } from "@/reducers/productListReducer";

export const createProductPostAction = async (formData: Product) => {
  try {
    console.log('server data: ', formData);
    // should we add a validation, we can call the function from here

    // let's assumed the data are valid, it's time to call the API
    // TODO: we might have to add additional authentication or token validation to be added here
    // the server can verify that the API call was from here.
    const res = await fetch('/api/product', { 
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    console.log('WHAT THE SERVER RETURNED');
    console.log(res);
    // First thing to do is check the result status
    if(!res.ok) {
      // throw new Error('Request Error', { cause: {res} })
      return { error: "Server throws an error" }
    }
    const createProductResult = await res.json()
//                                              ^?
    

    // ^? 

    
    if(createProductResult.status === 'NOK') {
      return { error: createProductResult.message, product: null }
    } else {
      return { error: createProductResult.message, product: createProductResult.product }
    }
    // console.log("Server Response: ", prod)
    
  } catch(error) {
    console.log('ERROR FOUND');
    console.log(error);
    return { error: "Unable to contact the server, it's either in maintenance mode or having network issues. Please try again later...", product: null };
    //return handleApiError(error);
    // if we have plan on logging the error into a file or DB, we can use another abstraction for that.
  }     
};

type DispatchActionPropTypes = {
  type: string;
  payload: boolean | string | number | object;
}

/*
type SearchDataArgsTypes = {
  pageState: SearchProductTypes,
  dispatch: ({type, payload}: DispatchActionPropTypes) => void; 
}
*/
const buildQueryString = (searchArgs: SearchProductTypes) => {
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

const searchProducts = async(pageStateArgs: SearchProductTypes) => {
  // const result = await queryProducts(queryObjects);
  const APIAddress = '/api/product?' + buildQueryString(pageStateArgs)
  const res = await fetch(APIAddress, { 
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json'
    },
  });
  //console.log('API result:');
  //console.log(res.json());
  const result = await res.json();
  
  if(result && result.products)  {
    console.log('API result:', result);
    return {
      count: result.count,
      products: result.products
    };
  }

  return null;
}


type SearchProductsActionsTypes = {
  pageState: SearchProductTypes, 
  dispatch: React.Dispatch<any>, 
  action: string
}


export const searchProductsActions = async (pageState: SearchProductTypes, dispatch: React.Dispatch<any>, action: string)  => {  
  console.log('SEARCH is triggered: ', pageState);
  // STEP 1:, let the state knows we are starting the search.
  dispatch({
    type: ACTIONS.SEARCH_ACTION, 
    payload: {
      isSearching: true,
      filters: pageState.filters
    }
  });
  //console.log('SearchProductTypes:', pageState)
  // STEP 2: Calls the function that calls the API? single responsibility
  const productsResult = await searchProducts(pageState); 
  console.log('searchProducts FINAL RESULTS');
  console.log('items:', productsResult);
  dispatch({
    type: ACTIONS.SEARCH,
    payload: {
      totals: productsResult?.count,
      originalItems: productsResult?.products,
      items: updateProductsSelections(productsResult?.products, false),
      selectAll: false,
      isSearching: false,
      pagination: pageState.pagination,
      sorting: pageState.sorting
    }
  });
  // must tell the search action that we are done
  // dispatch({type: ACTIONS.SEARCH_ACTION, payload: false });  


}

export const paginateProductAction = () => {

}


export const getPaginableProducts = () => {
  
}


export const addSelectionsToProducts = (products: Product[], isSelected:boolean = false)
  : ProductWithSelection[] => {
  const productsWithSelection = products && products.map(
    product => ({
    ...product,
    isSelected: isSelected,
  }));
  console.log('SUCCESSFULLY ADDED isSelected field');
  return productsWithSelection;
}

export const updateProductsSelections = (products: ProductWithSelection[], isSelected:boolean = false)
  : ProductWithSelection[] => {
  const updatedProducts = products.map(
    product => ({
    ...product,
    isSelected: isSelected,
  }));
  console.log('updatedProducts:',updatedProducts);
  return updatedProducts;
}

export const updateProductSelection = (
  products: Array<ProductWithSelection>,
  id: number = 0
): ProductWithSelection[] => {
  
  const productIndex = products.findIndex((product) => product.id === id);

  if(productIndex !== -1) {
    const copyProducts = [...products];
    copyProducts[productIndex] = {
      ...copyProducts[productIndex],
      isSelected: !copyProducts[productIndex].isSelected,
    }

    return copyProducts;
  }

  return products;














  if (productIndex !== -1) {
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...products[productIndex],
      isSelected: !products[productIndex].isSelected,
    };
    console.log('originalproduct:', products);
    console.log('updatedproducts:', updatedProducts);
    return updatedProducts;
  }

  return products;
};
