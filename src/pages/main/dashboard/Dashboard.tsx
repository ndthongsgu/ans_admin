import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined, TeamOutlined, ShopOutlined, SafetyOutlined } from "@ant-design/icons";
import { useProfile } from "@/hooks/auth/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data: profile, isLoading } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Welcome Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        padding: "40px",
        marginBottom: "24px",
        color: "white",
      }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: 700, margin: 0 }}>
          Chào mừng trở lại, {profile?.username || "Admin"}! 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginTop: "8px" }}>
          Hệ thống quản trị StreetFoodGo
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title="Người dùng hệ thống"
              value={0}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title="Khách hàng"
              value={0}
              prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title="Chủ quán"
              value={0}
              prefix={<ShopOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title="Nhân viên"
              value={0}
              prefix={<SafetyOutlined style={{ color: "#eb2f96" }} />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card
            title="Truy cập nhanh"
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => navigate("/user-manager")}
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    cursor: "pointer",
                  }}
                >
                  <UserOutlined style={{ fontSize: "32px", color: "white" }} />
                  <p style={{ color: "white", marginTop: "8px", fontWeight: 600 }}>
                    Quản lý Users
                  </p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => navigate("/user-manager/customer-manager/customer")}
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    cursor: "pointer",
                  }}
                >
                  <TeamOutlined style={{ fontSize: "32px", color: "white" }} />
                  <p style={{ color: "white", marginTop: "8px", fontWeight: 600 }}>
                    Quản lý Customers
                  </p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => navigate("/user-manager/employee-manager")}
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    cursor: "pointer",
                  }}
                >
                  <SafetyOutlined style={{ fontSize: "32px", color: "white" }} />
                  <p style={{ color: "white", marginTop: "8px", fontWeight: 600 }}>
                    Quản lý Employees
                  </p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => navigate("/owner-manager")}
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    cursor: "pointer",
                  }}
                >
                  <ShopOutlined style={{ fontSize: "32px", color: "white" }} />
                  <p style={{ color: "white", marginTop: "8px", fontWeight: 600 }}>
                    Quản lý Owners
                  </p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => navigate("/role-manager")}
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                    cursor: "pointer",
                  }}
                >
                  <SafetyOutlined style={{ fontSize: "32px", color: "white" }} />
                  <p style={{ color: "white", marginTop: "8px", fontWeight: 600 }}>
                    Phân quyền
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
