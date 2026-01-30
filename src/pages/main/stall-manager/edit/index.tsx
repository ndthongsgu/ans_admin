import BaseView from "@/components/base-view/BaseView";
import Title from "@/components/title";
import { ROUTES } from "@/common/constants/routes";
import { useAreas } from "@/hooks/area";
import { useStall, useUpdateStall } from "@/hooks/stall/index";
import { Button, Card, Form, Input, InputNumber, Select, Switch, message, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function EditStallScreen() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const { data: stall, isLoading: loadingStall } = useStall(id || "");
    const { data: areas, isLoading: loadingAreas } = useAreas();
    const updateMutation = useUpdateStall();

    useEffect(() => {
        if (stall) {
            form.setFieldsValue({
                name: stall.name,
                area_id: (stall as any).area_id,
                latitude: stall.latitude,
                longitude: stall.longitude,
                radius: stall.radius,
                cover_image: (stall as any).cover_image,
                status: stall.status,
            });
        }
    }, [stall, form]);

    const onFinish = (values: any) => {
        if (!id) return;

        const payload = {
            name: values.name,
            area_id: values.area_id,
            latitude: values.latitude,
            longitude: values.longitude,
            radius: values.radius,
            cover_image: values.cover_image,
            status: values.status,
        };

        updateMutation.mutate({ id, data: payload }, {
            onSuccess: () => {
                message.success("Cập nhật quán thành công");
                navigate(ROUTES.MAIN.STALL_MANAGER.path);
            },
            onError: (error: any) => {
                message.error(error?.message || "Cập nhật quán thất bại");
            },
        });
    };

    if (loadingStall) {
        return <div className="flex justify-center p-8"><Spin /></div>;
    }

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
                    <Title>Chỉnh sửa quán</Title>
                </div>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
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
                            label="Vĩ độ"
                            rules={[{ required: true, message: "Nhập vĩ độ" }]}
                        >
                            <InputNumber style={{ width: "100%" }} step="0.000001" />
                        </Form.Item>

                        <Form.Item
                            name="longitude"
                            label="Kinh độ"
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
                        <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Card>
        </BaseView>
    );
}
