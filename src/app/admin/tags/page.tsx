'use client';

import { Metadata } from "next"
import '@/app/admin/styles/components.scss';
import TagForm from "./ui/tagForm";
import TagLists from "./ui/tagLists";
import { Tag } from "@/types/tag";
import { useState } from "react";

const metadata: Metadata = {
  title: "Admin Product Tags",
}

export default async function OptionPage() { 
  const [ refreshList, setRefreshList ] = useState(0);
  const dataChanged = (action: string, tagData: Tag | null) => {
    setRefreshList(prev=>prev+1);
  }

  return (
    <section className="contents">
      <h1>Product Tags</h1>      
        <div className="form-list-container">
          <div className="custom-form">
            <TagForm 
              updateParentOfChanges={dataChanged} 
              preSelected={{} as Tag} />
          </div>
          <div className="custom-list">        
            <TagLists refreshList={refreshList} />
          </div>  
        </div>  
    </section>
  )
}
