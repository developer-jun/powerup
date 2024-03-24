// import { Prisma } from '@prisma/client'
// import prisma from "./prisma";
import prisma from './db';
import {Category, CategoryWithChildren} from "@/types/category";


export async function getCategory(categoryId: number) {
  try{
    const topic = await prisma.category.findFirst({where: { id: categoryId}})
    // console.log(users);
    return topic;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

export async function getCategories(parent = 1): Promise<Category[] | { error: Error }> {
  try {
    if (typeof parent !== 'number' || parent < 0)
      throw new Error('Invalid parent value');    
    
    // parent = 1;
    const where = (parent > 0) ? { where: { parent } } : {};
    const categories = await prisma.category.findMany(where);
    return categories;
  } catch (error) {
    console.error('QUERY ERROR', error);
    
    if (error instanceof Error)
      return { error };
    
    throw error;
  }
}

export async function getCategoryHeirarchy(parent = 0): Promise<CategoryWithChildren | { error: Error }> {
  try {
    if (typeof parent !== 'number' || parent < 0)
      throw new Error('Invalid parent value');       

    // get two levels of children
    const withChildren = await prisma.category.findUnique({where:{id: 1}, include: {children: {include: {children: true}}}});

    return withChildren;

  } catch (error) {
    console.error('QUERY ERROR', error);
    
    if (error instanceof Error)
      return { error };
    
    throw error;
  }
}


/*
export async function getCategories(parent = 0) {
  try{
    let where = {};
    if(parent > 0) {
      where = { 
        where: {
          parent: parent
        }
      }
    }
    const categories = await prisma.category.findMany(where);
    return categories;
  } catch (error) {
    console.error('QUERY ERROR', error);
    return null;
  }

}
*/




export async function getCategoriesNoCache() {
  try{
    console.log('THE getCategoriesNoCache() function is called');
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

export async function create(categoryData: Category) {
  try{
    const newCategory = await prisma.category.create({
      data: categoryData
    });    
    
    return newCategory;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

export async function update(id: number, categoryData: Category) {
  try{
    const updateCategory = await prisma.category.update({
      where: {
        id: id
      },
      data: categoryData      
    });
    return updateCategory;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }
}

export async function deleteCategory(id: number) {
  try{
    // First operation: count the number of subcategories
    const count = await prisma.category.count({ where: { parent: id } });
    if (count > 0) {
      throw new Error('Cannot delete a category that has CHILD category');
    }
    // Second operation: delete the category
    const deletedCategory = await prisma.category.delete({ where: { id } });
    // If no error was thrown, the category was deleted successfully
    return deletedCategory;
  } catch (error) {
    // console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }
}


/*export async function getTopicsAndNotes() {
  try{
    const categories = await prisma.category.findMany({
      include: {
        products: true
      }
    });
    // console.log(users);
    return categories;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }
}*/