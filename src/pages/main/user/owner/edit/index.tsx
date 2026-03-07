import Loading from "@/components/loading/Loading";
import type { OwnerUpdateDto } from "@/dto/owner.dto";
import { useDetailOwner, useUpdateOwner } from "@/hooks/owner";
import { useParams } from "react-router-dom";
import AddOwnerScreen from "../add";

export default function EditOwnerScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailOwner(id || "");

  const { onUpdateOwner, isLoading: isLoadingUpdate } = useUpdateOwner(
    id || ""
  );

  const handleUpdate = (values: OwnerUpdateDto) => {
    onUpdateOwner(values);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddOwnerScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa chủ quán"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}