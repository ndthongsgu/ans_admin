import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { StallContentCreateDto, StallContentDto, StallContentUpdateDto } from "@/dto/stallContent.dto";
import { useCreateStallContent } from "@/hooks/stallContent";
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
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "stall_id",
        label: "ID Quán ăn",
        type: "input",
        required: true,
        placeholder: "Nhập ID quán ăn",
      },
      {
        name: "title",
        label: "Tiêu đề",
        type: "input",
        required: true,
        placeholder: "Nhập tiêu đề",
      },
      {
        name: "language_code",
        label: "Mã ngôn ngữ",
        type: "input",
        required: false,
        placeholder: "Nhập mã ngôn ngữ",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
      },
      {
        name: "short_description",
        label: "Mô tả ngắn",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả ngắn",
      },
      {
        name: "audio_url",
        label: "URL Audio",
        type: "input",
        required: true,
        placeholder: "Nhập URL audio",
      },
      {
        name: "audio_duration",
        label: "Thời lượng (giây)",
        type: "input",
        required: false,
        placeholder: "Nhập thời lượng",
      },
      {
        name: "audio_file_size",
        label: "Kích thước file (byte)",
        type: "input",
        required: false,
        placeholder: "Nhập kích thước file",
      },
      {
        name: "tts_script",
        label: "Script TTS",
        type: "textarea",
        required: false,
        placeholder: "Nhập script TTS",
      },
      {
        name: "version",
        label: "Phiên bản",
        type: "input",
        required: false,
        placeholder: "Nhập phiên bản",
      },
    ];

    return fields;
  }, [isEdit]);

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