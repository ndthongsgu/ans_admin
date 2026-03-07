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
  full_name: "",
  phone: "",
  business_name: "",
  isDeleted: undefined,
};

export default function OwnerManager() {
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
      key: "full_name",
      label: "Tên chủ quán",
      type: "input",
      placeholder: "Nhập tên chủ quán",
      col: 6,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 6,
    },
    {
      key: "business_name",
      label: "Tên doanh nghiệp",
      type: "input",
      placeholder: "Nhập tên doanh nghiệp",
      col: 6,
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
      col: 6,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER
        .children.ADD_OWNER.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    full_name: 200,
    phone: 150,
    business_name: 200,
    isDeleted: 120,
    actions: 120,
  });

  const columns = [
    {
      title: "Tên chủ quán",
      dataIndex: "full_name",
      key: "full_name",
      width: columnWidths.full_name,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: columnWidths.phone,
    },
    {
      title: "Tên doanh nghiệp",
      dataIndex: "business_name",
      key: "business_name",
      width: columnWidths.business_name,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: columnWidths.isDeleted,
      render: (isActive: boolean) => {
        const colorMap = {
          true: "green",
          false: "red",
        };
        const textMap = {
          true: "Hoạt động",
          false: "Không hoạt động",
        };
        return (
          <Row justify={"center"}>
            <Tag color={colorMap[String(isActive) as keyof typeof colorMap]}>
              {textMap[String(isActive) as keyof typeof textMap]}
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
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.children.DETAIL_OWNER.path.replace(
            ":id",
            record.id
          )
        );
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
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.children.EDIT_OWNER.path.replace(
            ":id",
            record.id
          )
        );
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
          confirmText="Kích hoạt"
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

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
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
        actionsWidth={columnWidths.actions}
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