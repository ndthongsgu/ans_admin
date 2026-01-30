import BaseView from "@/components/base-view/BaseView";
import type { OwnerUpdateDto } from "@/dto/owner.dto";
import { useDetailOwner, useUpdateOwner } from "@/hooks/owner";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Spin } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EditOwnerScreen() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [form] = Form.useForm();
    const { data: owner, isLoading: isLoadingDetail } = useDetailOwner(id!);
    const { onUpdateOwner, isLoading } = useUpdateOwner(id!);

    useEffect(() => {
        if (owner) {
            form.setFieldsValue({
                fullName: owner.fullName,
                phone: owner.phone,
                subscriptionPackageId: owner.subscriptionPackageId,
            });
        }
    }, [owner, form]);

    const handleSubmit = async (values: any) => {
        const payload: OwnerUpdateDto = {
            fullName: values.fullName,
            phone: values.phone,
            subscriptionPackageId: values.subscriptionPackageId,
        };

        await onUpdateOwner(payload);
    };

    if (isLoadingDetail) {
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
                        <span>Chỉnh sửa chủ quán</span>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên chủ quán"
                                name="fullName"
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên chủ quán" },
                                ]}
                            >
                                <Input placeholder="Nhập tên chủ quán" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { pattern: /^[0-9]{10,11}$/, message: "SĐT không hợp lệ" },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Gói đăng ký (ID)"
                                name="subscriptionPackageId"
                            >
                                <Input placeholder="Nhập ID gói đăng ký (tùy chọn)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button onClick={() => router.back()}>Hủy</Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Cập nhật
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </BaseView>
    );
}
