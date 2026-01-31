import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Row, Col, Card, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCustomer, useUpdateCustomer } from "@/hooks/customer/useCustomers";
import type { CustomerUpdateDto } from "@/dto/customer.dto";
import { useEffect } from "react";

export default function EditCustomerScreen() {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { data: customer, isLoading: isLoadingCustomer } = useCustomer(id || "");
    const updateCustomerMutation = useUpdateCustomer();

    useEffect(() => {
        if (customer) {
            form.setFieldsValue({
                code: customer.code,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                description: customer.description,
            });
        }
    }, [customer, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload: CustomerUpdateDto = {
                code: values.code,
                name: values.name,
                email: values.email,
                phone: values.phone,
                description: values.description,
            };
            if (customer) {
                await updateCustomerMutation.mutateAsync({ id: customer.id, customer: payload });
                navigate("/customer-manager");
            }
        } catch (error) {
            // validation error
        }
    };

    if (isLoadingCustomer) {
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
                <h2 style={{ marginTop: "10px" }}>Chỉnh sửa khách hàng: {customer.name}</h2>
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
                                loading={updateCustomerMutation.isPending}
                                onClick={handleSubmit}
                            >
                                Cập nhật khách hàng
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}
