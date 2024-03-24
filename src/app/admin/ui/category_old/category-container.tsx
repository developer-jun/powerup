import React from 'react'

import CategoryForm from '@/app/admin/ui/category_old/category-form';
import Categories from "@/app/admin/ui/category_old/category-list";

export default function CategoryContainer() {
  // we need the list of categories to be displayed into a list, and in the form to be selected as parent category.
  // this parent component is the best place for it
  // stateful hook
    
  //const [formReset, setFormReset] = useData('formReset');
  //const [, setSelectedCategory] = useData('selectedCategory');

  // should refetch the category list from the custom hook
  /*if(formReset) {
    resetCategories();
    setFormReset(false);
  }*/


  // local states
  // const [selectedCategory, setSelectedCategory] = useState({});
  // const [categoriesState, setCategoriesState] = useState(Array<Category>);

  // Current Issue:
  // 1. Upon selecting aa category, the whole page re-rendered
  //  - the form should only be the one that re-render, not the list of categories
  //  - this is also because we are passing data back to the parent components and set on a state variable on the main component.
  /*
  const editCategory = (category: Category) => {
    setSelectedCategory(_category => ({...category}));    
  };

  const resetProps = ()=> {
    console.log('RESETTING TOPIC PROPS')
    refetchCategories();
    setSelectedCategory(category => ({}));
    
  };

  const refetchCategories = async () => {
    console.log('Refetching Categories thru API');
    resetCategories(); // useCategories hook function

  } 
  console.log('categoryList:',categoryList);

  */
  return (
    <>
      <div className="w-1/3">
        <CategoryForm />             
      </div>
      <div className="w-2/3">
        {/*
          We're passing editCategory and resetProps functions because the user can select from the list of categories and it will show up in the form
          which is located above, when either of those are triggered, we passed the data into a local state variable to force render either the form or the list of categories.
          re-render might be bad but it's one of the easiest way to let the form know that a new category was selected.
          Then when the user successfully edited or added a new category, we will also update the list by querying the data from the data via API call.
        */}
        <Categories />
      </div>
    </>
  )
}
