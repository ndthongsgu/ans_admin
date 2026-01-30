import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import FilterComponent, {
    type FilterField,
} from "@/components/filter/FilterCustom";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { OwnerDto, OwnerFilter } from "@/dto/owner.dto";
import {
    useActivateOwner,
    useDeActivateOwner,
    usePaginationOwner,
} from "@/hooks/owner";
import { useRouter } from "@/routes/hooks";
import {
    EditOutlined,
    EyeOutlined,
    PlayCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: OwnerFilter = {
    fullName: "",
    phone: "",
    subscriptionPackageId: undefined,
    isDeleted: undefined,
};

export default function OwnerPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<OwnerFilter>(initFilter);
    const [pagination, setPagination] = useState<PaginationDto<OwnerFilter>>({
        skip: 0,
        take: 10,
        where: initFilter,
    });

    const { data, total, isLoading, refetch } = usePaginationOwner(pagination);

    const { onDeActivateOwner } = useDeActivateOwner();
    const { onActivateOwner } = useActivateOwner();

    const handleSearch = (isReset?: boolean) => {
        setPagination((prev) => ({
            ...prev,
            where: isReset
                ? initFilter
                : {
                    ...prev.where,
                    ...filter,
                },
        }));
    };

    const filterFields: FilterField[] = [
        {
            key: "fullName",
            label: "Tên chủ quán",
            type: "input",
            placeholder: "Nhập tên chủ quán",
            col: 8,
        },
        {
            key: "phone",
            label: "Số điện thoại",
            type: "input",
            placeholder: "Nhập số điện thoại",
            col: 8,
        },
        {
            key: "isDeleted",
            label: "Trạng thái",
            type: "select",
            placeholder: "Chọn trạng thái",
            options: [
                { label: "Tất cả", value: undefined },
                { label: "Hoạt động", value: false },
                { label: "Không hoạt động", value: true },
            ],
            col: 8,
        },
    ];

    const handleCreate = () => {
        router.push("/owner-manager/add");
    };

    const [columnWidths] = useState<Record<string, number>>({
        fullName: 200,
        phone: 150,
        email: 200,
        username: 150,
        createdDate: 180,
    });

    const columns = [
        {
            title: "Tên chủ quán",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: ["user", "email"],
            key: "email",
            render: (_: any, record: OwnerDto) => {
                return record.user?.email || "";
            },
        },
        {
            title: "Username",
            dataIndex: ["user", "username"],
            key: "username",
            render: (_: any, record: OwnerDto) => {
                return record.user?.username || "";
            },
        },
        {
            title: "Gói đăng ký",
            dataIndex: "subscriptionPackageName",
            key: "subscriptionPackageName",
            render: (_: any, record: OwnerDto) => {
                return record.subscriptionPackageName || "Chưa có";
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "isDeleted",
            key: "isDeleted",
            width: 120,
            render: (isDeleted: boolean) => {
                const colorMap = {
                    true: "red",
                    false: "green",
                };
                const textMap = {
                    true: "Không hoạt động",
                    false: "Hoạt động",
                };
                return (
                    <Row justify={"center"}>
                        <Tag
                            color={colorMap[isDeleted as unknown as keyof typeof colorMap]}
                        >
                            {textMap[isDeleted as unknown as keyof typeof textMap]}
                        </Tag>
                    </Row>
                );
            },
        },
    ];

    const actions: TableAction[] = [
        {
            key: "view",
            label: "",
            icon: <EyeOutlined />,
            showKey: "isCanView",
            type: "default",
            tooltip: "Xem chi tiết",
            onClick: (record) => {
                router.push(`/owner-manager/detail/${record.id}`);
            },
        },
        {
            key: "edit",
            label: "",
            icon: <EditOutlined />,
            showKey: "isCanEdit",
            type: "default",
            tooltip: "Chỉnh sửa",
            onClick: (record) => {
                router.push(`/owner-manager/edit/${record.id}`);
            },
        },
        {
            key: "deActivate",
            tooltip: "Ngưng hoạt động",
            showKey: "isCanDeactivate",
            type: "default",
            render: (record) => (
                <ActionConfirm
                    title="Bạn có chắc muốn ngưng hoạt động chủ quán này?"
                    confirmText="Ngưng hoạt động"
                    onConfirm={async () => {
                        await onDeActivateOwner(record.id);
                        refetch();
                    }}
                >
                    <Button icon={<StopOutlined />} danger />
                </ActionConfirm>
            ),
        },

        {
            key: "activate",
            tooltip: "Kích hoạt",
            showKey: "isCanActivate",
            label: "",
            type: "default",
            render: (record) => (
                <ActionConfirm
                    title="Bạn có chắc muốn kích hoạt chủ quán này?"
                    confirmText="Hoạt động"
                    onConfirm={async () => {
                        await onActivateOwner(record.id);
                        refetch();
                    }}
                >
                    <Button icon={<PlayCircleOutlined />} />
                </ActionConfirm>
            ),
        },
    ];

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            skip: (page - 1) * pageSize,
            take: pageSize,
        }));
    };

    const handleFiltersChange = (newFilters: Record<string, any>) => {
        setFilter(newFilters as OwnerFilter);
    };

    return (
        <BaseView>
            <FilterComponent
                fields={filterFields}
                filters={filter}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onClear={() => {
                    handleSearch(true);
                }}
            />

            <TableCustom<OwnerDto>
                columns={columns}
                columnWidths={columnWidths}
                data={data}
                loading={isLoading}
                actions={actions}
                actionsWidth={120}
                pagination={{
                    total,
                    pageSize: pagination.take,
                    current: Math.floor(pagination.skip / pagination.take) + 1,
                    showSizeChanger: true,
                }}
                onPageChange={handlePageChange}
                customToolbar={
                    <RowActions actions={[CommonActions.create(() => handleCreate())]} />
                }
            />
        </BaseView>
    );
}
