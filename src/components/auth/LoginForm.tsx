import { useLoading } from "@/context/LoadingContext";
import { Button, Form, Input, Alert, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/auth/auth";

export default function LoginForm({ adminMode = true }) {
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onFinish = async (values: any) => {
    showLoading();
    try {
      await loginMutation.mutateAsync({
        username_or_email: values.username_or_email,
        password: values.password,
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <div style={{
      padding: "50px",
      borderRadius: "30px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      width: 440,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a202c', letterSpacing: '-1px' }}>
          {adminMode ? "Admin StreetFood" : "StreetFoodGo"}
        </h2>
        <p style={{ color: '#718096', fontSize: '16px' }}>Đăng nhập hệ thống quản trị</p>
      </div>

      {loginMutation.isError && (
        <Alert message="Sai tài khoản hoặc mật khẩu" type="error" showIcon style={{ marginBottom: '24px', borderRadius: '12px' }} />
      )}

      <Form name="login" layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
        <Form.Item label={<span style={{ fontWeight: 600 }}>Tài khoản</span>} name="username_or_email" rules={[{ required: true, message: 'Nhập email hoặc username' }]}>
          <Input placeholder="admin@example.com" style={{ borderRadius: '12px' }} />
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>} name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
          <Input.Password placeholder="••••••••" style={{ borderRadius: '12px' }} />
        </Form.Item>

        <Form.Item style={{ marginTop: '30px' }}>
          <Button type="primary" htmlType="submit" block style={{
            height: '54px',
            borderRadius: '15px',
            fontWeight: 700,
            fontSize: '17px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
          }} loading={loginMutation.isPending}>
            Đăng nhập ngay
          </Button>
        </Form.Item>
      </Form>

      <Divider plain style={{ color: '#cbd5e0', fontSize: '12px' }}>Hoặc</Divider>

      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate("/register")} style={{ color: '#4f46e5', fontWeight: 600 }}>
          Bạn chưa có tài khoản? Đăng ký ngay
        </Button>
      </div>
    </div>
  );
}
