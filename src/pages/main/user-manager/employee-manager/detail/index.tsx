import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { EmployeeDto } from "@/dto/employee.dto";
import type { RoleDto } from "@/dto/role.dto";
import { useDetailEmployee } from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailEmployeeScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailEmployee(id ?? "");
  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết nhân viên</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Employees" functionId={id || ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: EmployeeDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin nhân viên */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin nhân viên
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Họ và tên
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.fullName}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Chức vụ
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.position || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tài khoản (Username)
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.user?.username || "N/A"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Email
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.user?.email || "N/A"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số điện thoại
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.phone || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày thêm vào
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {formatDate(data?.createdDate)}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Action Button */}
      <Row align={"middle"} justify={"center"}>
        <Button
          type="default"
          size="middle"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Thoát
        </Button>
      </Row>
    </div>
  );
};
