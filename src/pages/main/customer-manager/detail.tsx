import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Descriptions, Spin } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useCustomer } from "@/hooks/customer/useCustomers";

export default function DetailCustomerScreen() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: customer, isLoading } = useCustomer(id || "");

    if (isLoading) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div style={{ padding: "24px" }}>
                <p>Không tìm thấy khách hàng</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/customer-manager")}
                >
                    Quay lại
                </Button>
            </div>

            <Card
                title={`Chi tiết khách hàng: ${customer.name}`}
                extra={
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/customer-manager/edit/${id}`)}
                    >
                        Chỉnh sửa
                    </Button>
                }
            >
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã khách hàng" span={1}>
                        {customer.code}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên khách hàng" span={1}>
                        {customer.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={1}>
                        {customer.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại" span={1}>
                        {customer.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả" span={2}>
                        {customer.description || "N/A"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}
