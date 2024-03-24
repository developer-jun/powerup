'use client';

import { Metadata } from "next"
import ProductContainer from "./ui/product-container";
import { Provider } from "@/app/admin/contexts/productContext";
import { getProductListStruct, integrateUrlParams } from '@/app/admin/utils/productHelpers';
//import useUrlParams from "../hooks/useUrlParams";

const metadata: Metadata = {
  title: "Admin Products",
}
let initialvalue = getProductListStruct();
export default async function ProductsPage() {  
  //let initialvalue = getProductListStruct();
  //const { getCurrentParams } = useUrlParams();
  console.count('[PRODUCTS PAGE]');
  // use this opportunity to grab the url params and apply them to the initialvalue
  // initialvalue.productModifiers = integrateUrlParams({productModifiers: initialvalue.productModifiers, urlParams: getCurrentParams()});
  return (
    <Provider initialValue={initialvalue}>
      <section className="contents">
        <ProductContainer  />
      </section>
    </Provider>      
  )
}