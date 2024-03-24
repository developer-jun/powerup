import { useContext } from "react"
import { CategoryContext } from "../contexts/categoryContext"

const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === null) throw new Error('useCategory must be used within a Category Provider tag');

  return context;
}

export default useCategoryContext;