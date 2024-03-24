'use client'

import React from 'react';
import { Category } from '@/types/category';
import { ClipboardEdit, Trash2  } from 'lucide-react';



type CategoryProps = {
  handleDelete: (item: Category) => void,  
  storeCategory: (item: Category) => void,
  item: Category,  
}
const CategoryItem = React.memo(({handleDelete, storeCategory, item}: CategoryProps) => {
  
  return (
    <tr key={item.id}>
      <th>{item.id}</th>
      <th>{item.parent}</th>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td><div className="flex flex-row"><a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {storeCategory(item)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleDelete(item)} /></div></td>
    </tr>
  )
});

export default CategoryItem;