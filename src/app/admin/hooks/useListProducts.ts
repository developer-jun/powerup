import { useCallback, useEffect, useMemo, useState } from 'react'
import { SearchProductTypes, PageRange, ProductSorting } from '@/types/product';
import { buildQueryString, addSelectionField, getProductPageStructure, computeActiveRange } from '@/app/admin/utils/productHelpers';
import { ACTIONS } from "@/app/admin/reducers/productListReducer";
import { PRODUCT } from '../utils/constants';
import useProducts from "@/app/admin/hooks/useProducts";
import useUrlParams from '@/app/admin/hooks/useUrlParams';
import useProductContext from './useProductContext';
import useProductsShadow from './useProductsShadow';

/**
 * Custom hook to manage the ins and outs of Products Page (abstraction)
 *  - 1.
 *  -   The initializations are the common thing to do to give our custom hook some base line settings.
 *  -   All other variables are also create on top including reference to other custom hooks which we might need.
 *  - 2.
 *  -   API calls, and the best place to do that is via the custom hooks and we have a few of them
 *  -   In this custom hook, the best place to listen if our custom hooks has done it's tasked of retrieving the data is using useEffect dependency
 */
const productPageStructure = getProductPageStructure();
export default function useListProducts() {
  // trigger for our useProductsShadow custom hook
  const [shadowCounter, incrementShadowCounter] = useState(1);
  // our caching related custom hook, has similar function to useProducts, but this doesn't cause re-render
  const { fetchProducts } = useProductsShadow();
  // products context
  const {contextState: {productModifiers, items} , dispatch: contextDispatch, shadowData} = useProductContext();
  // our querystring management and redirect
  const {getParam, removeParam, setUrlParams, clearParams} = useUrlParams();
  
  // useProducts CUSTOM HOOK RELATED FUNCTIONALITIES
  // ----------------------------
  
  //+ memoed, no need to recreate every re-render unless user desired it via in response to an event.
  const urlQueryString = useMemo(() => {
    return buildQueryString({
    pagination: productModifiers.pagination, 
    filters: productModifiers.filters, 
    sorting: productModifiers.sorting
  })}, [productModifiers.pagination, productModifiers.filters, productModifiers.sorting]);

  // TODO: check the custom hooks and make sure it's optimized
  // custom hook for retrieving products from the server via API
  // actual hook executes 6 times based on console.count
  // but useEffect only execute twice but NOT because dependency useEffectController changes from undefined to 0, instead that's just default behaviour of react in strict mode.
  // useProducts will depend on the urlQueryString we pass to it upon instantiation for pagination, hence when we instruct it again to retrieve another page, we modify the urlQueryString we passed to it via refreshProducts function
  const { data: productsData, count: productsCount, refreshProducts } = useProducts(urlQueryString.trim());
  
  //+ memoed, will always execute when productsData (useProduct) changes which is after an API call
  // simply adds the selectAll field to the each product data object
  const productWithSelect = useMemo(() => {
    if (productsData !== null) {
      return addSelectionField(productsData, productModifiers.selectAll);
    }
  }, [productsData]);

  const forcedProductRefresh = ()  => {  
    // TRIGGER the product query based on the current computed querystring via the useProducts custom hook
    refreshProducts();
  }
  // END of useProducts related functionalities
  // ----------------------------


  // EVENT HANDLERS from UI
  // ------------------------
  const searchProducts = (pageState: SearchProductTypes)  => {    
    // UPDATE the state along with the search filters (pagination and sorting - included)
    contextDispatch({
      type: ACTIONS.SEARCH_ACTION, 
      payload: {
        isSearching: true,
        filters: pageState.filters,
        pagination: pageState.pagination, 
        sorting: pageState.sorting
      }
    });

    // TRIGGER the product search via the useProducts custom hook
    refreshProducts();
  }

  const sortProducts = (sorting: ProductSorting)  => {   
    // UPDATE the state along with the new sorting data
    contextDispatch({
      type: ACTIONS.SORTBY, 
      payload: {
        sorting: sorting
      }
    });

    // sort existing data from the cache
    shadowData.sortData(sorting);
    // now retrieve the active products from the cache
    const activeProducts = shadowData.getRangeData(computeActiveRange({
      currentPage: productModifiers.pagination.currentPage,
      itemsPerPage: productModifiers.pagination.itemsPerPage,
      totalItems: productModifiers.pagination.totalItems}));
    if(activeProducts) {
      // we have the data, let's send it to the reducer and cause the re-render
      // we also updated the currentPage to the selected page
      contextDispatch({
        type: ACTIONS.SET_ACTIVE_PRODUCTS,
        payload: {
          items: activeProducts.map(item=>({
            ...item,
            isSelected: productModifiers.selectAll,
          })),          
        }
      });     
    }
  }

  /**
   * Paginate to page number
   * - we need this function because we need access to the local storage to check if the selected page has already been cached
   * - if cached, we simply retrieve those data before checking if the current page is the ceiling of the total pages. If not then call the shadow hook to retrieve the next set of data through api silently.
   * - if not cached, we will issue an API command to retrieved those data
   */
  const paginateTo = useCallback(({toPage, pageRange}:{toPage: number, pageRange: PageRange}) => {
    // EITHER SEARCH OR get data from the allProducts curtesy of the prefetching of useShadowProducts hook
    // STEP 1: check our local storage if page has already been index
    const activeProducts = shadowData.getRangeData(pageRange);
    if(activeProducts) {
      // we have the data, let's send it to the reducer and cause the re-render
      // we also updated the currentPage to the selected page
      contextDispatch({
        type: ACTIONS.SEARCH_RESULTS,
        payload: {
          items: activeProducts.map(item=>({
            ...item,
            isSelected: productModifiers.selectAll,
          })),
          isSearching: false,
          pagination: {
            currentPage: toPage
          }
        }
      });     
    }

    contextDispatch({
      type: ACTIONS.UPDATE_SELECT_ALL,
      payload: { selectAll: false }
    });
    
  }, []); 

  // END of EVENT HANDLERS
  // ------------------------   


  // USE EFFECTS RELATED FUNCTIONS
  // ----------------------------

  // Fetch products from the server and grab all the data SILENTLY, no state involves to avoid re-render
  const fetchShadowProducts = async (signal: AbortSignal) => { 
    const shadowQueryString = buildQueryString({        
      pagination: {},
      filters: productModifiers.filters, 
      sorting: productModifiers.sorting
    });   
    console.log('[shadowQueryString]',shadowQueryString);
    const shadowDataResult = await fetchProducts(PRODUCT.api_url.concat('?', shadowQueryString+'&take=all&skip=0'), signal);
    if(shadowDataResult) {
      shadowData.setData({data: shadowDataResult});
    }
  }

  // this previously useEffect is used to listen to changes to shadowCallerCounter which is just a useRef(no re-render)
  // a little bit tricky but has to be done to pre-fetch data in anticipation that user wanted to view the next set of data.
  // why use useEffect for this instead of calling a function directly? Mainly because we depend on the state pagination object which by the time we call our function wouldn't have been updated yet with the correct values, hence we have to wait and make sure the value is there.
  useEffect(() => {    
    // give it 1 second delay before fetching back to the server
    const timer = setTimeout(()=>{
      const abortController = new AbortController();
      fetchShadowProducts(abortController.signal);
      return () => {
        abortController.abort(); // if user deliberately cancelled the operation, this will trigger and fetchProducts will also be notified, if there's still pending API request, it will be aborted thus prevent any possible data mismatched.
      }   
    }, 1000);
    return () => clearTimeout(timer);
  }, [shadowCounter]);

  // This useEffect listens to changes to the custom hook useProducts which is responsible for retrieving data only
  // the expected data from useProducts are our active products, those that are ready to be displayed.
  useEffect(()=>{
    if(productsData) {
      // recompute the pagination now that we have the possible overall total number of products
      let newPagination = {
        totals: productsCount,
        pageCount: Math.ceil(productsCount / productModifiers.pagination.itemsPerPage)
      }

      // if the current page from the querystring is greater than the total number of pages, we need to reset it
      // that will happen if a product or products are deleted, which causes the total number of results to be less than previously
      // in short, just a simply safe guard
      if(newPagination.pageCount < productModifiers.pagination.currentPage) {
        if(getParam('currentPage')) {
          removeParam('currentPage');
        }
        newPagination = {
          ...newPagination,
          currentPage: 1,
        }
      }

      // set the active products to our reducer for display
      contextDispatch({
        type: ACTIONS.SEARCH_RESULTS, 
        payload: {
          items: productWithSelect, 
          selectAll: false,
          pagination: newPagination,
          isSearching: false,
        }
      });
      console.log(`${productsCount} > ${productModifiers.pagination.itemsPerPage}`);
      // before giving a go signal to the shadow hook to fetch the rest of the data, lets do a quick check to see if there are more records to retrieved
      if(productsCount > productModifiers.pagination.itemsPerPage) {
        console.log('[incrementShadowCounter]');
        // despite our shadow data uses useRef to prevent re-render, it's okay to call increment which is a state because above we already use useReducer.
        // the important thing is what will happen next which is triggering useEffect then fetch API request then save data into our context without causing any re-render
        incrementShadowCounter(prevState=>prevState + 1); // should trigger the useEffect for our shadow storage or cache
      } else {
        console.log('[shadowData.setData]');
        // if there's no more data to retrieve, just set the active products to our cache
        shadowData.setData({data: productsData});
      }
    }   
  }, [productsData]); // will trigger after useProducts hooks is finished fetching data
  
  // end of useEffect related functions
  // ----------------------------  

  return {contextDispatch, productModifiers, items, searchProducts, sortProducts, paginateTo, setUrlParams, clearParams, forcedProductRefresh}
}
