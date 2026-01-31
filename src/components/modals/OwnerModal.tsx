import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import type { OwnerDto, OwnerUpdateDto } from "@/dto/owner.dto";
import { useUpdateOwner } from "@/hooks/owner/useOwners";

interface OwnerModalProps {
    visible: boolean;
    onCancel: () => void;
    ownerData?: OwnerDto | null;
}

export default function OwnerModal({ visible, onCancel, ownerData }: OwnerModalProps) {
    const [form] = Form.useForm();
    const updateOwnerMutation = useUpdateOwner();

    const loading = updateOwnerMutation.isPending;

    useEffect(() => {
        if (visible) {
            if (ownerData) {
                form.setFieldsValue({
                    fullName: ownerData.fullName,
                    phone: ownerData.phone,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, ownerData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (ownerData) {
                const updatePayload: OwnerUpdateDto = {
                    fullName: values.fullName,
                    phone: values.phone,
                };
                await updateOwnerMutation.mutateAsync({ id: ownerData.id, owner: updatePayload });
                onCancel();
            }
        } catch (error) {
            // validation error handled by Form
        }
    };

    return (
        <Modal
            title="Chỉnh sửa chủ quán"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="fullName"
                    label="Tên chủ quán"
                    rules={[{ required: true, message: "Vui lòng nhập tên chủ quán" }]}
                >
                    <Input placeholder="Nhập tên chủ quán" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
