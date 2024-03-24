'use client';

import { Metadata } from "next"
import OptionGroups from "./ui/optionGroups";
import { Provider } from "../contexts/optionContext";
import '@/app/admin/styles/components.scss';

const metadata: Metadata = {
  title: "Admin Options",
}

export default async function OptionPage() { 
  return (
    <Provider>
      <section className="contents">
        <h1>Product Options</h1>      
          <div className="form-list-container">
            <OptionGroups />
          </div>  
      </section>
    </Provider>
  )
}
