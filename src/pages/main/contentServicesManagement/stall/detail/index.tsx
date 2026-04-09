import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { StallDto } from "@/dto/stall.dto";
import { useDetailStall } from "@/hooks/stall";
import { useRouter } from "@/routes/hooks";
import { LANGUAGE_MAP } from "@/common/constants/language";
import { DownloadOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Table, Tabs, Tag, Typography, Image } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
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
            label: "Bản dịch",
            key: "2",
            children: data ? <TranslationsView data={data} /> : <Loading />,
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: StallDto }) => {
  const router = useRouter();

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const downloadQRCode = async () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${data.id}.png`;
      link.click();
    }
  };

  useEffect(() => {
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

    generateQRCode();
  }, [data?.id]);

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Image Section */}
      {data?.cover_image && (
        <Card
          title={
            <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
              Ảnh bìa quán ăn
            </Text>
          }
          style={{ marginBottom: "24px" }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col span={12}>
              <Image
                src={data.cover_image}
                alt="Stall cover"
                style={{ maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
                preview
              />
            </Col>
          </Row>
        </Card>
      )}

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
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Tên quán ăn
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.name}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Chủ quán
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.owner?.full_name || data?.owner_id || "N/A"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Vĩ độ
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.latitude}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Kinh độ
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.longitude}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Bán kính (m)
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.radius ?? "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Danh mục
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.category || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Khoảng giá
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.price_range || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Số điện thoại
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.contact_phone || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Website
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.website || "Chưa có website"}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Giờ mở cửa
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.opening_hours || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Giờ đóng cửa
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.close_hours || "Chưa cập nhật"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Đánh giá trung bình
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.average_rating ?? 0} / 5
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", color: "#06498B" }}>
              Tổng lượt đánh giá
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data?.total_reviews ?? 0}
            </Text>
          </Col>
          {data?.id && (
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

const TranslationsView = ({ data }: { data: StallDto }) => {
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
      title: "Tên quán ăn",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 200,
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
