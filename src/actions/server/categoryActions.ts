import { getCategories } from "@/lib/category";
import { Category, CategoryHierarchy } from "@/types/category";

export const createCategoryHierarchy = (categories: Category[], parent = 0) : CategoryHierarchy[] => {  
  const categoryHierarchy = [];

  for(let category of categories) {
    if(category.parent === parent) 
      categoryHierarchy.push({...category, children: createCategoryHierarchy(categories, category.id)});
  } 
  return categoryHierarchy;
}

export const getCategoryList = async() => {
  const categories = await getCategories();

  // format the list so that it has hierarchy
  return { total: categories?.length, categories: createCategoryHierarchy(categories)};
  
  // this next approached will work, elegant but it does create unnecessary complexity
  /*
  const createHierarchy = (data, parent = 0, map = {}) => {
    if (!map[parent]) {
      return [];
    }

    return map[parent].map(item => ({
      ...item,
      children: createHierarchy(data, item.id, map)
    }));
  }

  const groupedCategories = categories?.reduce((groupCats, item) => {
    if (!groupCats[item.parent]) {
      groupCats[item.parent] = [];
    }

    groupCats[item.parent].push(item);
    return groupCats;
  }, {});

  return { total: categories?.length, categories: createHierarchy(categories, 0, groupedCategories)};
  //*/
}

