import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { create, update } from '@/lib/optionItem'
import { Option, OptionItem } from '@/types/option';
import { JSONReturn } from '@/types/common';
import { getOption, getOptions } from '@/lib/option';

export async function GET(request: NextRequest) {
  //const body = await request.json();
  console.log('SERVER OPTION GET');
  //console.log(body);

  const result = await getOptions();
  // we use option_id to identify if the request is single option or all options
  //if(body.option_id && body.option_id > 0) {  
  //  result = await getOption(body.option_id);
  //} else {
    
  //}

  console.log('Result from lib ',result);
  return new Response(JSON.stringify(result));

}
export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('POSTED TO THE SERVER');
  console.log(body);
  try {  
    // manually construct the options object using the parsed data from the body
    let optionItemData = {} as OptionItem
    let result = {};
    if(body.item_id) {
      // update
      optionItemData = {
        item_id: body.item_id,
        item_name: body.item_name,
        option_id: body.option_id 
      };
      result = await update(optionItemData);
    } else {
      optionItemData = {
        item_name: body.item_name,
        option_id: body.option_id,
      }
      result = await create(optionItemData);
    }
    // console.log('Result from lib ',result);
    return new Response(JSON.stringify({
      status: 'success',
      data: result
    }));
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