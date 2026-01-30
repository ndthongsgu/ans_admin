import { useEffect } from "react";
import { Modal, Form, Input, Switch, Button, message } from "antd";
import type { UserDto, UserCreateDto, UserUpdateDto } from "@/dto/user.dto";
import { useCreateUser, useUpdateUser } from "@/hooks/user/useUsers";

interface UserModalProps {
    visible: boolean;
    onCancel: () => void;
    userData?: UserDto | null;
}

export default function UserModal({ visible, onCancel, userData }: UserModalProps) {
    const [form] = Form.useForm();
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();

    const isEdit = !!userData;
    const loading = createUserMutation.isPending || updateUserMutation.isPending;

    useEffect(() => {
        if (visible) {
            if (userData) {
                form.setFieldsValue({
                    username: userData.username,
                    email: userData.email,
                    isActive: userData.isActive,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ isActive: true });
            }
        }
    }, [visible, userData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (isEdit && userData) {
                const updatePayload: UserUpdateDto = {
                    email: values.email,
                    isActive: values.isActive,
                    ...(values.password ? { password: values.password } : {}),
                };
                await updateUserMutation.mutateAsync({ id: userData.id, user: updatePayload as any }); // Cast needed due to types mismatch in hooks if not updated
            } else {
                const createPayload: UserCreateDto = {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    isActive: values.isActive,
                };
                await createUserMutation.mutateAsync(createPayload as any);
            }
            onCancel();
        } catch (error) {
            // console.error("Validate Failed:", error);
        }
    };

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
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
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: "Vui lòng nhập Username" }]}
                >
                    <Input disabled={isEdit} placeholder="Nhập username" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Vui lòng nhập Email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={isEdit ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
                    rules={[{ required: !isEdit, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
