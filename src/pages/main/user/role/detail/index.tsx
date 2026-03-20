import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { RoleDto } from "@/dto/role.dto";
import { useDetailRole } from "@/hooks/role";
import { useGetAllPermission } from "@/hooks/permission";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Typography, Tag, Space } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailRoleScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailRole(id ?? "");
  const { data: permissionModules } = useGetAllPermission();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết vai trò</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: data ? <DetailView data={data} id={id || ""} permissionModules={permissionModules} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Roles" functionId={id || ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data, id, permissionModules }: { data: RoleDto; id: string; permissionModules: any[] }) => {
  const router = useRouter();

  const selectedPermissions = data?.permissions
    ? Array.isArray(data.permissions)
      ? data.permissions
      : typeof data.permissions === "string"
      ? data.permissions.split(",")
      : []
    : [];

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin vai trò */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin vai trò
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mã vai trò
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.code}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tên vai trò
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.name}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày thêm vào
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {formatDate(data?.createdDate)}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.description || "Chưa có mô tả"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* II. Phân quyền */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            II. Phân quyền
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[16, 16]}>
          {permissionModules.map((module) => {
            const modulePerms = module.permissions.filter((p: any) =>
              selectedPermissions.includes(p.code)
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
          <Text type="secondary">Chưa cấp quyền cho vai trò này</Text>
        )}
      </Card>

      {/* Back button */}
      <Row justify="space-between" style={{ marginTop: "24px" }}>
        <Button
          type="default"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/user/role/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Row>
    </div>
  );
};