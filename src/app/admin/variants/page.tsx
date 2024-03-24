'use client';
import CategoryPageContainer from '@/components/admin/category/category-page-container';
import { getCategoryList } from "@/actions/server/categoryActions"
import { Metadata } from "next"
import useOptions from '../hooks/useOptions';

const metadata: Metadata = {
  title: "Admin Categories",
}
export default function CategoryPage() { 
  const options = useOptions();
  
  const categoryObj = await getCategoryList();

  return (      
    <section className="category-container">
      {/*<div className="flex flex-col items-start gap-2">*/}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          CATEGORIES
        </h1>        
        <div className="category-form-list-container">
          <CategoryPageContainer categoryObj={categoryObj} />          
        {/*</div>*/}
        </div>  
    </section> 
  )
}
