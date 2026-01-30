import BaseView from "@/components/base-view/BaseView";
import Title from "@/components/title";
import TableCustom from "@/components/table/Table";
import { ROUTES } from "@/common/constants/routes";
import { useDeleteStall, useStalls } from "@/hooks/stall/index";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PAGE_SIZE = 10;

export default function StallManager() {
    const navigate = useNavigate();
    const [params, setParams] = useState({
        skip: 0,
        limit: DEFAULT_PAGE_SIZE,
        keyword: "",
    });

    const { data: stalls, isLoading, refetch } = useStalls(params);
    const deleteMutation = useDeleteStall();

    const handleEdit = (id: string) => {
        navigate(ROUTES.MAIN.STALL_MANAGER.children.EDIT_STALL.path.replace(":id", id));
    };

    const handleDetail = (id: string) => {
        navigate(ROUTES.MAIN.STALL_MANAGER.children.DETAIL_STALL.path.replace(":id", id));
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa quán này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            okButtonProps: { danger: true },
            onOk: () => {
                deleteMutation.mutate(id, {
                    onSuccess: () => {
                        message.success("Xóa quán thành công");
                        refetch();
                    },
                    onError: () => {
                        message.error("Xóa quán thất bại");
                    },
                });
            },
        });
    };

    const columns: ColumnsType<any> = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) => params.skip + index + 1,
        },
        {
            title: "Tên quán",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Khu vực",
            dataIndex: ["area", "name"],
            key: "areaName",
            render: (text) => text || "N/A",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status: boolean) => (
                <Tag color={status ? "green" : "red"}>{status ? "Hoạt động" : "Ngưng"}</Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleDetail(record.id)}
                        title="Chi tiết"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="text-blue-500"
                        onClick={() => handleEdit(record.id)}
                        title="Sửa"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                        title="Xóa"
                    />
                </Space>
            ),
        },
    ];

    return (
        <BaseView>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                    <Title>Quản lý quán</Title>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(ROUTES.MAIN.STALL_MANAGER.children.ADD_STALL.path)}
                >
                    Thêm quán
                </Button>
            </div>

            <div className="mb-4 flex gap-4" style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm theo tên quán..."
                    allowClear
                    onSearch={(value) => setParams({ ...params, keyword: value, skip: 0 })}
                    className="max-w-md"
                    style={{ width: 300 }}
                />
            </div>

            <TableCustom
                columns={columns}
                data={stalls || []} // TableCustom uses 'data' prop not 'dataSource'
                loading={isLoading}
                pagination={{
                    current: Math.floor(params.skip / params.limit) + 1,
                    pageSize: params.limit,
                    total: 0,
                }}
                onPageChange={(page, pageSize) => {
                    setParams({ ...params, skip: (page - 1) * pageSize, limit: pageSize });
                }}
                rowKey="id"
            />
        </BaseView>
    );
}
