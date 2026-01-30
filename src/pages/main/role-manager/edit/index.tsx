import Loading from "@/components/loading/Loading";
import { useRoleDetail, useUpdateRole } from "@/hooks/role";
import { useParams } from "react-router-dom";
import AddRoleScreen from "../add";

export default function EditRoleScreen() {
  const { id } = useParams();
  const { data, isLoading } = useRoleDetail(id || "");
  const { onUpdateRole, isLoading: isLoadingUpdate } = useUpdateRole(id || "");

  const handleUpdate = (values: any) => {
    onUpdateRole(values);
  };

  if (isLoading) return <Loading />;

  return (
    <AddRoleScreen
      title="Chỉnh sửa vai trò"
      isEdit={true}
      initData={data} // Assuming data includes permissions structure compatible with Add screen
      handleUpdate={handleUpdate}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
