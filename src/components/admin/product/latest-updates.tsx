import React from 'react'
import { Product } from "@/types/product";
import { getProducts } from '@/lib/product';
import Link from 'next/link';

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

export default async function LatestUpdates() {
  const products: Array<Product> = await getProducts({ 
    take: 5, 
    skip: 0, 
    orderBy: {
      updatedAt: 'desc'
    }
  });
  return (
    <ul>
      {products.map((product: Product) => (
        <ProductItem key={product.id} product={product} />))}
    </ul>
  )
}
