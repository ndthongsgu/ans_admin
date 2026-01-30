import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useCreateEmployee } from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddEmployeeScreen({
  initData,
  title = "Thêm mới nhân viên",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: EmployeeDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateEmployee } = useCreateEmployee();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "userId",
        label: "User ID",
        type: "input",
        required: true,
        placeholder: "Nhập User ID",
        disabled: isEdit,
      },
      {
        name: "fullName",
        label: "Tên nhân viên",
        type: "input",
        required: true,
        placeholder: "Nhập tên nhân viên",
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "position",
        label: "Chức vụ",
        type: "input",
        required: false,
        placeholder: "Nhập chức vụ",
      },
    ];
    return fields;
  }, [isEdit]);

  const handleSubmit = (values: any) => {
    const submitData = {
      ...values,
    };

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(submitData);
      }
    } else {
      onCreateEmployee(submitData);
    }
  };

  const goBack = () => {
    router.back();
  };

  // Prepare initial values
  const initialValues = useMemo(() => {
    if (!initData) return undefined;

    return {
      ...initData,
      // userId might be needed if displayed or used, though disabled in edit
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
