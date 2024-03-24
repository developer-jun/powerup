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
// import { Category } from "@/lib/category"
import { Category, CategoryHierarchy } from "@/types/category";
import React from "react";


const CategoryItem = ({item}: {item: CategoryHierarchy}) => {
  return (
    <tr key={item.id}>
      <th>{item.id}</th>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td><div className="flex flex-row"><a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {props.editCategory(item)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleDelete(item)} /></div></td>
    </tr>
  )
}

const CategoryList = ({items}: {items: CategoryHierarchy[]}) => {
  if(!items) return;  
  return (
    <>
      {items.length ? (
        items.map((item) => (
          <React.Fragment key={item.id}>
            <CategoryItem item={item} />
            {item.children && <CategoryList items={item.children} />}
          </React.Fragment>
        ))
      ) : null}
    </>
  );
}

type CategoriesProps = {
  editCategory(category: Category): void,
  resetProps(): void,
  total: number,
  categories: CategoryHierarchy[],
}

const Categories = (props: CategoriesProps) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [category, setCategory] = useState({id: 0, name: '', description: ''});
  let targetRef = createRef();

  useEffect(() => {
    //console.log('Category List Component Loaded');
    //console.log(props);
    
  }, []);

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

  const handleDelete = (cat: Category) => {
    console.log(cat);
    const selectedCategory = {
      id: cat.id?cat.id:0,
      name: cat.name,
      description: cat.description
    };
    setCategory(_category => ({...selectedCategory}));
    setAlertOpen(true);
  };

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
      props.resetProps({action: 'category_deleted'});
    } catch (error) {
      console.log('ERROR FOUND');
      console.log(error);
    }
    console.log('DELETE PROCESS ENDED')    
  };

  return (
    <div id="category-list">
      
      Total Categories: {props.total}
      {props.categories?.length > 0 && (
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
            <CategoryList items={props.categories} />                       
          </tbody>
        </table>
      )}      

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
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

    </div>
  )
}


export default Categories;