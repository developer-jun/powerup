import React, { useCallback, useRef } from "react";
import { useState } from "react";
import { Category, CategoryHierarchy } from "@/types/category";
import AlertDialogPrompt from '@/app/admin/components/alertDialogPrompt';
import useCategoryContext from "../../hooks/useCategoryContext";
import CategoryItem from "./category-item";

const CategoryList = ({refreshCategories}: {refreshCategories: () => void}) => {
  const {state: {categories, selectedCategory: formSelected}, storeCategory, getTotalCategories} = useCategoryContext();
  const totalCategories = getTotalCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const handleDelete = useCallback((item: Category) => {
    setSelectedCategory(item);
    // if our form has a selected item to be edited, check if the current item to be deleted is the same, if so must remove it to avoid bug
    if(item.id === formSelected?.id) {
      storeCategory(null);
    }
  }, []);

  const checkSelectionConflict = useCallback(() => {
    // if our form has a selected item to be edited, check if the current item to be deleted is the same, if so must remove it to avoid bug
    if(selectedCategory && (selectedCategory.id === formSelected?.id)) {
      storeCategory(null);
    }
  }, []);

  return (
    <div id="category-list">      
      Total Categories: {totalCategories ? totalCategories - 1 : 0}
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Parent</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {categories.length ? (
            categories.map(item => (
              <React.Fragment key={item.id}>
                {item.parent !== null 
                  ? <CategoryItem handleDelete={handleDelete} storeCategory={storeCategory} item={item} /> 
                  : <></>}
              </React.Fragment>
            ))
          ) : null}
        </tbody>
      </table>
      {selectedCategory !== null 
        && <AlertDialogPrompt key={selectedCategory?.id} selectedCategory={selectedCategory} refreshCategories={refreshCategories} checkSelectionConflict={checkSelectionConflict} />}
    </div>
  )
}

export default CategoryList;