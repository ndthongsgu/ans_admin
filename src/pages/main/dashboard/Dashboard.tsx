import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined, TeamOutlined, ShopOutlined, SafetyOutlined } from "@ant-design/icons";
import { useProfile } from "@/hooks/auth/auth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const { data: profile, isLoading } = useProfile();
  const [stats, setStats] = useState({
    system_users: 0,
    customers: 0,
    owners: 0,
    employees: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading || loadingStats) {
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
              value={stats.system_users}
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
              value={stats.customers}
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
              value={stats.owners}
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
              value={stats.employees}
              prefix={<SafetyOutlined style={{ color: "#eb2f96" }} />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
