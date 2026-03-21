import { formatDate } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { StallContentDto } from "@/dto/stallContent.dto";
import { useDetailStallContent } from "@/hooks/stallContent";
import { useRouter } from "@/routes/hooks";
import { LANGUAGE_MAP } from "@/common/constants/language";
import { LeftCircleOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Table, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import { useRef } from "react";
import React from "react";

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
            label: "Bản dịch",
            key: "2",
            children: data ? <TranslationsView data={data} /> : <Loading />,
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: StallContentDto }) => {
  const router = useRouter();
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateQRCode = async () => {
    if (qrCanvasRef.current && data?.id) {
      try {
        await QRCode.toCanvas(qrCanvasRef.current, data.id, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200,
        });
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    }
  };

  const downloadQRCode = async () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${data.id}.png`;
      link.click();
    }
  };

  React.useEffect(() => {
    generateQRCode();
  }, [data?.id]);

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
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Audio
            </Text>
            {data?.audio_url ? (
              <audio controls style={{ width: "100%", marginTop: "8px" }}>
                <source src={`http://127.0.0.1:8000${data.audio_url}`} type="audio/mpeg" />
                Trình duyệt của bạn không hỗ trợ phát audio.
              </audio>
            ) : (
              <Text strong style={{ fontSize: "16px" }}>
                Chưa có
              </Text>
            )}
          </Col>
          s{" "}
          <Col span={24} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Script TTS
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.tts_script || "Chưa có script"}
            </Text>
          </Col>
          {data?.tts_script && (
            <Col span={24} style={{ padding: "20px" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "14px",
                  display: "block",
                  color: "#06498B",
                  marginBottom: "12px",
                }}
              >
                QR Code
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <canvas
                  ref={qrCanvasRef}
                  style={{ border: "1px solid #ddd", borderRadius: "4px" }}
                />
                <Button type="primary" icon={<DownloadOutlined />} onClick={() => downloadQRCode()}>
                  Tải QR Code
                </Button>
              </div>
            </Col>
          )}
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

const TranslationsView = ({ data }: { data: StallContentDto }) => {
  const router = useRouter();

  const columns = [
    {
      title: "Ngôn ngữ",
      dataIndex: "language_code",
      key: "language_code",
      width: 150,
      render: (lang: string) => (
        <Tag color={lang === "vi" ? "blue" : "default"}>{LANGUAGE_MAP[lang] || lang}</Tag>
      ),
    },
    {
      title: "Audio",
      dataIndex: "audio_url",
      key: "audio_url",
      width: 250,
      render: (url: string) => (
        <audio controls style={{ width: "100%", marginTop: "8px" }}>
          <source src={`http://127.0.0.1:8000${url}`} type="audio/mpeg" />
          Trình duyệt của bạn không hỗ trợ phát audio.
        </audio>
      ),
    },
    {
      title: "TTS Script",
      dataIndex: "tts_script",
      key: "tts_script",
      width: 300,
      ellipsis: true,
      render: (text: string) => text || "Chưa cập nhật",
    },
  ];

  return (
    <div style={{ padding: "16px 0" }}>
      <Card
        title={
          <Text strong style={{ fontSize: "16px", color: "#06498B" }}>
            Bản dịch theo ngôn ngữ
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Table
          columns={columns}
          dataSource={data?.translations || []}
          rowKey="language_code"
          pagination={false}
          bordered
        />
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
