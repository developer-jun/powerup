import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { create, update } from '@/lib/option'
import { Option } from '@/types/option';
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

  // manually construct the options object using the parsed data from the body
  let optionData = {} as Option
  let result = {};
  if(body.option_id) {
    // update
    optionData = {
      option_id: body.option_id,
      option_name: body.option_name,
      option_description: body.option_description,
    } as Option
    result = await update(optionData);
  } else {
    optionData = {
      option_name: body.option_name,
      option_description: body.option_description,
    } as Option
    result = await create(optionData);
  }
  console.log('Result from lib ',result);
  return new Response(JSON.stringify(result));
  
  // the return from the update or create is already formatted to type QueryReturn, so it's safe to convert it into JSON
  /*return new Response(JSON.stringify(
    await (optionData.option_id && optionData.option_id > 0) 
      ? update(optionData) : create(optionData)
  ));*/

  /*if(optionData.option_id && optionData.option_id > 0)
    return new Response(JSON.stringify(await update(optionData)));
  else
    return new Response(JSON.stringify(await create(optionData)));*/
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