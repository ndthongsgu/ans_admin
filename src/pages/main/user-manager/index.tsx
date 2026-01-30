import { useState } from "react";
import { Table, Button, Input, Space, Modal, Tag, Row } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useUsers, useDeleteUser } from "@/hooks/user/useUsers";
import type { UserDto } from "@/dto/user.dto";
import type { ColumnsType } from "antd/es/table";
import UserModal from "@/components/modals/UserModal";

export default function UserManager() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const { data: users, isLoading } = useUsers((page - 1) * pageSize, pageSize);
  const deleteUserMutation = useDeleteUser();

  const handleCreate = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDelete = (id: string, username: string) => {
    Modal.confirm({
      title: "Xác nhận xóa người dùng",
      content: `Bạn có chắc chắn muốn xóa người dùng "${username}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteUserMutation.mutate(id);
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.username.toLowerCase().includes((value as string).toLowerCase()) ||
        record.email.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Bị khóa"}
        </Tag>
      ),
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "created_at",
    //   key: "created_at",
    //   render: (timestamp: number) => {
    //       return timestamp ? new Date(timestamp * 1000).toLocaleDateString("vi-VN") : "N/A";
    //   },
    // },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record: UserDto) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.username)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>Quản lý người dùng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
          onClick={handleCreate}
        >
          Thêm người dùng
        </Button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Input
          placeholder="Tìm kiếm theo username hoặc email..."
          prefix={<SearchOutlined />}
          size="large"
          style={{ maxWidth: "400px", borderRadius: "8px" }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={users || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: users?.length || 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người dùng`,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      />

      <UserModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        userData={selectedUser}
      />
    </div>
  );
}
