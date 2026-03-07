import Loading from "@/components/loading/Loading";
import type { StallUpdateDto } from "@/dto/stall.dto";
import { useDetailStall, useUpdateStall } from "@/hooks/stall";
import { useParams } from "react-router-dom";
import AddStallScreen from "../add";

export default function EditStallScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailStall(id || "");

  const { onUpdateStall, isLoading: isLoadingUpdate } = useUpdateStall(
    id || ""
  );

  const handleUpdate = (values: StallUpdateDto) => {
    onUpdateStall(values);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddStallScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa quán ăn"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}