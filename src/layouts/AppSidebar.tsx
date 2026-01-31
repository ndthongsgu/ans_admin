import {
  DashboardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../assets/icons";
import { ROUTES } from "../common/constants/routes";
import { useUserInfo } from "@/hooks/auth/useUserInfo";
import { type ModuleCodeType } from "@/dto/auth.dto";
import { useMemo } from "react";

type AppSidebarProps = {
  collapsed: boolean;
};

type MenuItem = {
  key: string;
  path: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  moduleCode?: ModuleCodeType; // Add module code for permission checking
};

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useUserInfo();

  const allMenuItems: MenuItem[] = [
    {
      key: ROUTES.MAIN.HOME.key,
      path: ROUTES.MAIN.HOME.path,
      icon: <DashboardOutlined />,
      label: ROUTES.MAIN.HOME.label,
    },
    // Quản lý người dùng hệ thống (System Users Management)
    {
      key: ROUTES.MAIN.USER_MANAGER.key,
      path: ROUTES.MAIN.USER_MANAGER.path,
      icon: <UserOutlined />,
      label: "Quản lý người dùng hệ thống",
    },

    // Quản lý chủ quán (Owners)
    {
      key: ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.key,
      path: ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.path,
      icon: <UserOutlined />,
      label: ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.label,
    },
    // Quản lý loại khách hàng (Customer Types)
    {
      key: ROUTES.MAIN.CUSTOMER_TYPE_MANAGER.key,
      path: ROUTES.MAIN.CUSTOMER_TYPE_MANAGER.path,
      icon: <UserOutlined />,
      label: ROUTES.MAIN.CUSTOMER_TYPE_MANAGER.label,
    },
  ];

  // Build menu items. For now show all menu items when user is logged in.
  // Note: backend /api/auth/me does not return permissions in current API,
  // so we avoid filtering here to ensure admin can see management menus.
  const menuItems = useMemo(() => {
    if (!userInfo) return [];
    return allMenuItems;
  }, [userInfo]);

  const renderMenuItems = (items: MenuItem[]) =>
    items.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key} onClick={() => navigate(child.path)}>
              {child.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </Menu.Item>
      )
    );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={300}
      trigger={null}
      style={{
        background: `url('/background.png') center/cover no-repeat`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 0,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: 16,
          height: 100,
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "100%", height: "100%" }} />
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
        }}
      >
        {renderMenuItems(menuItems)}
      </Menu>
    </Sider>
  );
}
