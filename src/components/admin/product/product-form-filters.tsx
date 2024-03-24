import { memo, useRef } from 'react';
import {Pagination, ProductFilter, Sorting} from '@/types/product';
import { Category } from '@/types/category';

type ProductFormFiltersPropTypes = {
  dispatchAction: (action : string, data: string | number) => void; 
  pagination: Pagination;
  categoryList: Category[];
}

const ProductFormFilters = memo(({ dispatchAction, pagination, categoryList }: ProductFormFiltersPropTypes) => {
  // all the forms controls here are manage by a single reducer state.
  // since all the controls are event driven, we can simply call a props function and pass the reducer state along with it.
  const searchRef = useRef();
  const categoryFilterRef = useRef();
  const bulkActionRef = useRef();

  const categories = ['Shirts', 'Jeans', 'Shoes'];
  
  const handleFilter = (e) => {
    e.preventDefault();
    let category = 0;
    if(categoryFilterRef.current.value)
      category = parseInt(categoryFilterRef.current.value);
    
    dispatchAction('filter', category);

    console.log('filter event: ',category);
  }

  const handleBulkAction = (e) => {
    e.preventDefault();

    console.log("bulkActionRef: ", bulkActionRef.current.value);
    dispatchAction('bulk', bulkActionRef.current.value);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('handleSearch');
    if(searchRef.current.value.trim() !== '')
      dispatchAction('search', searchRef.current.value);
        
  }

  const handleKeyDown = (e) => {    
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter key pressed');
      dispatchAction('search', searchRef.current.value);
    }
  }

  const handleOnSelect = (e) => {
    console.log('Category selected:', e.target.value);
    console.log('cat ref:', categoryFilterRef.current.value);
    // dispatchAction('filter', searchRef.current.value);
  }

  console.log('FORM FILTER RENDERED');
  return (
    <form action="#">
      <ul className='categorized-totals'>
        <li><a href='#'>All</a></li>
        <li><a href='#'>Published</a></li>
        <li><a href='#'>Drafted</a></li>
        <li><a href='#'>Trashed</a></li>
      </ul>
      <div className="product-header-groups">
        <div className="pagination-search">
          <div className="search-control">
            <input type="text" placeholder="Search" className="search" onKeyDown={handleKeyDown} ref={searchRef} />
            <button className='btn search-btn' type='button' onClick={e=>dispatchAction('search',searchRef.current.value)}>Search</button>
          </div>
          <div className="pagination">           
            <button className="paginate arrowed" type='button'  disabled={pagination.currentPage <= 1} onClick={e=>dispatchAction('paginate', pagination.currentPage - 1)}>
              <span className="arrow left"></span>
            </button>
            <div className="page-counter"><strong>{pagination.currentPage}</strong>/{pagination.pageCount}</div>              
            <button className="paginate arrowed" type='button' disabled={pagination.currentPage >= pagination.pageCount} onClick={e=>dispatchAction('paginate', pagination.currentPage + 1)}>
              <span className="arrow right"></span>
            </button>
          </div>
        </div>
        <div className="dropdowns">          
          <div className="filters">
            <select className="form-control" onChange={handleOnSelect} ref={categoryFilterRef}>
              <option value="">All Categories</option>
              {categoryList.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
              
            </select>
            <button className="custom-btn" onClick={handleFilter}>Filter</button>
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
      
    </form>
  )
});

/*
export default memo(ProductFormFilters, (previousProps, nextProps) => {
  return (previousProps.reloadCounter === nextProps.reloadCounter);
});*/

export default ProductFormFilters;