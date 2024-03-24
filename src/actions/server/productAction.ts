import { Product, ProductPaginable, getPaginableProductStructure, SearchProductTypes } from "@/types/product";
import { getProducts, queryProducts, create } from "@/lib/product"


// Product Action Service which can talked to the library
// Act like a middleware or simply a service for server side operations that needs DB access.
// 

export const getPaginableProducts = async () => {   
  const productList = getPaginableProductStructure();
  
  const result = await queryProducts({ 
    take: productList.pagination.itemsPerPage, 
    skip: productList.pagination.itemsPerPage * (productList.pagination.currentPage - 1), 
    orderBy: {
      id: 'asc'
    }
  });
 
  if(result && result.count && result.products)  {
    productList.originalItems = result.products;
    productList.pagination = {
      ...productList.pagination,
      ...{        
        totals: result.count,
        pageCount: Math.ceil(result.count/productList.pagination.itemsPerPage),
      }
    }
    //productList.pagination.totals = result.count;
    //productList.pagination.pageCount = Math.ceil(result.count/productList.pagination.itemsPerPage);
  }

  return productList;
}




export const executeProductFilter = async (whereObjects) => {
  console.log('WHERE STATEMENT:',whereObjects);
  //return whereObjects;
  const result = await queryProducts(whereObjects);
  // const result = await queryProductsTest(whereObjects);
  
  /*const queryParams = {

  }
  const result = await queryProducts({ 
    where: {
      OR: [
        { name: { contains: searchParams.filters.search } },
        { description: { contains: searchParams.filters.search } },
      ],
    },
    take: searchParams.pagination.itemsPerPage, 
    skip: searchParams.pagination.itemsPerPage * (productList.pagination.currentPage - 1), 
    orderBy: {
      [searchParams.sorting.field]: searchParams.sorting.direction
    }
  });
  */
  console.log('results:', result);
  
  if(result && result.count && result.products)  {
    // console.log('executeProductFilter', result);
    return {count: result.count, products: result.products};
    // productList.originalItems = result.products;
    // productList.pagination.totals = result.totalRecords;
    // productList.pagination.pageCount = Math.ceil(result.totalRecords/productList.pagination.itemsPerPage);

  }

  return null;
}

/**

const products = await prisma.product.findMany({
  where: {
    OR: [
      { name: { contains: 'shirt' } },
      { description: { contains: 'shirt' } },
    ],
  },
});

 */