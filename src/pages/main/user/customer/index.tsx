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
import type { CustomerDto, CustomerFilter } from "@/dto/customer.dto";
import {
  useActivateCustomer,
  useDeActivateCustomer,
  usePaginationCustomer,
} from "@/hooks/customer";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: CustomerFilter = {
  code: "",
  name: "",
  email: "",
  phone: "",
  isDeleted: undefined,
  customerTypeId: undefined,
};

export default function CustomerManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<CustomerFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<CustomerFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationCustomer(pagination);

  const { onDeActivateCustomer } = useDeActivateCustomer();
  const { onActivateCustomer } = useActivateCustomer();

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
      label: "Tên khách hàng",
      type: "input",
      placeholder: "Nhập tên khách hàng",
      col: 6,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
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
      ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST
        .children.ADD_CUSTOMER.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 200,
    email: 200,
    phone: 150,
    isDeleted: 120,
    actions: 120,
  });

  const columns = [
    // {
    //   title: "Mã",
    //   dataIndex: "code",
    //   key: "code",
    //   width: columnWidths.code,
    // },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: columnWidths.email,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: columnWidths.phone,
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST.children.DETAIL_CUSTOMER.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST.children.EDIT_CUSTOMER.path.replace(
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
          title="Bạn có chắc muốn ngưng hoạt động khách hàng này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateCustomer(record.id);
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
          title="Bạn có chắc muốn kích hoạt khách hàng này?"
          confirmText="Kích hoạt"
          onConfirm={async () => {
            await onActivateCustomer(record.id);
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
    setFilter(newFilters as CustomerFilter);
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

      <TableCustom<CustomerDto>
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
