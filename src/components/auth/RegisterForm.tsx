import { Button, Form, Input, App } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axios"; // Giả định bạn dùng axiosInstance

export default function RegisterForm() {
    const navigate = useNavigate();
    const { message } = App.useApp();

    const onFinish = async (values: any) => {
        try {
            await axiosInstance.post("/api/auth/register", values);
            message.success("Đăng ký thành công! Đang chuyển hướng...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error: any) {
            message.error(error.response?.data?.detail || "Đăng ký thất bại");
        }
    };

    return (
        <div style={{ padding: "40px", borderRadius: "30px", background: "rgba(255, 255, 255, 0.9)", width: 440, boxShadow: "0 25px 50px rgba(0,0,0,0.1)" }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Tạo tài khoản mới</h2>
                <p style={{ color: '#718096' }}>Tham gia cùng StreetFoodGo</p>
            </div>

            <Form layout="vertical" onFinish={onFinish} size="large">
                <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
                    <Input placeholder="example_user" style={{ borderRadius: 12 }} />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="admin@example.com" style={{ borderRadius: 12 }} />
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                    <Input.Password placeholder="••••••••" style={{ borderRadius: 12 }} />
                </Form.Item>

                <Button type="primary" htmlType="submit" block style={{ height: 50, borderRadius: 12, fontWeight: 700, marginTop: 20 }}>
                    Đăng ký ngay
                </Button>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
                <span>Đã có tài khoản? </span>
                <Button type="link" onClick={() => navigate("/login")}>Đăng nhập</Button>
            </div>
        </div>
    );
}