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
import type { StallDto, StallFilter } from "@/dto/stall.dto";
import {
  useActivateStall,
  useDeActivateStall,
  usePaginationStall,
} from "@/hooks/stall";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: StallFilter = {
  name: "",
  category: "",
  owner_id: "",
  is_deleted: undefined,
};

export default function StallManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<StallFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<StallFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationStall(pagination);

  const { onDeActivateStall } = useDeActivateStall();
  const { onActivateStall } = useActivateStall();

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
      label: "Tên quán ăn",
      type: "input",
      placeholder: "Nhập tên quán ăn",
      col: 6,
    },
    {
      key: "category",
      label: "Danh mục",
      type: "input",
      placeholder: "Nhập danh mục",
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
        { label: "Không hoạt động", value: true },
      ],
      col: 6,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.children.ADD_STALL.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    name: 200,
    category: 150,
    contact_phone: 150,
    is_deleted: 120,
    actions: 120,
  });

  const columns = [
    {
      title: "Tên quán ăn",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: columnWidths.category,
    },
    {
      title: "Số điện thoại",
      dataIndex: "contact_phone",
      key: "contact_phone",
      width: columnWidths.contact_phone,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      width: columnWidths.is_deleted,
      render: (is_deleted: boolean) => {
        const colorMap = {
          false: "green",
          true: "red",
        };
        const textMap = {
          false: "Hoạt động",
          true: "Không hoạt động",
        };
        return (
          <Row justify={"center"}>
            <Tag color={colorMap[String(is_deleted) as keyof typeof colorMap]}>
              {textMap[String(is_deleted) as keyof typeof textMap]}
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
          ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.children.DETAIL_STALL.path.replace(
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
      hidden: (record: StallDto) => record.is_deleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.children.EDIT_STALL.path.replace(
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
      hidden: (record: StallDto) => record.is_deleted,
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động quán ăn này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateStall(record.id);
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
      hidden: (record: StallDto) => !record.is_deleted,
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn kích hoạt quán ăn này?"
          confirmText="Kích hoạt"
          onConfirm={async () => {
            await onActivateStall(record.id);
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
    setFilter(newFilters as StallFilter);
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

      <TableCustom<StallDto>
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