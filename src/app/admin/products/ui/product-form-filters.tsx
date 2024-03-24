'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {Paginate, PageRange, Pagination, ProductFilter, Sorting} from '@/types/product';
import { createHierarchy, createDropdownOptions } from "@/app/admin/utils/categoryHelpers";
import { Category, DropdownOption } from '@/types/category';

import useCategories from "../../hooks/useCategories";
import usePaginate from '../../hooks/usePaginate';
import useProductContext from '../hooks/useProductsContext';
import { ACTIONS } from '../../reducers/productListReducer';

type ProductFormFiltersPropTypes = {
  dispatchAction: ({action, data, page}: {action : string, data: string | number | PageRange, page?: number | null}) => void; 
  pagination: Pagination;
  filters: ProductFilter;
  //categoryList: Category[];
}

const ProductFormFilters = ({ dispatchAction/*, pagination, filters */ }: ProductFormFiltersPropTypes) => {
  
  const {categories} = useCategories(); // localized since it's only ever used in this component
  // all the forms controls here are manage by a single reducer state.
  // since all the controls are event driven, we can simply call a props function and pass the reducer state along with it.
   
  const { contextState: {productModifiers}, dispatch } = useProductContext();
  const { filters }  = productModifiers;
  const bulkActionRef = useRef<HTMLSelectElement>(null);
  // keep track of the selected category
  const [categoryFilter, setCategoryFilter] = useState<string>(filters.category ? filters.category.toString() : '0');

  // will keep track of the pagination
  const paginate = usePaginate({itemsPerPage: 5, totalItems: productModifiers.pagination.totals});
  //const searchRef = useRef(null);
  const searchRef = useRef<HTMLInputElement>(null); 

  const formattedCategories = useMemo(
    () => createHierarchy(categories), 
    [categories]
  );
  const dropdownOptions: DropdownOption[] = useMemo(() => 
    createDropdownOptions(formattedCategories), 
    [formattedCategories]
  );
  
  const handleOnFilter = (e) => {
    e.preventDefault();
    let category = categoryFilter ? categoryFilter : 0;    
    console.log('filter event: ',category);
    dispatchAction({action: 'filter', data: category});
    
  }

  const handleBulkAction = (e) => {
    e.preventDefault();

    console.log("bulkActionRef: ", bulkActionRef.current.value);
    dispatchAction({action: 'bulk', data: bulkActionRef.current.value});
  }

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(searchRef.current && searchRef.current.value.trim() !== '') {
      dispatchAction({action: 'search', data: searchRef.current.value});
    }       
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {    
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter key pressed');
      if(searchRef.current && searchRef.current.value.trim() !== '') {
        dispatchAction({action: 'search', data: searchRef.current.value});
      }
    }
  }

  const handleOnSelectChange = (e) => {
    // STEPS TO DO WHEN CATEGORY IS SELECTED
    // 1. We should update the context state
    //   - from there, we could either filter the existing data cache or query the server using our category filter.
    setCategoryFilter(e.target.value);
    //categoryFilter.current = e.target.value;
    console.log('Category selected:', e.target.value);
    console.log('cat ref:', categoryFilter);
    dispatchAction('filter', searchRef.current.value);
  }

  const handleOnPaginate = ({direction}: {direction:string}) => {
    if(direction === 'previous') {      
      paginate.previous(); // this will only let our paginate hook about the action
    } else if(direction === 'next') {
      paginate.next();
    }
    
    const indexRange: PageRange = paginate.getActiveRange();
    dispatchAction({action: 'paginate', data: indexRange, page: paginate.getActivePage()});
    
    //paginate.reload();
  }

  return (
    <>
      <ul className='categorized-totals'>
        <li><a href='#'>All</a></li>
        <li><a href='#'>Published</a></li>
        <li><a href='#'>Drafted</a></li>
        <li><a href='#'>Trashed</a></li>
      </ul>
      <div className="product-header-groups">
        <div className="pagination-search">
          <div className="search-control">
            <input type="text" placeholder="Search" className="search" onKeyDown={handleKeyDown} ref={searchRef} defaultValue={filters.search} />
            <button className='btn search-btn' type='button' onClick={handleSearch}>Search</button>
          </div>
          <div className="pagination">           
            <button className="paginate arrowed" type='button' disabled={paginate.getActivePage() <= 1} onClick={e=>handleOnPaginate({direction: 'previous'})}> {/*dispatchAction({action: 'paginate', data: { pageNum: pagination.currentPage - 1, paginationObj: pagination}}*/}
              <span className="arrow left"></span>
            </button>
            <div className="page-counter">
              {/*<strong>{pagination.currentPage}</strong>/<span>{pagination.pageCount}</span>*/}
              <strong>{paginate.getActivePage()}</strong>/<span>{paginate.getTotalPages()}</span>
            </div>              
            <button className="paginate arrowed" type='button' disabled={paginate.getActivePage() >= paginate.totalPages} onClick={e=>handleOnPaginate({direction: 'next'})}> {/*pagination.currentPage >= pagination.pageCount */} {/* dispatchAction({action: 'paginate', data: { pageNum: pagination.currentPage + 1, paginationObj: pagination}}) */}
              <span className="arrow right"></span>
            </button>
          </div>
        </div>
        <div className="dropdowns">          
          <div className="filters">
            <select className="form-control" onChange={handleOnSelectChange} value={categoryFilter}>
              <option value="">All Categories</option>
              {dropdownOptions && dropdownOptions.map((option, index) => {
                if(option.value !== 1) {
                  return <option key={index} value={option.value}>{option.label}</option> 
                }
              })}
            </select>
            <button className="custom-btn" onClick={handleOnFilter}>Filter</button>
          </div>
          <div className="bulk-actions">
            <select className="form-control" ref={bulkActionRef}>
              <option value="">Bulk Actions</option>
              <option value="trash">Move to Trash</option>
              <option value="draft">Move to Draft</option>
            </select>
            <button className="custom-btn" onClick={handleBulkAction}>Apply</button>
          </div>
        </div>
      </div>      
    </>
  )
}

export default ProductFormFilters;