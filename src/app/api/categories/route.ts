import { NextResponse, NextRequest } from 'next/server'
import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'


export async function GET(request: NextRequest) {
  console.log('GET function')
  const categories = await getCategories();
  let responseData;

  if(categories && categories.error) {
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
    // console.log('NO ERROR FOUND CATEGORIES SUCCESSFULLY RETRIEVED!');
    return new NextResponse(JSON.stringify(categories));
  }

}

export async function POST(request: NextRequest) {
  const body = await request.json();
  let responseData;

  console.log('POSTED TO THE SERVER');
  console.log(body);
  
  const categoryData: Category = {
    name: body.name,
    slug: body.slug,
    description: body.description,
    parent: body.parent,
    count: 0
  }
  
  if(body.id > 0) {
    const updatedCategory = await update(body.id, categoryData);
    if(updatedCategory.error) {
      responseData = {status: 'NOK', action: 'UPDATE', message: 'Category Update Failed!', errorDetails: updatedCategory.error}
    } else 
      responseData = {status: 'OK', action: 'UPDATE', message: 'Category successfully Updated.', category: updatedCategory}
    
  } else {
    const newCategory = await create(categoryData);
    if(newCategory.error) {
      responseData = {status: 'NOK', action: 'CREATE', message: 'Category creation Failed!', errorDetails: newCategory.error}
    } else 
      responseData = {status: 'OK', action: 'CREATE', message: 'Category successfully created.', category: newCategory}
  }    
  
  return new Response(JSON.stringify(responseData));
}

/*
export async function DELETE(request: Request) {
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
}
*/
function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}