import { formatDate } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { SubscriptionPackageDto } from "@/dto/subscriptionPackage.dto";
import { useDetailSubscriptionPackage } from "@/hooks/subscriptionPackage";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailSubscriptionPackageScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailSubscriptionPackage(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết gói đăng ký</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: SubscriptionPackageDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin gói đăng ký
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Mã gói
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.code}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Tên gói
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.name}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Ngày tạo
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.created_at ? formatDate(new Date(data.created_at)) : ""}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Giá
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {new Intl.NumberFormat("vi-VN").format(data?.price || 0)}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Số quầy tối đa
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.max_stalls}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Trạng thái
            </Text>
            <Tag color={data?.is_deleted ? "red" : "green"}>
              {data?.is_deleted ? "Không hoạt động" : "Hoạt động"}
            </Tag>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.description || "Không có"}
            </Text>
          </Col>
        </Row>
      </Card>

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
