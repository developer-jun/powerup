"use client"

import { ClipboardEdit, Trash2  } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
// import { useRouter, redirect } from 'next/navigation';

export default function ProductContainer(props: {products: Product[]}) { 
  // const [selectedCategory, setSelectedCategory] = useState({});
  // const [products, setProducts] = useState([]);
  // const [actions, setActions] = useState('');
  // filter category to only includes relevant fields: id, name, and parent. Then inside the form, has to format so that the sub category is displayed below the parent category
  // const parentCategories = props.categories; // temporarily disabled
  
  useEffect(() => {
    //console.log('Parent categories:');
    //console.log(categoriesState);
  },[]);
  
  const handleGroupCheck = (e) => {
    console.log(e.target.value);
  }
  const handleCheckedChange = (e) => {    
    console.log(e.target.value);
  }
  return (
    <section className="grid items-center gap-6 p-7 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-start gap-2">
        <h1 className="flex text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Products <a className="btn btn-sm ml-5 self-center" href="/admin/product/new"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Add New</a>
        </h1>        
        <div className="flex flex-row w-full">
          <div className="overflow-x-auto">
            <div id="product-list">
              <div className="a"></div>
              Total Products: {props.products?.length}
              {props.products?.length > 0 && (
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th><Checkbox onCheckedChange={handleGroupCheck} /></th>
                      <th>Topic</th>
                      <th>Description</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.products?.map((_product: Product, index) => (
                      <tr key={_product.id}>
                        <th>
                        <Checkbox
                          checked={_product.published}
                          onCheckedChange={handleCheckedChange}
                        />
                        </th>
                        <th>{_product.id}</th>
                        <td>{_product.name}</td>
                        <td>{_product.summary}</td>
                        <td><div className="flex flex-row"><a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {props.editCategory(_category)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleDelete(_category)} /></div></td>
                    </tr>
                    ))}            
                  </tbody>
                </table>
              )}    
            </div>
            {/*
              <Products 
                editCategory={editCategory}
                resetProps={resetProps}
                categories={categoriesState.length ? categoriesState : props.categories} />
            */}
          </div>
        </div>               
      </div>     
    </section> 
  )
}
