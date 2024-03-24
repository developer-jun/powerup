"use client"

import { useState } from 'react';
//import { useSession } from "next-auth/react";
import Categories from '@/components/admin/category/categories';
import NewCategoryForm from '@/components/admin/category/new-category-form';
import { Category, CategoryHierarchy } from "@/types/category";
import { fetchCategoryAction } from "@/actions/categoryActions";
import "./container.scss";

type CategoryPageContainerProps = {
  total: number,
  categories: CategoryHierarchy[],
}

export default function CategoryPageContainer({categoryObj}: {categoryObj: CategoryPageContainerProps}) { 
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categoriesState, setCategoriesState] = useState(Array<Category>);

  //const {data: session, status, update} = useSession();
  //console.log('Admin Session:');
  //console.log(session?.user);
  //const [actions, setActions] = useState('');
  // filter category to only includes relevant fields: id, name, and parent. Then inside the form, has to format so that the sub category is displayed below the parent category
  // const parentCategories = props.categories; // temporarily disabled
   
  const editCategory = (category: Category) => {
    //setActions('EDIT');
    setSelectedCategory(_category => ({...category}));    
  };

  const resetProps = ()=> {
    console.log('RESETTING TOPIC PROPS')
    /*const categoryEmpty = {
      id: 0,
      parent: 'none',
      name: '',
      slug: '',
      description: ''
    }*/
    //setActions('RESET');
    refetchCategories();
    setSelectedCategory(category => ({}));
    
  };

  const refetchCategories = async () => {
    console.log('Refetching Categories thru API');
       
    const updatedCategoriesData = await fetchCategoryAction(); 
    if(updatedCategoriesData.status === 'OK')    
      setCategoriesState(
        updatedCategoriesData.data 
        && Array.isArray(updatedCategoriesData.data) 
        ? updatedCategoriesData.data : []);
  } 
  
  return (
    <>
      <div className="w-1/3">
        <NewCategoryForm 
          propState={selectedCategory} 
          resetProps={resetProps}
          /*action={actions}*/
          categoryList={categoriesState.length ? categoriesState : categoryObj.categories} />             
      </div>
      <div className="w-2/3">
        <Categories 
          editCategory={editCategory}
          resetProps={resetProps}
          total={categoriesState.length ? categoriesState.length : categoryObj.total}
          categories={categoriesState.length ? categoriesState : categoryObj.categories} />
      </div>
    </>    
  )
}
