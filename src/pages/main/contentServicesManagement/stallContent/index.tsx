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
import type { StallContentDto, StallContentFilter } from "@/dto/stallContent.dto";
import {
  useActivateStallContent,
  useDeActivateStallContent,
  usePaginationStallContent,
} from "@/hooks/stallContent";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: StallContentFilter = {
  title: "",
  stall_id: "",
  language_code: "",
  is_deleted: undefined,
};

export default function StallContentManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<StallContentFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<StallContentFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationStallContent(pagination);

  const { onDeActivateStallContent } = useDeActivateStallContent();
  const { onActivateStallContent } = useActivateStallContent();

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
      key: "title",
      label: "Tiêu đề",
      type: "input",
      placeholder: "Nhập tiêu đề",
      col: 6,
    },
    {
      key: "language_code",
      label: "Mã ngôn ngữ",
      type: "input",
      placeholder: "Nhập mã ngôn ngữ",
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
      ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER
        .children.ADD_STALL_CONTENT.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    title: 200,
    language_code: 100,
    audio_duration: 120,
    is_deleted: 120,
    actions: 120,
  });

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: columnWidths.title,
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language_code",
      key: "language_code",
      width: columnWidths.language_code,
    },
    {
      title: "Thời lượng (giây)",
      dataIndex: "audio_duration",
      key: "audio_duration",
      width: columnWidths.audio_duration,
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
          ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER.children.DETAIL_STALL_CONTENT.path.replace(
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
      hidden: (record) => record.is_deleted,
      type: "default",
      tooltip: "Chỉnh sửa",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER.children.EDIT_STALL_CONTENT.path.replace(
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
          title="Bạn có chắc muốn ngưng hoạt động nội dung thuyết minh này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateStallContent(record.id);
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
      hidden: (record) => !record.is_deleted,
      label: "",
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn kích hoạt nội dung thuyết minh này?"
          confirmText="Kích hoạt"
          onConfirm={async () => {
            await onActivateStallContent(record.id);
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
    setFilter(newFilters as StallContentFilter);
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

      <TableCustom<StallContentDto>
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