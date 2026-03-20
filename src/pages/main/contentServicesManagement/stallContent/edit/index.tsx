import Loading from "@/components/loading/Loading";
import type { StallContentUpdateDto } from "@/dto/stallContent.dto";
import { useDetailStallContent, useUpdateStallContent } from "@/hooks/stallContent";
import { useParams } from "react-router-dom";
import AddStallContentScreen from "../add";

export default function EditStallContentScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailStallContent(id || "");

  const { onUpdateStallContent, isLoading: isLoadingUpdate } = useUpdateStallContent(id || "");

  const handleUpdate = (values: StallContentUpdateDto) => {
    onUpdateStallContent(values);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddStallContentScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa nội dung thuyết minh"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
