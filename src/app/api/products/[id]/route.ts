import { NextResponse, NextRequest } from 'next/server'
import { create, update, deleteProductAndCategory } from "@/lib/product"
import { createProductCategory, updateProductCategory } from "@/lib/productCategory";
import { generateTypeSafeProductData } from '@/utils/helpers';
import { MessagePrompt } from '@/types/common';
import { Product } from '@/types/product';

// { params } is needed when we are inside a [id] dynamic path directory, that where we get the dynamic directory 
export async function POST(request: NextRequest, {params}) {
  const productId: number = parseInt(params.id) // '1'
  const body = await request.json();
  let responseData = { data: {}, message: {}}

  console.log('POSTED TO SERVER');
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
        const { product, error } = await update(productId, productData);
        // step 2: create new product category entry (table)
        // use the newly create product id
        let category = {};
        //if(product) {
        const {productcategory, error: productCategoryError} = await updateProductCategory(productId, parseInt(body.category));
        //console.log('productCategory: ', productCategory);
        //console.log('productCategoryError: ', productCategoryError);
        if(productcategory) {
          category = productcategory;
        }
        //}
        console.log(product, category);
        responseData = { 
          data: {product: product, category: category}, 
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

  return NextResponse.json(responseData);
}


export async function GET(request: Request, { params }) {
  console.log('params: ', params);
  console.log('GET function of Category ID');
  const categoryId: number = parseInt(params.id) // '1'
  console.log(params);

  try {
    // forced the data paring into defined database table fields
    // const deletedCategory = await deleteCategory(categoryId);
    console.log('RETRIEVE CATEGORY from database');
    // console.log(deletedCategory);
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * 
 * Entry Point to delete a product
 *  - Aside from deleting a product, we also delete the product category entry under productcategory table
 *  - But that would come after we delete the actual product first.
 *  Steps:
 *   - 1. Get the product Info along with productcategory id (primary key)
 *     - with this we verify that the product actually exist in the database and get the productcategory id
 *   - 2. Issue the delete command to product
 *   - 3. IF successful, issue the delete command to productcategory
 *   - 4. Return results
 * @param param1 
 * @returns 
 */
export async function DELETE(request: Request, { params }) {
  const productId: number = parseInt(params.id) // '1'
  console.log('[DELETING] productId: ', productId);
  let responseData;
  if(productId) {
    try {
      const deletionResult = await deleteProductAndCategory(productId);
      console.log('[deletionResult] ', deletionResult);
      if(deletionResult && deletionResult.messageType === 'success') {
        
      } 
      responseData = deletionResult;
      /*
      // GET SINGLE PRODUCT
      let whereObjects = {    
        where: {
          id: productId,
        }
      }
      // STEP 1.
      const {data: productInfo} = await queryProductsRelationship(whereObjects);

      if(productInfo) {
        console.log('productInfo: ', productInfo[0]);

        // STEP 3.
        const deleteProductCategoryResult = await deleteProductCategory(productInfo[0].productcategoryid);
        if(deleteProductCategoryResult && deleteProductCategoryResult.messageType === 'success') {
          // STEP 2.
          const deleteProductResult = await deleteProduct(productId);
          if(deleteProductResult && deleteProductResult.messageType === 'success') {
            // STEP 3.
            //const deleteProductCategoryResult = await deleteProductCategory(productInfo[0].productcategoryid);
            //if(deleteProductCategoryResult && deleteProductCategoryResult.messageType === 'success') {
              responseData = deleteProductResult;
            //}
          }
        }
      } else {
        responseData = { message: 'Product with id [' + productId + '] not found in database.', messageType: 'error' } as MessagePrompt;
      }

      if(!responseData) {
        responseData = { message: 'Product deletion Failed.', messageType: 'error' } as MessagePrompt;
      }
      */
    
    } catch (error) {
      return NextResponse.json({ messageType: 'error', message: error.message}, { status: 500 })
    }
  } else {
    responseData = { message: 'Product with id [' + productId + '] not found in database.', messageType: 'error' } as MessagePrompt;
  }

  // STEP 4.
  return new Response(JSON.stringify(responseData));
}


/*export async function DELETE(request: Request) {
  console.log('POSTED TO THE SERVER');
  const reqBody = await request.json();
  let responseData;

  console.log(reqBody);

  if(reqBody.id > 0) {
    console.log('Calling delete LIB');
    const updatedCategory = await deleteCategory(reqBody.id);
    console.log('DELETE DONE');
    console.log(updatedCategory);
    if(updatedCategory.error) {
      console.log(updatedCategory.error);
      responseData = {status: 'NOK', action: 'DELETE', message: 'Category DELETE Failed!', errorDetails: updatedCategory.error}
    } else 
      responseData = {status: 'OK', action: 'DELETE', message: 'Category successfully DELETED.', category: updatedCategory}
    
  }   
  
  return new Response(JSON.stringify(responseData));
}*/