import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import type { CustomerDto, CustomerCreateDto, CustomerUpdateDto } from "@/dto/customer.dto";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/customer/useCustomers";

interface CustomerModalProps {
    visible: boolean;
    onCancel: () => void;
    customerData?: CustomerDto | null;
}

export default function CustomerModal({ visible, onCancel, customerData }: CustomerModalProps) {
    const [form] = Form.useForm();
    const createCustomerMutation = useCreateCustomer();
    const updateCustomerMutation = useUpdateCustomer();

    const isEdit = !!customerData;
    const loading = createCustomerMutation.isPending || updateCustomerMutation.isPending;

    useEffect(() => {
        if (visible) {
            if (customerData) {
                form.setFieldsValue({
                    code: customerData.code,
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    description: customerData.description,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, customerData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (isEdit && customerData) {
                const updatePayload: CustomerUpdateDto = {
                    code: values.code,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    description: values.description,
                };
                await updateCustomerMutation.mutateAsync({ id: customerData.id, customer: updatePayload });
            } else {
                const createPayload: CustomerCreateDto = {
                    code: values.code,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    description: values.description,
                };
                await createCustomerMutation.mutateAsync(createPayload);
            }
            onCancel();
        } catch (error) {
            // validation error handled by Form
        }
    };

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    {isEdit ? "Cập nhật" : "Tạo mới"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="code"
                    label="Mã khách hàng"
                    rules={[{ required: true, message: "Vui lòng nhập mã khách hàng" }]}
                >
                    <Input placeholder="Nhập mã khách hàng" />
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
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea placeholder="Nhập mô tả" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
