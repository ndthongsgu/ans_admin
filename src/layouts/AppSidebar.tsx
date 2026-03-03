import {
  BarChartOutlined,
  CarOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  LockOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../assets/icons";
import { ROUTES } from "../common/constants/routes";
import { useUserInfo } from "@/hooks/auth/useUserInfo";
import { canAccessModule, isAdmin } from "@/common/helpers/permissions";
import { ModuleCode, type ModuleCodeType } from "@/dto/auth.dto";
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
    {
      key: ROUTES.MAIN.USER_MANAGER.key,
      path: ROUTES.MAIN.USER_MANAGER.path,
      icon: <UserOutlined />,
      label: ROUTES.MAIN.USER_MANAGER.label,
      children: [
        {
          key: ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.key,
          path: ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.path,
          label: ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.label,
        },
        {
          key: ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.key,
          path: ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.path,
          label: ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.label,
        },
      ],
    },
  ];

  // Filter menu items based on user permissions
  const menuItems = useMemo(() => {
    if (!userInfo) return [];

    // ⚠️ ADMIN BYPASS: Admin sees ALL menu items
    if (isAdmin(userInfo)) {
      return allMenuItems;
    }

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .map((item) => {
          // If item has moduleCode, check permission
          if (item.moduleCode) {
            const hasAccess = canAccessModule(item.moduleCode, userInfo);
            if (!hasAccess) return null;
          }

          // Filter children recursively
          if (item.children) {
            const filteredChildren = filterItems(item.children);
            // If no children have access, hide parent
            if (filteredChildren.length === 0) return null;
            return { ...item, children: filteredChildren };
          }

          return item;
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return filterItems(allMenuItems);
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
