
// import { useData } from "@/app/admin/contexts/warehouseContext";
import {useData} from "@/app/admin/contexts/storageContext";

const FieldDisplay = ({ field }: { field: "first" | "last" }) => {
  const [fieldValue,] = useData(field);

  return (
    <div className="value">
      {field}: {fieldValue}
    </div>
  );
};

export default FieldDisplay;
