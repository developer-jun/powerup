"use client"

import CategoryForm from '@/app/admin/category/ui/category-form';
import CategoryList from "@/app/admin/category/ui/category-list";
import useCategories from "@/app/admin/hooks/useCategories";
import useCategoryContext from '@/app/admin/hooks/useCategoryContext';
import { createHierarchy}  from '@/app/admin/utils/categoryHelpers';
import { useEffect } from 'react';

export default function CategoryPageContainer() { 
  const {categories, resetCategories} = useCategories();
  const {storeCategories, storeHierarchedCategories} = useCategoryContext();

  useEffect(() => {
    console.log('categories:',categories);
    if(categories) {
      storeCategories(categories);
      storeHierarchedCategories(createHierarchy(categories));
    }
    
  },[categories]);

  return (
    <>
      <div className="custom-form">
        <CategoryForm refreshCategories={resetCategories} />             
      </div>
      <div className="custom-list">       
        <CategoryList refreshCategories={resetCategories} />
      </div>
    </>    
  )
}
