import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { update, deleteOptionItem } from '@/lib/optionItem'
import { OptionItem } from '@/types/option';
import { JSONReturn } from '@/types/common';

export async function POST(request: NextRequest, {params}) {
  const body = await request.json();

  let responseData;
  const optionItemId: number = parseInt(params.id) // '1'  

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

      return new Response(JSON.stringify({
        status: 'success',
        data: result
      }));
    } else {
      throw 'Invalid option item data';
    }
    
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



export async function DELETE(request: Request, {params}) {
  let responseData;
  const optionItemId: number = parseInt(params.id) // '1' 

  try {  
    let result = {};
    if(optionItemId) {
      // delete
      result = await deleteOptionItem(optionItemId);

      return new Response(JSON.stringify({
        status: 'success',
        data: result
      }));
    } else {
      throw 'Invalid option item data';
    }
    
  } catch (error) {
    console.log('QUERY ERROR');
    console.error('Option creation error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Option deletion failed',
      details: String(error)
    }));
  }   
}
