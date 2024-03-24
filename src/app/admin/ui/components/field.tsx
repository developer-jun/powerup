
import useData from "@/app/admin/hooks/useData";

const Field = ({ field }: { field: string }) => {
  const [fieldValue,] = useData(field, {[field]: ''});

  return (
    <>
      {fieldValue}
    </>
  );
};

export default Field;
