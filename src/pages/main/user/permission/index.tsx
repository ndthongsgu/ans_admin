import {
  Card,
  Select,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Checkbox,
  message,
} from "antd";
import { useEffect, useState } from "react";
import BaseView from "@/components/base-view/BaseView";
import Title from "@/components/title";
import { useDetailRole, useUpdateRole, useSelectBoxRoles } from "@/hooks/role";
import { useGetAllPermission } from "@/hooks/permission";

const { Text } = Typography;

export default function PermissionManagement() {
  const { data: permissionModules, isLoading: modulesLoading } =
    useGetAllPermission();

  if (modulesLoading) {
    return (
      <BaseView>
        <Title>Quản lý phân quyền</Title>
        <Card>
          <Text>Đang tải dữ liệu quyền...</Text>
        </Card>
      </BaseView>
    );
  }

  if (!permissionModules || permissionModules.length === 0) {
    return (
      <BaseView>
        <Title>Quản lý phân quyền</Title>
        <Card>
          <Text type="danger">
            Không tìm thấy dữ liệu quyền. Vui lòng kiểm tra lại.
          </Text>
        </Card>
      </BaseView>
    );
  }

  return (
    <BaseView>
      <Title>Quản lý phân quyền</Title>
      <PermissionsByRoleTab modules={permissionModules} />
    </BaseView>
  );
}

// Tab 1: Permissions by Role
function PermissionsByRoleTab({ modules }: { modules: any[] }) {
  const { data: roles } = useSelectBoxRoles();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Find selected role
  const { data: role, refetch: refetchRole } = useDetailRole(
    selectedRoleId || "",
  );
  const { onUpdateRole } = useUpdateRole(selectedRoleId || "");

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      // Calculate rolePermissions when role changes
      const perms = role?.permissions
        ? typeof role.permissions === "string"
          ? (() => {
              try {
                const parsed = JSON.parse(role.permissions);
                return Array.isArray(parsed)
                  ? parsed
                  : Object.keys(parsed).filter(
                      (key) => parsed[key as keyof typeof parsed],
                    );
              } catch {
                return role.permissions.split(",").map((p) => p.trim());
              }
            })()
          : Array.isArray(role.permissions)
            ? role.permissions
            : Object.keys(role.permissions || {}).filter(
                (key) => (role.permissions as Record<string, any>)?.[key],
              )
        : [];

      setSelectedPermissions(perms);
      setEditMode(false);
    }
  }, [role?.id]);

  const handlePermissionChange = (permCode: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permCode]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permCode));
    }
  };

  const handleModuleSelectAll = (
    module: (typeof modules)[0],
    checked: boolean,
  ) => {
    const moduleCodes = module.permissions.map((p: any) => p.code);
    if (checked) {
      setSelectedPermissions([
        ...new Set([...selectedPermissions, ...moduleCodes]),
      ]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((p) => !moduleCodes.includes(p)),
      );
    }
  };

  const handleSave = async () => {
    if (!role) return;

    setIsSaving(true);
    try {
      await onUpdateRole({
        code: role.code,
        name: role.name,
        description: role.description || "",
        permissions: JSON.stringify(selectedPermissions),
      });

      // Refetch roles to get updated data
      await refetchRole();

      message.success(`Cập nhật quyền cho vai trò "${role.name}" thành công!`);
      setEditMode(false);
    } catch (error) {
      message.error("Cập nhật quyền thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = () => {
    if (editMode) {
      handleSave();
    } else {
      setEditMode(true);
    }
  };

  const roleOptions =
    roles?.map((item: any) => ({
      label: `${item.name} (${item.code})`,
      value: item.id,
    })) || [];

  return (
    <div style={{ padding: "16px 0" }}>
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={24}>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Chọn vai trò để quản lý quyền
            </Text>
            <Select
              placeholder="Chọn vai trò"
              style={{ width: "100%", maxWidth: "400px" }}
              value={selectedRoleId}
              onChange={setSelectedRoleId}
              options={roleOptions}
              optionLabelProp="label"
            />
          </Col>
        </Row>
      </Card>

      {role && (
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {role.name} <Tag color="blue">{role.code}</Tag>
              </span>
              <Button
                type={editMode ? "default" : "primary"}
                onClick={handleEditClick}
                loading={isSaving}
                disabled={!modules || modules.length === 0}
              >
                {editMode ? "Lưu" : "Chỉnh sửa quyền"}
              </Button>
            </div>
          }
          style={{ marginBottom: "24px" }}
        >
          {editMode ? (
            // Edit mode
            <div>
              <Text>Chọn các quyền cần cấp cho vai trò "{role.name}":</Text>
              <div style={{ marginTop: "16px" }}>
                <Row gutter={[16, 16]}>
                  {modules.map((module) => {
                    const modulePermissions = module.permissions.map(
                      (p: any) => p.code,
                    );
                    const allSelected = modulePermissions.every((p: string) =>
                      selectedPermissions.includes(p),
                    );
                    const someSelected = modulePermissions.some((p: string) =>
                      selectedPermissions.includes(p),
                    );

                    return (
                      <Col span={12} key={module.module}>
                        <Card
                          size="small"
                          style={{
                            backgroundColor: someSelected
                              ? "#f0f5ff"
                              : "#fafafa",
                          }}
                        >
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Checkbox
                              checked={allSelected}
                              indeterminate={someSelected && !allSelected}
                              onChange={(e) =>
                                handleModuleSelectAll(module, e.target.checked)
                              }
                              style={{ fontWeight: "bold" }}
                            >
                              {module.label}
                            </Checkbox>
                            <div style={{ paddingLeft: "24px" }}>
                              <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                              >
                                {module.permissions.map((perm: any) => (
                                  <Checkbox
                                    key={perm.code}
                                    checked={selectedPermissions.includes(
                                      perm.code,
                                    )}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        perm.code,
                                        e.target.checked,
                                      )
                                    }
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
              </div>
            </div>
          ) : (
            // View mode
            <div>
              <Row gutter={[16, 16]}>
                {modules.map((module) => {
                  const modulePerms = module.permissions.filter((p: any) =>
                    selectedPermissions.includes(p.code),
                  );

                  if (modulePerms.length === 0) return null;

                  return (
                    <Col span={12} key={module.module}>
                      <Card size="small" style={{ backgroundColor: "#f0f5ff" }}>
                        <Text strong>{module.label}</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Space wrap>
                            {modulePerms.map((perm: any) => (
                              <Tag key={perm.code} color="blue">
                                {perm.label}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
              {selectedPermissions.length === 0 && (
                <Text type="secondary">
                  Vai trò này chưa được cấp quyền. Nhấn "Chỉnh sửa quyền" để
                  thêm quyền.
                </Text>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
