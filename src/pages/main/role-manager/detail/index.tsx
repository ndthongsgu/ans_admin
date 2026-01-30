import { formatDate } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { RoleDto, RolePermissionCreateDto } from "@/dto/role.dto";
import { useRoleDetail } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Row, Table, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const PERMISSIONS = [
  { key: "isCanRead", label: "Xem" },
  { key: "isCanCreate", label: "Thêm" },
  { key: "isCanUpdate", label: "Sửa" },
  { key: "isCanDelete", label: "Xóa" },
  { key: "isCanImport", label: "Import" },
  { key: "isCanExport", label: "Export" },
];

export default function DetailRoleScreen() {
  const { id } = useParams();
  const { data, isLoading } = useRoleDetail(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

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
      render: (checked: boolean) => <Checkbox checked={checked} disabled />,
    })),
  ];

  return (
    <BaseView isLoading={isLoading}>
      <Title>Chi tiết vai trò</Title>

      <Card title="Thông tin chung" style={{ marginBottom: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Text type="secondary" style={{ display: "block" }}>Mã vai trò</Text>
            <Text strong>{data?.code}</Text>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ display: "block" }}>Tên vai trò</Text>
            <Text strong>{data?.name}</Text>
          </Col>
          <Col span={24}>
            <Text type="secondary" style={{ display: "block" }}>Mô tả</Text>
            <Text strong>{data?.description || "Không có"}</Text>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ display: "block" }}>Ngày tạo</Text>
            <Text strong>{formatDate(data?.createdDate)}</Text>
          </Col>
        </Row>
      </Card>

      <Card title="Phân quyền">
        <Table
          dataSource={(data as any)?.permissions || []} // Cast if types don't match perfectly yet
          columns={permissionColumns}
          pagination={false}
          rowKey="module"
          bordered
        />
      </Card>

      <Row align={"middle"} justify={"center"} style={{ marginTop: "24px" }}>
        <Button
          type="default"
          size="middle"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Thoát
        </Button>
      </Row>
    </BaseView>
  );
}
