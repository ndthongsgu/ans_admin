import BaseView from "@/components/base-view/BaseView";
import { Card, Checkbox, Col, Button, Row, Input, Space, message } from "antd";
import type { RoleCreateUpdateDto, RoleDto } from "@/dto/role.dto";
import { useCreateRole, useUpdateRole } from "@/hooks/role";
import { useGetAllPermission } from "@/hooks/permission";
import { useRouter } from "@/routes/hooks";
import { useState } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";

export default function AddRoleScreen({
  initData,
  title = "Thêm mới vai trò",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: RoleDto;
  isEdit?: boolean;
  handleUpdate?: (data: RoleCreateUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const router = useRouter();
  const { data: permissionModules } = useGetAllPermission();
  const { isLoading: isCreating, onCreateRole } = useCreateRole();
  const updateHook = isEdit && initData ? useUpdateRole(initData.id) : null;
  const { onUpdateRole: updateFunc, isLoading: isUpdatingLoading } = updateHook || {};

  const [code, setCode] = useState(initData?.code || "");
  const [name, setName] = useState(initData?.name || "");
  const [description, setDescription] = useState(initData?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initData?.permissions
      ? Array.isArray(initData.permissions)
        ? initData.permissions
        : typeof initData.permissions === "string"
          ? initData.permissions.split(",")
          : []
      : []
  );

  const handlePermissionChange = (permCode: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permCode]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permCode));
    }
  };

  const handleModuleSelectAll = (module: (typeof permissionModules)[0], checked: boolean) => {
    const moduleCodes = module.permissions.map((p: any) => p.code);
    if (checked) {
      setSelectedPermissions([...new Set([...selectedPermissions, ...moduleCodes])]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => !moduleCodes.includes(p)));
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim()) {
      message.error("Vui lòng nhập mã vai trò và tên vai trò");
      return;
    }

    const data: RoleCreateUpdateDto = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      permissions: selectedPermissions.length > 0 ? selectedPermissions : undefined,
    };

    try {
      if (isEdit) {
        if (handleUpdate) {
          handleUpdate(data);
        } else if (initData?.id && updateFunc) {
          await updateFunc(data);
        }
      } else {
        await onCreateRole(data);
      }
    } catch (error) {
      message.error("Lỗi khi lưu vai trò");
    }
  };

  const isLoading = isCreating || isUpdatingLoading || isLoadingUpdate;

  return (
    <BaseView isLoading={isLoading}>
      <div style={{ padding: "24px" }}>
        <h2>{title}</h2>

        <Card style={{ marginBottom: "24px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Basic Info */}
            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                Mã vai trò
              </label>
              <Input
                placeholder="Nhập mã vai trò (VD: ADMIN, USER, STAFF)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isEdit && !!initData}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                Tên vai trò
              </label>
              <Input
                placeholder="Nhập tên vai trò"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                Mô tả
              </label>
              <Input.TextArea
                placeholder="Nhập mô tả vai trò"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </Space>
        </Card>

        {/* Permissions */}
        <Card title="Phân quyền" style={{ marginBottom: "24px" }}>
          <Row gutter={[24, 24]}>
            {permissionModules.map((module: any) => {
              const modulePermissions = module.permissions.map((p: any) => p.code);
              const allSelected = modulePermissions.every((p: any) =>
                selectedPermissions.includes(p)
              );
              const someSelected = modulePermissions.some((p: any) =>
                selectedPermissions.includes(p)
              );

              return (
                <Col span={12} key={module.module}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: someSelected ? "#f0f5ff" : "#fafafa",
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={(e) => handleModuleSelectAll(module, e.target.checked)}
                        style={{ fontWeight: "bold" }}
                      >
                        {module.label}
                      </Checkbox>
                      <div style={{ paddingLeft: "24px" }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          {module.permissions.map((perm: any) => (
                            <Checkbox
                              key={perm.code}
                              checked={selectedPermissions.includes(perm.code)}
                              onChange={(e) => handlePermissionChange(perm.code, e.target.checked)}
                            >
                              {perm.label}
                            </Checkbox>
                          ))}
                        </Space>
                      </div>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>

        {/* Actions */}
        <Row justify="space-between">
          <Button icon={<LeftCircleOutlined />} onClick={() => router.back()}>
            Quay lại
          </Button>
          <Button
            type="primary"
            loading={isLoading}
            onClick={handleSubmit}
            style={{ paddingLeft: "48px", paddingRight: "48px" }}
          >
            Lưu
          </Button>
        </Row>
      </div>
    </BaseView>
  );
}
