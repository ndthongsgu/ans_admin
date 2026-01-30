import BaseView from "@/components/base-view/BaseView";
import Title from "@/components/title";
import { ROUTES } from "@/common/constants/routes";
import { useAreas } from "@/hooks/area";
import { useCreateStall } from "@/hooks/stall/index";
import { Button, Card, Form, Input, InputNumber, Select, Switch, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "@/hooks/auth/useUserInfo";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function AddStallScreen() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const createMutation = useCreateStall();
    const { data: areas, isLoading: loadingAreas } = useAreas();
    const userInfo = useUserInfo();

    const onFinish = (values: any) => {
        const ownerId = (userInfo as any)?.owner?.id;

        if (!ownerId && (userInfo as any)?.isAdmin !== true) {
            message.error("Không tìm thấy thông tin chủ quán. Vui lòng đăng nhập lại.");
            return;
        }

        const payload = {
            ...values,
            owner_id: ownerId || "admin-create-placeholder",
            status: values.status ?? true,
            cover_image: values.cover_image || "",
        };

        createMutation.mutate(payload, {
            onSuccess: () => {
                message.success("Thêm quán thành công");
                navigate(ROUTES.MAIN.STALL_MANAGER.path);
            },
            onError: (error: any) => {
                message.error(error?.message || "Thêm quán thất bại");
            },
        });
    };

    return (
        <BaseView>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(ROUTES.MAIN.STALL_MANAGER.path)}
                    style={{ marginRight: 16 }}
                >
                    Quay lại
                </Button>
                <div style={{ flex: 1 }}>
                    <Title>Thêm quán mới</Title>
                </div>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ status: true, radius: 15 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item
                            name="name"
                            label="Tên quán"
                            rules={[{ required: true, message: "Vui lòng nhập tên quán" }]}
                        >
                            <Input placeholder="Nhập tên quán" />
                        </Form.Item>

                        <Form.Item
                            name="area_id"
                            label="Khu vực"
                            rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
                        >
                            <Select
                                placeholder="Chọn khu vực"
                                loading={loadingAreas}
                                options={areas?.map((area) => ({ label: area.name, value: area.id }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="latitude"
                            label="Vĩ độ (Latitude)"
                            rules={[{ required: true, message: "Nhập vĩ độ" }]}
                        >
                            <InputNumber style={{ width: "100%" }} step="0.000001" />
                        </Form.Item>

                        <Form.Item
                            name="longitude"
                            label="Kinh độ (Longitude)"
                            rules={[{ required: true, message: "Nhập kinh độ" }]}
                        >
                            <InputNumber style={{ width: "100%" }} step="0.000001" />
                        </Form.Item>

                        <Form.Item
                            name="radius"
                            label="Bán kính (m)"
                        >
                            <InputNumber style={{ width: "100%" }} min={1} />
                        </Form.Item>

                        <Form.Item
                            name="cover_image"
                            label="Link ảnh bìa"
                        >
                            <Input placeholder="URL hình ảnh" />
                        </Form.Item>

                        <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                        <Button onClick={() => navigate(ROUTES.MAIN.STALL_MANAGER.path)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                            Thêm mới
                        </Button>
                    </div>
                </Form>
            </Card>
        </BaseView>
    );
}
