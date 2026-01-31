import { useState } from "react";
import { Table, Button, Input, Space, Modal, Tag, Row } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useOwners, useDeleteOwner } from "@/hooks/owner/useOwners";
import type { OwnerDto } from "@/dto/owner.dto";
import type { ColumnsType } from "antd/es/table";
import OwnerModal from "@/components/modals/OwnerModal";
import { useNavigate } from "react-router-dom";

export default function OwnerListPage() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<OwnerDto | null>(null);

  const { data: owners = [], isLoading } = useOwners((page - 1) * pageSize, pageSize);
  const deleteOwnerMutation = useDeleteOwner();

  const handleCreate = () => {
    navigate("/owner-manager/add");
  };

  const handleEdit = (owner: OwnerDto) => {
    navigate(`/owner-manager/edit/${owner.id}`);
  };

  const handleViewDetail = (owner: OwnerDto) => {
    navigate(`/owner-manager/detail/${owner.id}`);
  };

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Xác nhận xóa chủ quán",
      content: `Bạn có chắc chắn muốn xóa chủ quán "${name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteOwnerMutation.mutate(id);
      },
    });
  };

  const columns: ColumnsType<OwnerDto> = [
    {
      title: "Tên chủ quán",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.fullName.toLowerCase().includes((value as string).toLowerCase()) ||
        record.phone?.toLowerCase().includes((value as string).toLowerCase()) ||
        false,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Gói dịch vụ",
      dataIndex: "subscriptionPackageName",
      key: "subscriptionPackageName",
      width: 150,
    },
    {
      title: "Tài khoản",
      key: "username",
      width: 150,
      render: (_, record: OwnerDto) => record.user?.username || "N/A",
    },
    {
      title: "Email",
      key: "email",
      width: 200,
      render: (_, record: OwnerDto) => record.user?.email || "N/A",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record: OwnerDto) => (
        <Tag color={record.user?.isActive ? "green" : "red"}>
          {record.user?.isActive ? "Hoạt động" : "Khóa"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record: OwnerDto) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.fullName)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  const filteredData = owners.filter(
    (owner: OwnerDto) =>
      owner.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      owner.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
      owner.user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      false
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Row justify="space-between" align="middle">
          <h2>Quản lý chủ quán</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            title="Thêm chủ quán"
          >
            Thêm chủ quán
          </Button>
        </Row>
      </div>

      <Input
        placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "20px" }}
        allowClear
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: owners.length,
          onChange: setPage,
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />

      <OwnerModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedOwner(null);
        }}
        ownerData={selectedOwner}
      />
    </div>
  );
}
