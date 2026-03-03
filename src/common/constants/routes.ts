// import { Children } from "react"; // Unused

export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
    },
    CHANGE_PASSWORD: {
      key: "CHANGE_PASSWORD",
      label: "Đổi mật khẩu",
      path: "/change-password",
    },
    FORGOT_PASSWORD: {
      key: "FORGOT_PASSWORD",
      label: "Quên mật khẩu",
      path: "/forgot-password",
    },
    RESET_PASSWORD: {
      key: "RESET_PASSWORD",
      label: "Đặt lại mật khẩu",
      path: "/reset-password",
    },
    OAUTH_CALLBACK: {
      key: "OAUTH_CALLBACK",
      label: "OAuth Callback",
      path: "/oauth/callback",
    },
  },
  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
    },
    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      label: "Quản lý vai trò",
      path: "/role_manager",
      Children: {
        ADD_ROLE: {
          key: "ADD_ROLE",
          label: "Thêm vai trò",
          path: "/role_manager/add",
        },
        EDIT_ROLE: {
          key: "EDIT_ROLE",
          label: "Chỉnh sửa vai trò",
          path: "/role_manager/edit/:id",
        },
        DETAIL_ROLE: {
          key: "DETAIL_ROLE",
          label: "Chi tiết vai trò",
          path: "/role_manager/detail/:id",
        },
      }
    },
    PERMISSION_MANAGER: {
      key: "PERMISSION_MANAGER",
      label: "Quản lý phân quyền",
      path: "/user_manager/permission",
    },
    /* Quản lý người dùng */
    USER_MANAGER: {
      key: "USER_MANAGER",
      label: "Quản lý người dùng",
      path: "/user_manager",
      children: {
        CUSTOMER_MANAGER: {
          key: "CUSTOMER_MANAGER",
          label: "Quản lý khách hàng",
          path: "/user_manager/customer",
          children: {
            CUSTOMER_LIST: {
              key: "CUSTOMER_LIST",
              label: "Danh sách khách hàng",
              path: "/user_manager/customer/list",
              children: {
                ADD_CUSTOMER: {
                  key: "ADD_CUSTOMER",
                  label: "Thêm khách hàng",
                  path: "/user_manager/customer/add",
                },
                EDIT_CUSTOMER: {
                  key: "EDIT_CUSTOMER",
                  label: "Chỉnh sửa khách hàng",
                  path: "/user_manager/customer/edit/:id",
                },
                DETAIL_CUSTOMER: {
                  key: "DETAIL_CUSTOMER",
                  label: "Chi tiết khách hàng",
                  path: "/user_manager/customer/detail/:id",
                },
              },
            },
            CUSTOMER_TYPE: {
              key: "CUSTOMER_TYPE",
              label: "Loại khách hàng",
              path: "/user_manager/customer/type",
              children: {
                ADD_CUSTOMER_TYPE: {
                  key: "ADD_CUSTOMER_TYPE",
                  label: "Thêm loại khách hàng",
                  path: "/user_manager/customer/type/add",
                },
                EDIT_CUSTOMER_TYPE: {
                  key: "EDIT_CUSTOMER_TYPE",
                  label: "Chỉnh sửa loại khách hàng",
                  path: "/user_manager/customer/type/edit/:id",
                },
                DETAIL_CUSTOMER_TYPE: {
                  key: "DETAIL_CUSTOMER_TYPE",
                  label: "Chi tiết loại khách hàng",
                  path: "/user_manager/customer/type/detail/:id",
                },
              },
            },
          },
        },
        EMPLOYEE_MANAGER: {
          key: "EMPLOYEE_MANAGER",
          label: "Quản lý nhân viên",
          path: "/employee_manager",
          children: {
            ADD_EMPLOYEE: {
              key: "ADD_EMPLOYEE",
              label: "Thêm nhân viên",
              path: "/employee_manager/add",
            },
            DETAIL_EMPLOYEE: {
              key: "DETAIL_EMPLOYEE",
              label: "Chi tiết nhân viên",
              path: "/employee_manager/detail/:id",
            },
            EDIT_EMPLOYEE: {
              key: "EDIT_EMPLOYEE",
              label: "Chỉnh sửa nhân viên",
              path: "/employee_manager/edit/:id",
            },
          },
        },
      },
    },
  }
};
