import React, { ReactNode } from 'react'
import './product-table.scss';
import { Sorting } from '@/types/product';
import useProductContext from '../hooks/useProductsContext';

type ProductTableProps = {
  children: React.ReactNode;
  sorting: Sorting;
  handleSort: (column: string) => void;
  selectAll: boolean;
  checkAll: (userSelection: boolean)=>void;
}
export default function ProductTable({ children, sorting, selectAll, checkAll, handleSort }: ProductTableProps) {
  const {contextState: {productModifiers, items} , dispatch: contextDispatch} = useProductContext();
  
  console.log('[sorting]: ', sorting);
  const getCssClass = (name: string = '') => {
    let className = 'sort-by';
    console.log(name +'==='+ sorting.field );
    if(name === sorting.field) {
      className += ' active '+sorting.direction;
    }
    
    if(name === 'name') {
      className += ' '+name;
    }

    return className;
  }
  const handleOnSort = (column: string) => {
    console.log('[handleOnSort]: ', column);
    handleSort(column);
  }
  const thProps = {
    getCssClass: getCssClass,
    onSort: handleOnSort,
  }
  
  return (              
    <table className="table sortable">
      <thead>
        <tr>
          <th>
            <input type="checkbox" onChange={e=>checkAll(!selectAll)} checked={selectAll} className="checkbox" />                  
          </th>
          <TableHeader name="name" {...thProps}>Name</TableHeader>
          <TableHeader name="category" {...thProps}>Category</TableHeader>
          <TableHeader name="price" {...thProps}>Price</TableHeader>
          <TableHeader name="description" {...thProps}>Description</TableHeader>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {children}                          
      </tbody>
    </table>    
  )
}

type TableHeaderCellProps = {
  name: string, 
  getCssClass: (name: string) => string, 
  onSort: (name: string) => void, 
  children: React.ReactNode;
}
function TableHeader({ name, getCssClass, onSort, children }: TableHeaderCellProps) {
  return <th><a className={getCssClass(name)} href="#" onClick={e=>onSort(name)}>{children}</a></th>;
}