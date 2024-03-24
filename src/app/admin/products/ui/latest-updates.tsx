'use client';

import React, { useEffect } from 'react'
import { Product } from "@/types/product";
// import { getProducts } from '@/lib/product';
import Link from 'next/link';
import useProducts from "@/app/admin/hooks/useProducts";
// import useProductContext from '@/app/admin/hooks/useProductsContext';

// by moving the variable outside the component, we prevent it from being recreated on every render.
const latestUpdatesParams = { 
  take: '5', 
  skip: '0',
  sortBy: 'updatedAt',
  order: 'desc'
}; // take=5&skip=0&sortBy=id&order=asc&currentPage=1
export default function LatestUpdates({changeListener}: {changeListener: Product | null}) {  
  const {data: products, insertProduct, refreshProducts} = useProducts(new URLSearchParams(latestUpdatesParams).toString());
  /*
  const {storeProducts} = useProductContext();
  useEffect(() => {
    console.log('LatestUpdates useEffect');
    if(products) {
      storeProducts(products);
    }
  }, [products]);
  */
  useEffect(() => {
    if(changeListener) {
      insertProduct(changeListener, parseInt(latestUpdatesParams.take))
    }
  }, [changeListener]);  

  return (
    <ul>
      {products && products.map((product: Product) => (
        <ProductItem key={product.id} product={product} />))}
    </ul>
  )
}

const FormatLastUpdated = ({lastDateModified = new Date().toLocaleDateString()}:{lastDateModified: string | undefined}) => {
  const updateDate = new Date(lastDateModified);
  return (
    <>
      <em>Last Updated on:</em><br /> 
      <span>{
        (new Date().toLocaleDateString() === updateDate.toLocaleDateString()) 
          ? 'Today, ' + updateDate.toLocaleTimeString() 
          : updateDate?.toLocaleString()
        }
      </span><br />
    </>
  )
}

const ProductItem = ({product} : {product: Product}) => {
  const {id, imageUrl, name, updatedAt, summary} = product;
  const updateDate = new Date(updatedAt);
  return (
    <li className="product-item">
      <img className="thumbnail" src={imageUrl?imageUrl:'/random.png'} alt={name} />
      <strong><Link href={`/admin/product/${id}`}>{name}</Link></strong><br />
      <p>
        <FormatLastUpdated lastDateModified={updatedAt?.toLocaleString()} />
        {summary}
      </p>
    </li>
  )
}