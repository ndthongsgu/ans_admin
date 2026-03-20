import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { OwnerCreateDto, OwnerDto, OwnerUpdateDto } from "@/dto/owner.dto";
import { useCreateOwner } from "@/hooks/owner";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddOwnerScreen({
  initData,
  title = "Thêm mới chủ quán",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: OwnerDto;
  isEdit?: boolean;
  handleUpdate?: (data: OwnerUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateOwner } = useCreateOwner();
  const router = useRouter();

  // Transform initData to use full_name instead of name
  const transformedInitData = initData ? {
    ...initData,
    full_name: initData.name
  } : undefined;

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "full_name",
        label: "Tên chủ quán",
        type: "input",
        required: true,
        placeholder: "Nhập tên chủ quán",
      },
      {
        name: "email",
        label: "Email",
        type: "input",
        required: true,
        placeholder: "Nhập email",
        rules: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" }],
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
        rules: [{ pattern: /^(0|\+84)\d{9,10}$/, message: "Số điện thoại không hợp lệ" }],
      },
      {
        name: "business_name",
        label: "Tên doanh nghiệp",
        type: "input",
        required: false,
        placeholder: "Nhập tên doanh nghiệp",
      },
      {
        name: "business_address",
        label: "Địa chỉ doanh nghiệp",
        type: "textarea",
        required: false,
        placeholder: "Nhập địa chỉ doanh nghiệp",
        gridColumn: "1 / -1",
      },
    ];

    // Only show password field when creating new owner
    if (!isEdit) {
      fields.splice(5, 0, {
        name: "password",
        label: "Mật khẩu",
        type: "input",
        required: true,
        placeholder: "Nhập mật khẩu",
        rules: [{ min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }],
      });
    }

    return fields;
  }, [isEdit]);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values as unknown as OwnerUpdateDto);
      }
    } else {
      onCreateOwner(values as unknown as OwnerCreateDto);
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
        initialValues={transformedInitData}
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