"use client";

import { useEffect, useMemo, useCallback, useReducer } from 'react';
import { reducer as productListReducer, ACTIONS } from "@/reducers/productListReducer";
import { addSelectionsToProducts, updateProductsSelections, updateProductSelection, searchProductsActions } from '@/actions/productActions';
import { ProductItem } from '@/components/admin/product/product-item';
import { Product, Sorting, ProductWithSelection } from '@/types/product';
import { Category } from '@/types/category';
import ProductFormFilters from './product-form-filters';
import "./product-list.scss";



type ProductListProps = {
  productList: ProductWithSelection[],
  categoryList: Category[]
};


export default function ProductList({productList, categoryList}: ProductListProps) {
  // this should be cached since it will only changed when the page do full refreshed.
  const _product = useMemo(() => addSelectionsToProducts(productList.originalItems, false), [productList.originalItems]);
  const [productState, dispatch] = useReducer(productListReducer, {
    ...productList,
    items: _product
  });
  const { items, pagination, filters, sorting, selectAll } = productState;
  
  useEffect(()=>{
    console.log('productState useEffect:',productState);
  }, []);

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

  const handleOnEdit = useCallback((id: number) => {

  }, [])

  const handleOnDelete = useCallback((id: number) => {

  }, []);

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
        Total Products: {pagination.totals}
        <ProductFormFilters
          dispatchAction={handlerActions}
          pagination={pagination} 
          categoryList={categoryList} />        
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
