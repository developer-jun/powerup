import { DropdownOption, CategoryHierarchy, Category } from "@/types/category"

export const createDropdownOptions = (
  categories: CategoryHierarchy[],
  level = 0
): DropdownOption[] => {
  let options: DropdownOption[] = [];
  if (!categories) return options;

  for (let i = 0; i < categories.length; i++) {
    let prefix = "\u00A0".repeat(level * 2); //2BA1 //00A0
    options.push({
      label: prefix + categories[i].name,
      value: categories[i].id,
    });

    if (categories[i].children !== undefined) {
      options = options.concat(createDropdownOptions(categories[i].children as CategoryHierarchy[], level + 1));
    }
  }

  return options;
};

export const createHierarchy = (origCategories: Category[]): CategoryHierarchy[] => {
  
  const map: { [key: number]: CategoryHierarchy } = {}; 

  origCategories.forEach((category) => {
    if (category && category.id !== undefined) {
      map[category.id] = { ...category, children: [] };
    }
  });

  let result: CategoryHierarchy[] = [];
  origCategories.forEach((category) => {
    if (category.parent === null) {
      if (category && category.id !== undefined) {
        result.push(map[category.id]);
      }
    } else {
      if (map[category.parent].children !== undefined && category.id !== undefined) {
        map[category.parent].children?.push(map[category.id]);
      }
    }
  });

  return result;
};

export const validateCategory = ({name, slug} : {name: string, slug: string}) => {
  const formError: Array<string> = [];

  if(name.trim() === '')
    formError.push('Category Title is required!');
  
  if(slug.trim() === '')
    formError.push('Category Slug is required!');

  return formError;
}

export const initCategoryFormValues = () => (
  {
    category: {
      id: 0,
      name: '',
      slug: '',
      description: '',
      parent: 0
    },

    categories: [],
    componentStatus: 'onloaded',

    form: {    
      isProcessing: false,
      message: '',
      messageType: '',
      slugHasManuallyChanged: false,
      editMode: false,
    }
  }
);

export const sampleCategories = (): Category[] => {
  const list: Category[] = [
    {
      "id": 1,
      "name": "",
      "slug": "",
      "description": "",
      "parent": 0,
    },
    /*{
        "id": 1,
        "name": "Shirt",
        "slug": "shirt",
        "description": "",
        "parent": 0,
    },
    {
        "id": 2,
        "name": "Polo",
        "slug": "polo",
        "description": "",
        "parent": 0,
    },
    {
        "id": 3,
        "name": "Pants",
        "slug": "pants",
        "description": "",
        "parent": 0,
    },
    {
        "id": 4,
        "name": "Tiesier",
        "slug": "ties",
        "description": "We sell different designs of ties",
        "parent": 0,
    },*/
  ];

  return list;
}