import Loading from "@/components/loading/Loading";
import type { RoleCreateUpdateDto } from "@/dto/role.dto";
import { useDetailRole, useUpdateRole } from "@/hooks/role";
import { useParams } from "react-router-dom";
import AddRoleScreen from "../add";

export default function EditRoleScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailRole(id || "");

  const { onUpdateRole, isLoading: isLoadingUpdate } = useUpdateRole(
    id || ""
  );

  const handleUpdate = (values: RoleCreateUpdateDto) => {
    onUpdateRole(values);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddRoleScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa vai trò"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}