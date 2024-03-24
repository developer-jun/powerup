import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ClipboardEdit, Trash2  } from 'lucide-react';
import { useEffect, useState, createRef } from "react";
import { Category, CategoryHierarchy } from "@/types/category";
import useCategories from '@/app/admin/hooks/useCategories';
import useData from '@/app/admin/hooks/useData';
import React from "react";


type CategoriesProps = {
  editCategory(category: Category): void,
  resetProps(): void,
  //categories: CategoryHierarchy[],
}

const Categories = (props: CategoriesProps) => {
  //const {categoryList, resetCategories} = useCategories();  
  //const [category, setCategory] = useState({id: 0, name: '', description: ''});
  let targetRef = createRef();
  //const [categories, setCategories] = useData('categories', {categories: Array<Category>})
  
  //useEffect(() => {    
  //  setCategories(categoryList);
  //}, [categoryList]);

  const scrollToTarget = () => {
    setTimeout(() =>{
        targetRef.scrollIntoView({
            behavior: 'smooth'
        }) 
       }, 500);
  }
  
  const handleEdit = (category: Category) => {
    props.editCategory(category);
  }; 

  return (
    <div id="category-list">
      
      <TotalCount />
      <table className="table table-zebra">
        <thead>
          <tr>
            <th></th>
            <th>Topic</th>
            <th>Description</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <CategoryList  />                       
        </tbody>
      </table>
         

      <DialogContent />

    </div>
  )
}

const DialogContent = () => {
  const [category,] = useData('selectCategory', {id: 0, name: '', description: ''} as Category);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleConfirmDelete = async () => {    
    try {    
      console.log('DELETE PROCESS STARTED')    
      const res = await fetch(`http://localhost:3000/api/category/${category.id}`, { 
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache",
        body: JSON.stringify({id: category.id})
      })
      
      // {status: 'OK', action: 'GETALL', categories: categories}
      console.log('WHAT THE SERVER RETURNED');
      console.log(res);
      // First thing to do is check the result status
      if(!res.ok) {
        throw new Error('Request Error', { cause: {res} })
      }
      // props.resetProps({action: 'category_deleted'});
    } catch (error) {
      console.log('ERROR FOUND');
      console.log(error);
    }
    console.log('DELETE PROCESS ENDED')    
  };

  return (
    <AlertDialog open={alertOpen} onOpenChange={e=>setAlertOpen(false)}>
      <AlertDialogTrigger></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
          <AlertDialogDescription>
            <h3 className="text-lg font-bold text-slate-700">{category.name}</h3>
            <p>{category.description}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const CategoryItem = (item: CategoryHierarchy) => {
  const [, setCategory] = useData('selectCategory');
  
  return (
    <tr key={item.id}>
      <th>{item.id}</th>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td><div className="flex flex-row"><a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {setCategory(item)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleDelete(item)} /></div></td>
    </tr>
  )
}

const CategoryList = () => {
  const {categoryList, resetCategories} = useCategories();  
  const [categories, setCategories] = useData('categories', {categories: Array<Category>})

  useEffect(() => {    
    setCategories(categoryList);
  }, [categoryList]);

  /*const handleEditItem = (categoryItem: CategoryHierarchy) => {
    editCategoryItem(categoryItem);
  }*/

  if(!categories.categories) return;  
  
  console.log('categories: ', categories);
  return (
    <>
      {categories.categories.length ? (
        categories.categories.map(item => (
          <React.Fragment key={item.id}>
            <CategoryItem {...item} />
            {/*item.children && <CategoryList items={item.children}  />*/}
          </React.Fragment>
        ))
      ) : null}
    </>
  );
}

const TotalCount = ({totalCategory}: {totalCategory: number}) => {
  return <>
    Total Categories: {totalCategory}
  </>
}

export default Categories;