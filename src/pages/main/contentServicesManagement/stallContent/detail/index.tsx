import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { StallContentDto } from "@/dto/stallContent.dto";
import { useDetailStallContent } from "@/hooks/stallContent";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailStallContentScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailStallContent(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết nội dung thuyết minh</Title>
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
            children: <ActionLogView functionType="StallContents" functionId={id || ""} />,
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: StallContentDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin nội dung thuyết minh */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin nội dung thuyết minh
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Tiêu đề
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.title}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Quán ăn
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.stall?.name || "N/A"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Ngôn ngữ
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.language_code || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.description || "Chưa có mô tả"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Mô tả ngắn
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.short_description || "Chưa có"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              URL Audio
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.audio_url ? (
                <a href={data.audio_url} target="_blank" rel="noopener noreferrer">
                  Nghe
                </a>
              ) : (
                "Chưa có"
              )}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Thời lượng (giây)
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.audio_duration ?? "N/A"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Kích thước file (byte)
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.audio_file_size ?? "N/A"}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Script TTS
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.tts_script || "Chưa có script"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Ngày thêm vào
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.created_at ? formatDate(new Date(data.created_at * 1000)) : "N/A"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Cập nhật lần cuối
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.updated_at ? formatDate(new Date(data.updated_at * 1000)) : "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Trạng thái
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.is_deleted ? "Đã xóa" : "Hoạt động"}
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
