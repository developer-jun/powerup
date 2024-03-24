"use client";

import { useEffect, useMemo, useCallback, useReducer } from 'react';
import { reducer as productListReducer, ACTIONS } from "../../reducers/productListReducer";


import { updateProductsSelections, updateProductSelection, searchProductsActions } from '@/actions/productActions';
import { ProductItem } from '@/components/admin/product/product-item';
import { Product, Sorting, ProductWithSelection, ProductPaginable, SearchProductTypes } from '@/types/product';
import { Category } from '@/types/category';
import ProductFormFilters from './product-form-filters';
import "./product-list.scss";

//import useCategories from "../../hooks/useCategories";
import useProducts from "../../hooks/useProducts";


type ProductListProps = {
  productList: ProductWithSelection[],
  categoryList: Category[]
};
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
const addSelectionField = (products: Product[], isSelected:boolean = false)
  : ProductWithSelection[] => {
  const productsWithSelection = products && products.map(
    product => ({
    ...product,
    isSelected: isSelected,
  }));
  return productsWithSelection;
}

const productPageStructure: ProductPaginable = {
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
};

export default function ProductList() {
  //const categories = useCategories();
  const [productState, dispatch] = useReducer(productListReducer, productPageStructure);
  const urlQueryString = useMemo(() => buildQueryString({
    pagination: productState.pagination, 
    filters: productState.filters, 
    sorting: productState.sorting}), 
    [productState.pagination, productState.filters, productState.sorting]);
  const products = useProducts(urlQueryString.trim());
  // this should be cached since it will only changed when the page do full refreshed.
  const _product = useMemo(() => {
    if (products.data !== null) {
      return addSelectionField(products.data, false);
    }
  }, [products.data]);
  
  const { items, pagination, filters, sorting, selectAll } = productState;
  
  useEffect(()=>{
    console.log('products.data: ', products.data);
    dispatch({type: ACTIONS.UPDATE_PRODUCTS, payload: {items: _product, originalItems: products.data}});
  }, [products.data]);

  // EVENT HANDLERS
  const handleOnCheckAll = (e) => {
    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload: {
        items: updateProductsSelections(items, !selectAll),
        selectAll: !selectAll,
      }
    });
  }

  const handleOnCheck = useCallback((id: number) => {
    console.log('selected:',id);
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT_SELECTION,
      payload: id
    });   
  }, []);

  /*
  const handleOnEdit = useCallback((id: number) => {

  }, [])

  const handleOnDelete = useCallback((id: number) => {

  }, []);
  */

  // Child Components Specific Actions
  const handlerActions = useCallback((action: string, data: string | number | boolean | undefined) => {    
    switch(action) {
      case "search":
        searchProductsActions(
          {pagination: { ...pagination, currentPage: 1  }, filters: {...filters, search: data}, sorting: sorting},
          dispatch,
          'search'
        );
      break;
      case 'paginate':
        console.log('paginate:', productState);
        searchProductsActions(
          {pagination: { ...pagination, currentPage: (typeof data === 'number') ? data : 1}, filters: filters, sorting: sorting},
          dispatch,
          'paginate'
        );
      break;
      case 'filter':
        console.log('SELECTED CATEGORY: ', data);
        searchProductsActions(
          {pagination: { ...pagination, currentPage: 1  }, filters: {...filters, category: data}, sorting: sorting},
          dispatch,
          'search'
        );
      break;
      default:
        // do nothing for now  
    }
    return false;
  }, [dispatch]);  

  const handleSort = (column)  => {
    console.log("handleSort: ", column);
    const newSort: Sorting = {
      field: column,
      direction: 'asc'
    }
    // check if sort column is the same as the current, we will simply flip the direction
    if(column === sorting.field && sorting.direction === 'asc') {
      newSort.direction = 'desc';
    }

    // when sorted, reset pagination to start at 1
    searchProductsActions(
      {pagination: { ...pagination, currentPage: 1  }, filters: filters, sorting: newSort},
      dispatch,
      'sort'
    );
  }

  console.log('productState:',productState);
  return (
    <>
      <div className='product-list'>
        <div style={{textAlign: "right"}}>Total Products: {pagination.totals}</div>
        <ProductFormFilters
          dispatchAction={handlerActions}
          pagination={pagination} 
          /*categoryList={categories.categories}*/ />        
        {items && (          
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={handleOnCheckAll} defaultChecked={selectAll} className="checkbox" />                  
                </th>
                <th><a href="#" onClick={e=>handleSort('name')}>Name</a></th>
                
                <th><a href="#" onClick={e=>handleSort('price')}>Price</a></th>
                <th><a href="#" onClick={e=>handleSort('description')}>Description</a></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((product: ProductWithSelection) => (
                <ProductItem 
                  key={product.id} 
                  product={product} 
                  handleOnCheck={handleOnCheck} />                      
              ))}            
            </tbody>
          </table>
        )}  
      </div>
    </>
  )
}
