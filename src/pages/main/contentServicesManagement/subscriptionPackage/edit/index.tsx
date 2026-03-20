import Loading from "@/components/loading/Loading";
import type { SubscriptionPackageUpdateDto } from "@/dto/subscriptionPackage.dto";
import { useDetailSubscriptionPackage, useUpdateSubscriptionPackage } from "@/hooks/subscriptionPackage";
import { useParams } from "react-router-dom";
import AddSubscriptionPackageScreen from "../add";

export default function EditSubscriptionPackageScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailSubscriptionPackage(id || "");

  const { onUpdateSubscriptionPackage, isLoading: isLoadingUpdate } = useUpdateSubscriptionPackage(
    id || ""
  );

  const handleUpdate = (values: SubscriptionPackageUpdateDto) => {
    onUpdateSubscriptionPackage(values);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddSubscriptionPackageScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa gói đăng ký"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}