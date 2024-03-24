import { useContext } from "react"
import { ProductContext } from "../../contexts/productContext"

const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === null) throw new Error('useProductContext must be used within a Product Provider tag');

  return context;
}

export default useProductContext;