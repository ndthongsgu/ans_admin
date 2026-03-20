import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { SubscriptionPackageDto } from "@/dto/subscriptionPackage.dto";
import { useDetailSubscriptionPackage } from "@/hooks/subscriptionPackage";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Typography } from "antd";
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
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: <ActionLogView functionType="SubscriptionPackages" functionId={id || ""} />,
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
      {/* I. Thông tin gói đăng ký */}
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
              {data?.id}
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
              Ngày thêm vào
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {formatDate(data?.createdDate)}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Giá
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.price || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Thời hạn (ngày)
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.duration || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.description || "Chưa có mô tả"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Back button */}
      <Row justify="start" style={{ marginTop: "24px" }}>
        <Button type="default" icon={<LeftCircleOutlined />} onClick={() => router.back()}>
          Quay lại
        </Button>
      </Row>
    </div>
  );
};
