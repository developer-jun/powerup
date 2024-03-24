import { NextResponse, NextRequest } from 'next/server'
import { update, deleteCategory, Category } from '@/lib/category'

// { params } is needed when we are inside a [id] dynamic path directory, that where we get the dynamic directory 
export async function POST(request: NextRequest, { params }) {
  const body = await request.json();
  let responseData;
  const categoryId: number = parseInt(params.id) // '1'
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
  
  return new Response(JSON.stringify(responseData));
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

export async function DELETE(request: Request, { params }) {
  const categoryId: number = parseInt(params.id) // '1'
  try {
    const deleteResult = await deleteCategory(categoryId);
    if(deleteResult.error !== undefined) {
      return NextResponse.json({ messageType: 'warning',  message: deleteResult.error.message }, { status: 200 })
    } else {
      return NextResponse.json({ messageType: 'success', message: 'Category successfully deleted!' }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ messageType: 'error', message: error.message}, { status: 500 })
  }
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