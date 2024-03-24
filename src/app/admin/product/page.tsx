// SERVER COMPONENT
import { Product } from "@/types/product";
import { getPaginableProducts } from '@/actions/server/productAction';
import { getCategoryList } from "@/actions/server/categoryActions";
// import { getProducts } from "@/lib/product"
import { Metadata } from "next"
import ProductList from '@/components/admin/product/product-list';


const metadata: Metadata = {
  title: "Admin Products",
}

type ProductPagination = {
  take: 100, 
  skip: 0, 
  orderBy: {
    createdAt: 'asc',
  }
}

export default async function ProductsPage() { 
  // One might wonder why this page is only a wrapper of a component?
  // It's true that it's an ugly design, but the main purpose of this page is to query the category first while still on the server
  // this way, it will be a lot faster than the usual design where this page will become a client component then use API to query the data.
  // that's an unnecessary round trip request. Think about it, we are already in the server why don't we just retrieve the data now.
  // This way, the client components will now be populated and the user can already see the page loaded right away.
  // That's because, when going with the API route, Nextjs won't do anything and simply send everything to the browser, then when it's ready, it will request an API call back to the server to get the data
  // For me that's in-efficient, it's the same reason why I kind of don't like the T3 stack of theo aside from it's versions includes older stable versions of next, axios, rpc, etc..

  // console.log('ProductsPage() calling getProducts()'); 
  
  
  /*const products: Array<Product> = await getProducts({ 
    take: 100, 
    skip: 0, 
    orderBy: {
      createdAt: 'asc'
    }
  });*/
  const productList = await getPaginableProducts();
  const categoryList = await getCategoryList();
  console.log('categories: ', categoryList);
  console.log('productpage productList:', productList);
  return (
    <section className="contents">
      {/*<div className="custom-btn-container">
        <div className="custom-btn-wrap">
          <button className="custom-btn1">
            <svg width="100px" height="36px" viewBox="0 0 180 60" className="border">
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
            </svg>
            <span>HOVER ME</span>
          </button>
        </div>
      </div>*/}
      <h1>
        Products <a className="btn btn-sm ml-5 self-center" href="/admin/product/new"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Add New</a>
      </h1>        
      <div className="flex flex-row w-full">
        <ProductList productList={productList} categoryList={categoryList.categories} />        
      </div>               
    </section>      
  )
}
