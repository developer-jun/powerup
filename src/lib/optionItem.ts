import prisma from './db';
import { Option, OptionAndItems, OptionItem } from "@/types/option"; //OptionAndItemsQuery
import { QueryReturnType, QueryReturn, JSONReturn } from '@/types/common';

export async function getOptionItems(): Promise<QueryReturn<OptionAndItems[]>> {
  try{
    return {
      data: await prisma.option.findMany({
        include: {
          optionitem: true
        }
      }) as OptionAndItems[],
      status: 'success',
    }
  } catch (error: any) {
    return {
      status: 'error',
      message: 'Options failed to be retrieved',
      details: error.message
    }   
  }
}

export const create = async (item_data: OptionItem): Promise<QueryReturn<OptionItem>> => {
  console.log('create:', item_data);
  try {
    const newOptionItem = await prisma.optionitem.create({data: item_data});
    return {
      data: newOptionItem,
      status: 'success',
    }    
  } catch (error: any) {
    console.log('QUERY ERROR');
    console.error('Option creation error:', error);
    return {
      status: 'error',
      message: 'Option creation failed',
      details: String(error.message)
    }
  }
}

export const update = async (item_data: OptionItem): Promise<QueryReturn<OptionItem>> => {
  try {
    return {
      status: 'success',
      data: await prisma.optionitem.update({
        where: { item_id: item_data.item_id },
        data: item_data
      })      
    }    
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(String(error));
    return {
      status: 'error',
      message: 'Option update failed',
      details: String(error)
    }
  }
}

export const deleteOptionItem = async (item_id: number): Promise<QueryReturn<OptionItem>> => {
  try {
    return {
      status: 'success',
      data: await prisma.optionitem.delete({
        where: { item_id },
      })      
    }    
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(String(error));
    return {
      status: 'error',
      message: 'Option update failed',
      details: String(error)
    }
  }
}


type OptionAndItemsQuery = {
  data: Option | null;
  message: string;
  type: boolean; // 0 = error, 1 = success
}
export async function getOption(option_id: number): Promise<QueryReturn<OptionItem>> {
  try{
    return {
      status: 'success',
      data: await prisma.option.findFirst({
        where: { option_id},
        include: {
          optionitem: true
        }
      })
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Retrieval failed.',
      details: String(error)
    }
  }
  //return results as QueryReturn<OptionAndItems>;
}

