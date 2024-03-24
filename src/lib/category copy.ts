// import { Prisma } from '@prisma/client'
import prisma from "./prisma";

export interface Category {
  id?         : number;
  name        : string;
  slug        : string;
  description : string;
  parent      : number;
  count?      : number;
}

export interface ICategory {
  id          : number;
  name        : string;
  slug        : string;
  description : string;
  parent      : number;
  count       : number;
}
export interface ICategoryFull {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
}

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

export async function getCategories() {
  try{
    console.log('THE getCategories() function is called');
    const categories = await prisma.category.findMany();
    console.log(categories);
    return categories;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

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
    await prisma.category.delete({
      where: {
        id: id
      }
    });

    // const users = await prisma.user.findMany();
    // console.log(users);
    return true;
  } catch (error) {
    console.log('QUERY ERROR')
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