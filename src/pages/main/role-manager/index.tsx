import { ROUTES } from "@/common/constants/routes";
import { formatDate } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import RowActions from "@/components/row-action";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { RoleDto } from "@/dto/role.dto";
import {
  useActivateRole,
  useDeActivateRole,
  usePaginationRole,
} from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import { useState } from "react";

export default function RoleManager() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationDto<object>>({
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

  const columns = [
    {
      title: "Mã vai trò",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 150,
      render: (isDeleted: boolean) => (
        <Tag color={isDeleted ? "red" : "green"}>
          {isDeleted ? "Không hoạt động" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      render: (date: string) => formatDate(date),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.ROLE_MANAGER.children.DETAIL_ROLE.path.replace(
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
      type: "default",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.ROLE_MANAGER.children.EDIT_ROLE.path.replace(
            ":id",
            record.id
          )
        );
      },
    },
    {
      key: "deActivate",
      showKey: "isCanDeactivate",
      type: "default",
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
      showKey: "isCanActivate",
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn kích hoạt vai trò này?"
          confirmText="Hoạt động"
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

  return (
    <BaseView>
      <TableCustom<RoleDto>
        columns={columns}
        data={data}
        loading={isLoading}
        actions={actions}
        actionsWidth={150}
        pagination={{
          total,
          pageSize: pagination.take,
          current: Math.floor(pagination.skip / pagination.take) + 1,
          showSizeChanger: true,
        }}
        onPageChange={(page, pageSize) => {
          setPagination((prev) => ({
            ...prev,
            skip: (page - 1) * pageSize,
            take: pageSize,
          }));
        }}
        customToolbar={
          <RowActions actions={[CommonActions.create(() => handleCreate())]} />
        }
      />
    </BaseView>
  );
}
