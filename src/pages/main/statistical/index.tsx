import React, { useEffect, useState, useCallback } from "react";
import { Card, Row, Col, Statistic, Table, Empty, Spin, Button, Space, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  MobileOutlined,
  AndroidOutlined,
  AppleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { getOnlineStatsService, type OnlineStatsService } from "@/services/online-stats.service";
import "./index.less";

interface OnlineUser {
  device_id: string;
  user_id?: number;
  platform?: string;
  connected_at?: string;
  last_activity?: string;
}

interface OnlineStats {
  type: string;
  count: number;
  timestamp: string;
  users: OnlineUser[];
}

export default function StatisticalPage() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [service, setService] = useState<OnlineStatsService | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeService = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BE_API || "http://localhost:8000";
        const statsService = getOnlineStatsService(apiUrl);

        // Subscribe to updates
        const unsubscribe = statsService.subscribe((data: OnlineStats) => {
          if (data.type === "online_count") {
            setOnlineCount(data.count);
            setOnlineUsers(data.users || []);
            setLastUpdate(new Date());
          }
        });

        setService(statsService);

        // Connect to WebSocket
        await statsService.connect();
        setIsConnected(true);
        setIsLoading(false);

        // Cleanup on unmount
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Failed to initialize online stats:", error);
        setIsLoading(false);
        setIsConnected(false);
      }
    };

    initializeService();

    return () => {
      if (service) {
        service.disconnect();
      }
    };
  }, []);

  // Handle refresh button
  const handleRefresh = useCallback(async () => {
    if (service && service.isConnected()) {
      setLastUpdate(new Date());
    }
  }, [service]);

  // Get platform icon
  const getPlatformIcon = (platform?: string) => {
    if (platform === "android") {
      return <AndroidOutlined style={{ color: "#3DDC84", marginRight: 8 }} />;
    } else if (platform === "ios") {
      return <AppleOutlined style={{ color: "#555", marginRight: 8 }} />;
    }
    return <MobileOutlined style={{ marginRight: 8 }} />;
  };

  // Table columns for online users
  const columns = [
    {
      title: "Device ID",
      dataIndex: "device_id",
      key: "device_id",
      width: "35%",
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => <Tooltip title={text}>{text.slice(0, 20)}...</Tooltip>,
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      width: "15%",
      render: (platform: string) => {
        if (platform === "android") {
          return (
            <Tag icon={<AndroidOutlined />} color="success">
              Android
            </Tag>
          );
        } else if (platform === "ios") {
          return (
            <Tag icon={<AppleOutlined />} color="blue">
              iOS
            </Tag>
          );
        }
        return <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Connected Since",
      dataIndex: "connected_at",
      key: "connected_at",
      width: "25%",
      render: (timestamp: string) => {
        if (!timestamp) return "-";
        const date = new Date(timestamp);
        return date.toLocaleTimeString("vi-VN");
      },
    },
    {
      title: "Last Activity",
      dataIndex: "last_activity",
      key: "last_activity",
      width: "25%",
      render: (timestamp: string) => {
        if (!timestamp) return "-";
        const date = new Date(timestamp);
        return date.toLocaleTimeString("vi-VN");
      },
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Spin tip="Đang kết nối..." />
      </div>
    );
  }

  return (
    <div className="statistical-page">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Người dùng đang truy cập"
              value={onlineCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: "2em" }}
              suffix={
                isConnected ? <Tag color="green">Kết nối</Tag> : <Tag color="red">Mất kết nối</Tag>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Trạng thái WebSocket"
              value={isConnected ? "Hoạt động" : "Không hoạt động"}
              valueStyle={{ color: isConnected ? "#52c41a" : "#ff4d4f", fontSize: "1.2em" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Cập nhật cuối"
              value={lastUpdate ? lastUpdate.toLocaleTimeString("vi-VN") : "Chưa cập nhật"}
              valueStyle={{ fontSize: "0.9em" }}
            />
            <Button
              type="primary"
              size="small"
              onClick={handleRefresh}
              style={{ marginTop: 8 }}
              loading={!isConnected}
            >
              Làm mới
            </Button>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <MobileOutlined />
            <span>Danh sách người dùng đang truy cập ({onlineUsers.length})</span>
          </Space>
        }
        bordered={false}
      >
        {onlineUsers.length > 0 ? (
          <Table
            columns={columns}
            dataSource={onlineUsers.map((user, index) => ({ ...user, key: index }))}
            pagination={{
              pageSize: 10,
              total: onlineUsers.length,
              showTotal: (total) => `Tổng ${total} người dùng`,
            }}
            scroll={{ x: 768 }}
          />
        ) : (
          <Empty
            description="Không có người dùng đang truy cập"
            style={{ paddingTop: 50, paddingBottom: 50 }}
          />
        )}
      </Card>

      {/* Real-time stats info */}
      <Card style={{ marginTop: 24 }} type="inner">
        <Space direction="vertical" style={{ width: "100%" }}>
          <p>
            <SyncOutlined spin={isConnected} />
            {isConnected
              ? " Đang nhận dữ liệu real-time từ WebSocket"
              : " WebSocket không kết nối được"}
          </p>
          <p style={{ fontSize: "0.85em", color: "#999" }}>
            • Cập nhật tự động: Khi có người dùng vào/thoát app mobile
          </p>
          <p style={{ fontSize: "0.85em", color: "#999" }}>
            • Dữ liệu được lưu tạm trên server (in-memory)
          </p>
          <p style={{ fontSize: "0.85em", color: "#999" }}>
            • Cập nhật lần cuối: {lastUpdate ? lastUpdate.toLocaleString("vi-VN") : "Chưa cập nhật"}
          </p>
        </Space>
      </Card>
    </div>
  );
}
