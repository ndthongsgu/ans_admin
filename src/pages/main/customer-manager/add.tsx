import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Row, Col, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCreateCustomer } from "@/hooks/customer/useCustomers";
import type { CustomerCreateDto } from "@/dto/customer.dto";

export default function AddCustomerScreen() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const createCustomerMutation = useCreateCustomer();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload: CustomerCreateDto = {
                code: values.code,
                name: values.name,
                email: values.email,
                phone: values.phone,
                description: values.description,
            };
            await createCustomerMutation.mutateAsync(payload);
            navigate("/customer-manager");
        } catch (error) {
            // validation error
        }
    };

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
                <h2 style={{ marginTop: "10px" }}>Thêm khách hàng mới</h2>
            </div>

            <Card style={{ maxWidth: "600px" }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Mã khách hàng"
                        rules={[{ required: true, message: "Vui lòng nhập mã khách hàng" }]}
                    >
                        <Input placeholder="VD: CUS001" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Tên khách hàng"
                        rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại phải từ 10-11 chữ số" },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea placeholder="Nhập mô tả" rows={4} />
                    </Form.Item>

                    <Row gutter={16} justify="end">
                        <Col>
                            <Button onClick={() => navigate("/customer-manager")}>Hủy</Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                loading={createCustomerMutation.isPending}
                                onClick={handleSubmit}
                            >
                                Tạo khách hàng
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}
