import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { StallDto } from "@/dto/stall.dto";
import { useDetailStall } from "@/hooks/stall";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailStallScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailStall(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết quán ăn</Title>
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
              <ActionLogView functionType="Stalls" functionId={id || ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: StallDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin quán ăn */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin quán ăn
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
              Mã quán ăn
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.id}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tên quán ăn
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
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
            <Text strong style={{ fontSize: "18px" }}>
              {formatDate(data?.createdDate)}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Danh mục
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.category || "Chưa cập nhật"}
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
              {data?.contact_phone || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Website
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.website || "Chưa có website"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Back button */}
      <Row justify="start" style={{ marginTop: "24px" }}>
        <Button
          type="default"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </Row>
    </div>
  );
};