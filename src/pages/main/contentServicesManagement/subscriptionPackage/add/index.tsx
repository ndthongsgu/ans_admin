import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type {
  SubscriptionPackageCreateDto,
  SubscriptionPackageDto,
  SubscriptionPackageUpdateDto,
} from "@/dto/subscriptionPackage.dto";
import { useCreateSubscriptionPackage } from "@/hooks/subscriptionPackage";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddSubscriptionPackageScreen({
  initData,
  title = "Thêm mới gói đăng ký",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: SubscriptionPackageDto;
  isEdit?: boolean;
  handleUpdate?: (data: SubscriptionPackageUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateSubscriptionPackage } = useCreateSubscriptionPackage();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "name",
        label: "Tên gói",
        type: "input",
        required: true,
        placeholder: "Nhập tên gói",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
      },
      {
        name: "price",
        label: "Giá",
        type: "input",
        required: true,
        placeholder: "Nhập giá",
      },
      {
        name: "duration",
        label: "Thời hạn (ngày)",
        type: "input",
        required: true,
        placeholder: "Nhập thời hạn",
      },
      {
        name: "max_stalls",
        label: "Số quán tối đa",
        type: "input",
        required: true,
        placeholder: "Nhập số quán tối đa",
      },
      {
        name: "max_audio_storage",
        label: "Dung lượng audio tối đa",
        type: "input",
        required: false,
        placeholder: "Nhập dung lượng audio tối đa",
      },
      {
        name: "features",
        label: "Tính năng",
        type: "textarea",
        required: false,
        placeholder: "Nhập tính năng",
        gridColumn: "1 / -1",
      },
    ];

    return fields;
  }, [isEdit]);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values as unknown as SubscriptionPackageUpdateDto);
      }
    } else {
      onCreateSubscriptionPackage(values as unknown as SubscriptionPackageCreateDto);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns="repeat(2, 1fr)"
      />
    </BaseView>
  );
}
