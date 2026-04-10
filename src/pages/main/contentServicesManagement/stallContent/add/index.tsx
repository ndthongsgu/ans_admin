import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type {
  StallContentCreateDto,
  StallContentDto,
  StallContentUpdateDto,
} from "@/dto/stallContent.dto";
import { useCreateStallContent, useSelectStallContents } from "@/hooks/stallContent";
import { useSelectStalls } from "@/hooks/stall";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddStallContentScreen({
  initData,
  title = "Thêm mới nội dung thuyết minh",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: StallContentDto;
  isEdit?: boolean;
  handleUpdate?: (data: StallContentUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateStallContent } = useCreateStallContent();
  const { data: stalls } = useSelectStalls();
  const { data: availableStalls } = useSelectStallContents();
  const router = useRouter();

  const formFields = useMemo(() => {
    const stallOptions = (isEdit ? stalls : availableStalls) || [];

    const fields: FormField[] = [
      {
        name: "stall_id",
        label: "Quán ăn",
        type: "select",
        required: true,
        placeholder: "Chọn quán ăn",
        options: stallOptions.map((stall: any) => ({
          name: stall.name,
          id: stall.id,
        })),
      },
      {
        name: "tts_script",
        label: "Script TTS (dùng để tự động generate audio)",
        type: "textarea",
        required: false,
        placeholder:
          "Nhập script để tự động tạo file âm thanh. Nếu không điền sẽ cần upload audio_url",
      },
    ];

    return fields;
  }, [availableStalls, isEdit, stalls]);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values as unknown as StallContentUpdateDto);
      }
    } else {
      onCreateStallContent(values as unknown as StallContentCreateDto);
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
