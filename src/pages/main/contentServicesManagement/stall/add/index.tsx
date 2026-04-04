import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { StallCreateDto, StallDto, StallUpdateDto } from "@/dto/stall.dto";
import { useCreateStall } from "@/hooks/stall";
import { useSelectOwners } from "@/hooks/owner";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";
import { API_ENDPOINTS } from "@/services";

export default function AddStallScreen({
  initData,
  title = "Thêm mới quán ăn",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: StallDto;
  isEdit?: boolean;
  handleUpdate?: (data: StallUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateStall } = useCreateStall();
  const { data: owners } = useSelectOwners();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "owner_id",
        label: "Chủ quán",
        type: "select",
        required: true,
        placeholder: "Chọn chủ quán",
        options: owners.map((owner: any) => ({
          name: owner.full_name,
          id: owner.id,
        })),
      },
      {
        name: "name",
        label: "Tên quán ăn",
        type: "input",
        required: true,
        placeholder: "Nhập tên quán ăn",
      },
      {
        name: "latitude",
        label: "Vĩ độ",
        type: "input",
        required: true,
        placeholder: "Nhập vĩ độ",
      },
      {
        name: "longitude",
        label: "Kinh độ",
        required: true,
        type: "input",
        placeholder: "Nhập kinh độ",
      },
      {
        name: "radius",
        label: "Bán kính (m)",
        type: "number",
        required: false,
        placeholder: "Nhập bán kính",
        min: 0,
      },
      {
        name: "cover_image",
        label: "Ảnh bìa",
        type: "image",
        uploadEndpoint: API_ENDPOINTS.STALL.UPLOADIMAGE_GENERAL,
        required: false,
        placeholder: "Nhập URL ảnh bìa",
        isSingle: true,
      },
      {
        name: "category",
        label: "Danh mục",
        type: "input",
        required: false,
        placeholder: "Nhập danh mục",
      },
      {
        name: "price_range",
        label: "Khoảng giá",
        type: "input",
        required: false,
        placeholder: "Nhập khoảng giá",
      },
      {
        name: "opening_hours",
        label: "Giờ mở cửa",
        type: "textarea",
        required: false,
        placeholder: "Nhập giờ mở cửa",
      },
      {
        name: "contact_phone",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "website",
        label: "Website",
        type: "input",
        required: false,
        placeholder: "Nhập website",
      },
    ];

    return fields;
  }, [isEdit, initData?.id, owners]);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values as unknown as StallUpdateDto);
      }
    } else {
      onCreateStall(values as unknown as StallCreateDto);
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
