import { useState } from "react";
import { Table, Button, Input, Space, Modal, Row } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useCustomers, useDeleteCustomer } from "@/hooks/customer/useCustomers";
import type { CustomerDto } from "@/dto/customer.dto";
import type { ColumnsType } from "antd/es/table";
import CustomerModal from "@/components/modals/CustomerModal";
import { useNavigate } from "react-router-dom";

export default function CustomerListPage() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);

  const { data: customers = [], isLoading } = useCustomers((page - 1) * pageSize, pageSize);
  const deleteCustomerMutation = useDeleteCustomer();

  const handleCreate = () => {
    navigate("/customer-manager/add");
  };

  const handleEdit = (customer: CustomerDto) => {
    navigate(`/customer-manager/edit/${customer.id}`);
  };

  const handleViewDetail = (customer: CustomerDto) => {
    navigate(`/customer-manager/detail/${customer.id}`);
  };

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Xác nhận xóa khách hàng",
      content: `Bạn có chắc chắn muốn xóa khách hàng "${name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteCustomerMutation.mutate(id);
      },
    });
  };

  const columns: ColumnsType<CustomerDto> = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 100,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.code.toLowerCase().includes((value as string).toLowerCase()) ||
        record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record: CustomerDto) => (
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
            onClick={() => handleDelete(record.id, record.name)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  const filteredData = customers.filter(
    (customer: CustomerDto) =>
      customer.code.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Row justify="space-between" align="middle">
          <h2>Quản lý khách hàng</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Thêm khách hàng
          </Button>
        </Row>
      </div>

      <Input
        placeholder="Tìm kiếm theo mã hoặc tên..."
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
          total: customers.length,
          onChange: setPage,
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />

      <CustomerModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedCustomer(null);
        }}
        customerData={selectedCustomer}
      />
    </div>
  );
}
