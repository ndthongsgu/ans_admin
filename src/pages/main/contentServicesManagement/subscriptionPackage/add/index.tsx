import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type {
  SubscriptionPackageCreateDto,
  SubscriptionPackageDto,
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
  handleUpdate?: (data: any) => void;
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
        name: "code",
        label: "Mã gói",
        type: "input",
        required: true,
        placeholder: "Nhập mã gói",
      },
      {
        name: "price",
        label: "Giá",
        type: "number",
        required: true,
        placeholder: "Nhập giá",
      },
      {
        name: "max_stalls",
        label: "Số quầy tối đa",
        type: "number",
        required: true,
        placeholder: "Nhập số quầy tối đa",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
        gridColumn: "1 / -1",
      },
    ];
    return fields;
  }, []);

  const handleSubmit = (values: any) => {
    const submitData: SubscriptionPackageCreateDto = {
      name: values.name,
      code: values.code,
      price: Number(values.price),
      max_stalls: Number(values.max_stalls),
      description: values.description || "",
    };

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(submitData);
      }
    } else {
      onCreateSubscriptionPackage(submitData);
    }
  };

  const goBack = () => {
    router.back();
  };

  const initialValues = useMemo(() => {
    if (!initData) return undefined;

    return {
      ...initData,
    };
  }, [initData]);

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        initialValues={initialValues}
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
