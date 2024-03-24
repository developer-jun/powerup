// PATH: /admin/product (add new product)
// by default, it will be posted to the database but unpublished
// this is to give way to image upload which needed form submission

import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { create, update, deleteProduct, queryProductsRelationship } from "@/lib/product"
import { createProductCategory, updateProductCategory, deleteProductCategory } from "@/lib/productCategory";
import { generateTypeSafeProductData } from '@/utils/helpers';
import { Product } from '@/types/product';
import { MessagePrompt } from '@/types/common';

interface OrderBy {
  [key: string]: string;
}

export async function GET(request: NextRequest) {
  console.log('SERVER GET');
  const { searchParams } = new URL(request.url);
  console.log('PRODUCT route: ', searchParams);
  const take = searchParams.get('take');
  const skip = searchParams.get('skip');
  const sortBy: string | null = searchParams.get('sortBy') ? searchParams.get('sortBy') : null;
  const order = searchParams.get('order');
  const keyword = searchParams.get('search');
  const category = searchParams.get('category');
  const currentPage = searchParams.get('currentPage');  
  const itemsPerPage = take ? parseInt(take) : 5;

  const productIdRaw = searchParams.get('id');
  
  let whereObjects = {};
  // check if productId is a valid number or undefined
  if(productIdRaw) {
    const productId = parseInt(productIdRaw);
    // GET SINGLE PRODUCT
    whereObjects = {    
      where: {
        id: productId,
      }
    }
  } else {
    // GET MULTIPLE PRODUCTS
  


    // BUILD THE QUERY AND USE THE API Data collected
    
    // Starts with where
    //  if search is present, then it's keyword search
    /*const where = {    
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
      AND: { category: categoryid},
      AND: { isPublished = isPublished }
    }*/

    let keywordWhere = {};
    if(keyword && keyword.trim() !== '') {
      keywordWhere = {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ]
      }
    }

    let categoryWhere = {};
    if(category && parseInt(category) > 0) {
      categoryWhere = {
        productcategory: {
          some: {
            category_id: parseInt(category)
          }
        }
      }
    }

    let sortByObject = { 
      orderBy: {
        id: 'asc',
      } as OrderBy
    };
    if(sortBy) {
      sortByObject = {
        orderBy: {
          [sortBy]: order,
        } as OrderBy
      }
    }

    whereObjects = {    
      where: {
        ...keywordWhere,
        ...categoryWhere,
      },
      ...sortByObject,  
    }
    
    if(searchParams.get('take') !== 'all'){
      whereObjects = {
        ...whereObjects,
        take: itemsPerPage, 
        skip: itemsPerPage * ((currentPage?parseInt(currentPage):1) - 1),  
      }
    }
    
    /*

    const queryObjects = { 
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
    }
    */
    /*
    const pagination: Pagination = {
      totals: 0,
      itemsPerPage: itemsPerPage,
      pageCount: 0,
      currentPage: skip ? ((parseInt(skip) + 1) / itemsPerPage ) : 1, // skip = 10, (10 + 1) / 5 =  mean we are currently at page 2 where the page displays 5 items at a time.
    };
    const sorting: Sorting = {
      field: sortBy ? sortBy : 'id',
      direction: order ? order : 'asc',
    }; 
    const filters: ProductFilter  = {
      search: (keyword && keyword.trim() !== '') ? keyword : '',
      category: category ? parseInt(category) : 0,
      publicationType: '',
    };
    */
    // const productResults = await executeProductFilter(whereObjects);

    // const results = await queryProducts(whereObjects);
    //const results = await queryProductsRelationship(whereObjects);
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
    //console.log('results:', results);
    
    //if(results)  {
      // console.log('executeProductFilter', result);
      //return NextResponse.json(results);
      // productList.originalItems = result.products;
      // productList.pagination.totals = result.totalRecords;
      // productList.pagination.pageCount = Math.ceil(result.totalRecords/productList.pagination.itemsPerPage);

    //}
    //return null;

    //return NextResponse.json(productResults);

    /*
    console.log('GET function')
    const categories = {}; //await getCategories();
    let responseData;

    if(categories.error) {
      console.log('FOUND AN ERROR');
      console.log(categories.error);
      responseData = {status: 'NOK', action: 'GETALL', message: 'Retrieval of Categories Failed!', errorDetails: categories.error}
      return new NextResponse(JSON.stringify({message: 'Retrieval of Categories Failed!', errorDetails: categories.error}), {
        status: 500,
        statusText: 'Database Error',
        headers: {
            'Content-Type': 'application/json'
        }});
    } else {
      console.log('NO ERROR FOUND CATEGORIES SUCCESSFULLY RETRIEVED!');
      return new NextResponse(JSON.stringify(categories));
    }*/
  }

  const results = await queryProductsRelationship(whereObjects);
  console.log('results:', results);
  return NextResponse.json(results);
}

type ProductResponse = {
  
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  let responseData = { data: {}, message: {}}

  console.log('SERVER POST');
  console.log(body);
  
  //let responseData = { messageType: 'success', message: 'Product successfully Created.' };
  // expect this structure body = {product:{name: '', description: '', price: 0, isPublished: true, ...}, category: '0'}
  // build the product structure
  const productData: Product = generateTypeSafeProductData(body.product);

  // TODO: Add simple Validation  
  console.log(productData);

  // Find which Action to take
  if(body.action) {
    switch(body.action) {
      case 'create': {
        console.log('Calling Create LIB');
        // two steps process
        // step 1: create the product (table)
        const { product, error } = await create(productData);
        // step 2: create new product category entry (table)
        // use the newly create product id
        let categoryId = 0;
        if(product) {
          const { resultData: productCategory, error: productCategoryError } = await createProductCategory(product.id, parseInt(body.category));
          //console.log('productCategory: ', productCategory);
          //console.log('productCategoryError: ', productCategoryError);
          if(productCategory) {
            categoryId = productCategory?.category_id;
          }
        }
        //console.log(product, error);
        responseData = { 
          data: {product, categoryId}, 
          message: {messageType: 'success', message: 'Product successfully Created.' }
        };
        if(error) {
          //console.log('ERROR intercepted');
          //console.log(error);
          responseData = {
            data: {},
            message: {messageType: 'error', message: 'Create Product Failed! Please try again. (' + error.message + ')'}
          }
        }
      };
      break;
      case 'update': {
        // two steps process
        // step 1: create the product (table)
        const { product, error } = await update(body.product.id, productData);
        // step 2: create new product category entry (table)
        // use the newly create product id
        let categoryId = 0;
        //if(product) {
        const isSuccess = await updateProductCategory(parseInt(body.product.id), parseInt(body.category));
        //console.log('productCategory: ', productCategory);
        //console.log('productCategoryError: ', productCategoryError);
        if(isSuccess) {
          categoryId = parseInt(body.category);
        }
        //}
        //console.log(product, error);
        responseData = { 
          data: {product, categoryId}, 
          message: {messageType: 'success', message: 'Product successfully Updated.' }
        };
        if(error) {
          //console.log('ERROR intercepted');
          //console.log(error);
          responseData = {
            data: {},
            message: {messageType: 'error', message: 'Update Product Failed! Please try again. (' + error.message + ')'}
          }
        }
      }
      break;

    }
  }


  
  
  return new Response(JSON.stringify(responseData));
}

//export async function POST(request: NextRequest) {
  /**
   * The product can be saved into the database as 'draft', unless the admin checked the published checkbox
   * that being said, two reasons why the form was submitted
   * 1. The product Form has been filled and user submit the form
   * 2. Image is being uploaded
   *    - image upload needed form post hence it's designed this way and we need to do something about it.
   * 
   * So if the product is being submitted because of image upload, no need to trigger form validation and simply process the file upload and return the uploaded file source
   * Since the product is still draft, we need to save the file into a draft dir or temp dir, this way we can delete the images in this dir after a certain period of time.
   * OR we could also just save the draft info into the database without validation
   * Using the latter, the admin can always return back to where he left off even if the browser was closed unintentionally.
   * We will just have to use a discard button in order for the user to delete it.
   */
  


  // TWO STEPS NEEDED
  //let hasFile = false;
  //let filename = '';

  // 1. do file upload first
  /*const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (file) {
    // return NextResponse.json({ success: false })    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    filename = file.name;
    const path = `/tmp/${file.name}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
  }
  */
  //const body = await request.json();
  //let responseData = {};

  //console.log('POSTED TO THE SERVER');
  //console.log(body);
  /*
  const categoryData: Category = {
    name: body.name,
    slug: body.slug,
    description: body.description,
    parent: body.parent,
    count: 0
  }
  if(body.id > 0) {
    console.log('Calling Update LIB');
    console.log(categoryData);
    const updatedCategory = await update(body.id, categoryData);
    console.log('Update DONE');
    console.log(updatedCategory);
    if(updatedCategory.error) {
      console.log(updatedCategory.error);
      responseData = {status: 'NOK', action: 'UPDATE', message: 'Category Update Failed!', errorDetails: updatedCategory.error}
    } else 
      responseData = {status: 'OK', action: 'UPDATE', message: 'Category successfully Updated.', category: updatedCategory}
    
  } else {
    console.log('Calling CREATE LIB');
    const newCategory = await create(categoryData);
    console.log('CREATE DONE');
    console.log(newCategory);
    if(newCategory.error) {
      console.log(newCategory.error);
      responseData = {status: 'NOK', action: 'CREATE', message: 'Category creation Failed!', errorDetails: newCategory.error}
    } else 
      responseData = {status: 'OK', action: 'CREATE', message: 'Category successfully created.', category: newCategory}
  }
  */ 
  
  //return new Response(JSON.stringify(responseData));
//}


export async function DELETE(request: NextRequest, {params}) {
  console.log('DELETE POSTED TO THE SERVER');
  console.log(params);
  console.log(request);
  
  //const reqBody = await request.json(); // not allowed in nextjs, there should be no more body data in the request
  let responseData;
  
  console.log('product id: ' + params.product);
  console.log('category id: ' + params.category);
  const reqBody = {
    product: params.product
  }

  if(reqBody.id > 0) {
    console.log('Calling delete LIB');
    const deleteProductResult = await deleteProduct(reqBody.product);
    if(deleteProductResult.messageType === 'success') {
      const deleteProductCategoryResult = await deleteProductCategory(reqBody.product);

      if(deleteProductCategoryResult.messageType === 'success') {
        responseData = { message: 'Product successfully deleted.', messageType: 'success' } as MessagePrompt;
      } else {
        responseData = { message: 'Product Category deletion Failed. (Details: ' + deleteProductCategoryResult.message + ')', messageType: 'error' } as MessagePrompt;
      }
    } else {
      responseData = { message: 'Product deletion Failed. (Details: ' + deleteProductResult.message + ')', messageType: 'error' } as MessagePrompt;
    }
    console.log('DELETE DONE');
    console.log(updatedCategory);
    if(updatedCategory.error) {
      console.log(updatedCategory.error);
      responseData = {status: 'NOK', action: 'DELETE', message: 'Category DELETE Failed!', errorDetails: updatedCategory.error}
    } else 
      responseData = {status: 'OK', action: 'DELETE', message: 'Category successfully DELETED.', category: updatedCategory}
    
  }   
  
  return new Response(JSON.stringify(responseData));
}


/*export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  const file: File | null = data.get('image') as unknown as File;

  if (file) { 
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `./uploads/${file.name}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
    
    // Return a response to indicate the file has been received and saved
    // res.status(200).json({ path })
    return NextResponse.json({ success: path })   
  } else {
    return NextResponse.json({ success: false, error: 'Upload Failed.' })
  }
 
}*/
function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}