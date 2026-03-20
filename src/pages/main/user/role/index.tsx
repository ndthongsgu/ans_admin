import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { RoleDto } from "@/dto/role.dto";
import { useActivateRole, useDeActivateRole, usePaginationRole } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { EditOutlined, EyeOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

export default function RoleManager() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationDto<{}>>({
    skip: 0,
    take: 10,
    where: {},
  });

  const { data, total, isLoading, refetch } = usePaginationRole(pagination);

  const { onDeActivateRole } = useDeActivateRole();
  const { onActivateRole } = useActivateRole();

  const handleCreate = () => {
    router.push(ROUTES.MAIN.ROLE_MANAGER.children.ADD_ROLE.path);
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 200,
    description: 300,
    isDeleted: 120,
    actions: 120,
  });

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: columnWidths.code,
    },
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: columnWidths.description,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      width: columnWidths.isDeleted,
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
        router.push(ROUTES.MAIN.ROLE_MANAGER.children.DETAIL_ROLE.path.replace(":id", record.id));
      },
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      showKey: "isCanEdit",
      type: "default",
      tooltip: "Chỉnh sửa",
      hidden: (record) => record.is_deleted,
      onClick: (record) => {
        router.push(ROUTES.MAIN.ROLE_MANAGER.children.EDIT_ROLE.path.replace(":id", record.id));
      },
    },
    {
      key: "deActivate",
      tooltip: "Ngưng hoạt động",
      showKey: "isCanDeactivate",
      type: "default",
      hidden: (record) => record.is_deleted,
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động vai trò này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateRole(record.id);
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
          title="Bạn có chắc muốn kích hoạt vai trò này?"
          confirmText="Kích hoạt"
          onConfirm={async () => {
            await onActivateRole(record.id);
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

  return (
    <BaseView>
      <TableCustom<RoleDto>
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
        customToolbar={<RowActions actions={[CommonActions.create(() => handleCreate())]} />}
      />
    </BaseView>
  );
}
