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
import type { SubscriptionPackageDto, SubscriptionPackageFilter } from "@/dto/subscriptionPackage.dto";
import {
  useActivateSubscriptionPackage,
  useDeActivateSubscriptionPackage,
  usePaginationSubscriptionPackage,
} from "@/hooks/subscriptionPackage";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: SubscriptionPackageFilter = {
  name: "",
  is_deleted: undefined,
};

export default function SubscriptionPackageManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<SubscriptionPackageFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<SubscriptionPackageFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationSubscriptionPackage(pagination);

  const { onDeActivateSubscriptionPackage } = useDeActivateSubscriptionPackage();
  const { onActivateSubscriptionPackage } = useActivateSubscriptionPackage();

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
      key: "name",
      label: "Tên gói",
      type: "input",
      placeholder: "Nhập tên gói",
      col: 6,
    },
    {
      key: "is_deleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: false },
        { label: "Ngưng hoạt động", value: true },
      ],
      col: 6,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.children.ADD_SUBSCRIPTION_PACKAGE.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    name: 200,
    price: 120,
    duration: 120,
    max_stalls: 120,
    is_deleted: 120,
    actions: 120,
  });

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: columnWidths.price,
    },
    {
      title: "Thời hạn (ngày)",
      dataIndex: "duration",
      key: "duration",
      width: columnWidths.duration,
    },
    {
      title: "Số quán tối đa",
      dataIndex: "max_stalls",
      key: "max_stalls",
      width: columnWidths.max_stalls,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      width: columnWidths.is_deleted,
      render: (isDeleted: boolean) => {
        const colorMap = {
          true: "red",
          false: "green",
        };
        const textMap = {
          true: "Ngưng hoạt động",
          false: "Hoạt động",
        };
        return (
          <Row justify={"center"}>
            <Tag color={colorMap[String(isDeleted) as keyof typeof colorMap]}>
              {textMap[String(isDeleted) as keyof typeof textMap]}
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
          ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.children.DETAIL_SUBSCRIPTION_PACKAGE.path.replace(
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
      hidden: (record) => record.is_deleted,
      tooltip: "Chỉnh sửa",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.children.EDIT_SUBSCRIPTION_PACKAGE.path.replace(
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
      hidden: (record) => record.is_deleted,
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động gói đăng ký này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateSubscriptionPackage(record.id);
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
      hidden: (record) => !record.is_deleted,
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn kích hoạt gói đăng ký này?"
          confirmText="Kích hoạt"
          onConfirm={async () => {
            await onActivateSubscriptionPackage(record.id);
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
    setFilter(newFilters as SubscriptionPackageFilter);
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

      <TableCustom<SubscriptionPackageDto>
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