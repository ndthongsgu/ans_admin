import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { CustomerCreateDto, CustomerDto, CustomerUpdateDto } from "@/dto/customer.dto";
import { useCreateCustomer } from "@/hooks/customer";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddCustomerScreen({
  initData,
  title = "Thêm mới khách hàng",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: CustomerDto;
  isEdit?: boolean;
  handleUpdate?: (data: CustomerUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateCustomer } = useCreateCustomer();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
    //   {
    //     name: "code",
    //     label: "Mã khách hàng",
    //     type: "input",
    //     required: true,
    //     placeholder: "Nhập mã khách hàng",
    //   },
      {
        name: "name",
        label: "Tên khách hàng",
        type: "input",
        required: true,
        placeholder: "Nhập tên khách hàng",
      },
      {
        name: "email",
        label: "Email",
        type: "input",
        required: true,
        placeholder: "Nhập email",
        rules: [{ type: "email", message: "Email không đúng định dạng" }],
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
        rules: [{ pattern: /^(0|\+84)\d{9,10}$/, message: "Số điện thoại không hợp lệ" }],
      },
      
    //   {
    //     name: "description",
    //     label: "Mô tả",
    //     type: "textarea",
    //     required: false,
    //     placeholder: "Nhập mô tả",
    //     gridColumn: "1 / -1",
    //   },
    ];

    // Only show password field when creating new customer
    if (!isEdit) {
      fields.splice(4, 0, {
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
        handleUpdate(values as unknown as CustomerUpdateDto);
      }
    } else {
      onCreateCustomer(values as unknown as CustomerCreateDto);
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
