import BaseView from "@/components/base-view/BaseView";
import { useDetailOwner } from "@/hooks/owner";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Row, Spin, Tag } from "antd";
import { useParams } from "react-router-dom";

export default function DetailOwnerScreen() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: owner, isLoading } = useDetailOwner(id!);

    if (isLoading) {
        return (
            <BaseView>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            </BaseView>
        );
    }

    if (!owner) {
        return (
            <BaseView>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <p>Không tìm thấy thông tin chủ quán</p>
                </div>
            </BaseView>
        );
    }

    return (
        <BaseView>
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            type="text"
                        />
                        <span>Chi tiết chủ quán</span>
                    </div>
                }
                extra={
                    <Button
                        type="primary"
                        onClick={() => router.push(`/owner-manager/edit/${id}`)}
                    >
                        Chỉnh sửa
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Tên chủ quán" span={2}>
                                {owner.fullName}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số điện thoại">
                                {owner.phone || "Chưa cập nhật"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Tag color={owner.isDeleted ? "red" : "green"}>
                                    {owner.isDeleted ? "Không hoạt động" : "Hoạt động"}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Username">
                                {owner.user?.username || "N/A"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Email">
                                {owner.user?.email || "N/A"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Gói đăng ký" span={2}>
                                {owner.subscriptionPackageName || "Chưa đăng ký gói"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày tạo" span={2}>
                                {owner.createdDate
                                    ? new Date(owner.createdDate).toLocaleString("vi-VN")
                                    : "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>
        </BaseView>
    );
}
