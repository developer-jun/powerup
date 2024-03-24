import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { create, update, getTags } from '@/lib/tag'
import { Tag } from '@/types/tag';

export async function GET(request: NextRequest) {
  console.log('SERVER TAG GET');
  const result = await getTags();
  return new Response(JSON.stringify(result));  
}
export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('POSTED TO THE SERVER');
  console.log(body);
  try {  
    // manually construct the options object using the parsed data from the body
    let data = {} as Tag
    let result = {};
    if(body.item_id) {
      // update
      data = {
        tag_id: body.tag_id,
        name: body.name,
        description: body.description 
      };
      result = await update(data);
    } else {
      // create
      data = {        
        name: body.name,
        description: body.description
      }
      result = await create(data);
    }
    // console.log('Result from lib ',result);
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.log('QUERY ERROR');
    console.error('Option creation error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Option creation failed',
      details: String(error)
    }));
  }
}

/*
export asOption
  console.log('GET function')
  const categories = await getCategories();
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
  }

}
*/


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