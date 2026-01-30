import BaseView from "@/components/base-view/BaseView";
import FormCustom, { type FormField } from "@/components/form-custom";
import type { RoleCreateUpdateDto, RolePermissionCreateDto } from "@/dto/role.dto";
import { useCreateRole } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { Card, Checkbox, Col, Row, Table, Typography } from "antd";
import { useMemo, useState } from "react";

const { Text } = Typography;

const MODULES = [
  "DASHBOARD",
  "USER",
  "CUSTOMER",
  "OWNER",
  "EMPLOYEE",
  "ROLE",
];

const PERMISSIONS = [
  { key: "isCanRead", label: "Xem" },
  { key: "isCanCreate", label: "Thêm" },
  { key: "isCanUpdate", label: "Sửa" },
  { key: "isCanDelete", label: "Xóa" },
  { key: "isCanImport", label: "Import" },
  { key: "isCanExport", label: "Export" },
];

export default function AddRoleScreen({
  initData,
  title = "Thêm mới vai trò",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: any;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const router = useRouter();
  const { onCreateRole, isLoading } = useCreateRole();

  // Initialize permissions state
  const [permissions, setPermissions] = useState<RolePermissionCreateDto[]>(
    initData?.permissions || MODULES.map((module) => ({
      module,
      isCanRead: false,
      isCanCreate: false,
      isCanUpdate: false,
      isCanDelete: false,
      isCanActivate: false,
      isCanDeactivate: false,
      isCanExport: false,
      isCanImport: false,
    }))
  );

  const formFields: FormField[] = useMemo(
    () => [
      {
        name: "code",
        label: "Mã vai trò",
        type: "input",
        required: true,
        placeholder: "Nhập mã vai trò",
        disabled: isEdit,
      },
      {
        name: "name",
        label: "Tên vai trò",
        type: "input",
        required: true,
        placeholder: "Nhập tên vai trò",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
        gridColumn: "1 / -1",
      },
    ],
    [isEdit]
  );

  const handlePermissionChange = (module: string, key: string, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => (p.module === module ? { ...p, [key]: checked } : p))
    );
  };

  const permissionColumns = [
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    ...PERMISSIONS.map((perm) => ({
      title: perm.label,
      dataIndex: perm.key,
      key: perm.key,
      render: (checked: boolean, record: RolePermissionCreateDto) => (
        <Checkbox
          checked={checked}
          onChange={(e) =>
            handlePermissionChange(record.module, perm.key, e.target.checked)
          }
        />
      ),
    })),
  ];

  const handleSubmit = (values: any) => {
    const payload: RoleCreateUpdateDto = {
      ...values,
      permissions: permissions, // Backend needs to handle list of permissions
    };

    if (isEdit && handleUpdate) {
      handleUpdate(payload);
    } else {
      onCreateRole(payload);
    }
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        initialValues={initData}
        onCancel={() => router.back()}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns="repeat(2, 1fr)"
      />

      <Card title="Phân quyền chi tiết" style={{ marginTop: "24px" }}>
        <Table
          dataSource={permissions}
          columns={permissionColumns}
          pagination={false}
          rowKey="module"
          bordered
        />
      </Card>
    </BaseView>
  );
}
