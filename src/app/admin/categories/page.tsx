'use client';

//import CategoryPageContainer from '@/components/admin/category/category-page-container';
//import { getCategoryList } from "@/actions/server/categoryActions"
import { Metadata } from "next"
import { Provider } from "@/app/admin/contexts/storageContext";
import CategoryContainer from '@/app/admin/ui/category_old/category-container';

// import { Category } from "@/types/category";


// import CategoryList from '@/app/admin/ui/category/category-list';

import '@/app/admin/styles/categories.scss';


const metadata: Metadata = {
  title: "Admin Categories",
}
export default function CategoryPage() {
  
  const categoryData = {
    /*categories: Array<Category>,
    selectedCategory: {} as Category,
    formReset: false,
    editCategory: {} as Category,*/
  }
  return (
    <Provider defaultValue={{}}>
      <section className="category-container">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        CATEGORIES
      </h1>        
      <div className="category-form-list-container">
        <CategoryContainer />
      </div>
    </section>
    </Provider>
        
  );
}
