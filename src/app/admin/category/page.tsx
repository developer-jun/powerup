'use client';

import { Metadata } from "next"
import CategoryPageContainer from './ui/category-page-container';
import { Provider } from "@/app/admin/contexts/categoryContext";
import { ContextDataCategory } from "@/types/category";
import { sampleCategories } from '@/app/admin/utils/categoryHelpers';
import '@/app/admin/styles/components.scss';

const metadata: Metadata = {
  title: "Admin Categories",
}
export default async function CategoryPage() {    
  // One might wonder why this page is only a wrapper of a component?
  // It's true that it's an ugly design, but the main purpose of this page is to query the category first while still on the server
  // this way, it will be a lot faster than the usual design where this page will become a client component then use API to query the data.
  // that's an unnecessary round trip request. Think about it, we are already in the server why don't we just retrieve the data now.
  // This way, the client components will now be populated and the user can already see the page loaded right away.
  // That's because, when going with the API route, Nextjs won't do anything and simply send everything to the browser, then when it's ready, it will request an API call back to the server to get the data
  // For me that's inefficient, it's the same reason why I kind of don't like the T3 stack of theo aside from it's versions includes older stable versions of next, axios, rpc, etc..
  const categoryData: ContextDataCategory  = {    
    categories: sampleCategories(),
    hierarchedCategories: [],
    selectedCategory: null,
  }

  return (      
    <Provider initialValue={categoryData}>
      <section className="contents">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            CATEGORIES
          </h1>        
          <div className="form-list-container">
            <CategoryPageContainer />         
          </div>  
      </section>
    </Provider>
  )
}
