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
      children: {
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
      },
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
        OWNER_MANAGER: {
          key: "OWNER_MANAGER",
          label: "Quản lý chủ quán",
          path: "/owner_manager",
          children: {
            ADD_OWNER: {
              key: "ADD_OWNER",
              label: "Thêm chủ quán",
              path: "/owner_manager/add",
            },
            EDIT_OWNER: {
              key: "EDIT_OWNER",
              label: "Chỉnh sửa chủ quán",
              path: "/owner_manager/edit/:id",
            },
            DETAIL_OWNER: {
              key: "DETAIL_OWNER",
              label: "Chi tiết chủ quán",
              path: "/owner_manager/detail/:id",
            },
          },
        },
      },
    },
    CONTENT_SERVICE_MANAGER: {
      key: "CONTENT_SERVICE_MANAGER",
      label: "Quản lý nội dung & Dịch vụ",
      children: {
        STALL_MANAGER: {
          key: "STALL_MANAGER",
          label: "Quản lý quán ăn",
          path: "/stall_manager",
          children: {
            ADD_STALL: {
              key: "ADD_STALL",
              label: "Thêm quán ăn",
              path: "/stall_manager/add",
            },
            EDIT_STALL: {
              key: "EDIT_STALL",
              label: "Chỉnh sửa quán ăn",
              path: "/stall_manager/edit/:id",
            },
            DETAIL_STALL: {
              key: "DETAIL_STALL",
              label: "Chi tiết quán ăn",
              path: "/stall_manager/detail/:id",
            },
          },
        },
        STALL_CONTENT_MANAGER: {
          key: "STALL_CONTENT_MANAGER",
          label: "Quản lý nội dung thuyết minh",
          path: "/stall_content_manager",
          children: {
            ADD_STALL_CONTENT: {
              key: "ADD_STALL_CONTENT",
              label: "Thêm nội dung thuyết minh",
              path: "/stall_content_manager/add",
            },
            EDIT_STALL_CONTENT: {
              key: "EDIT_STALL_CONTENT",
              label: "Chỉnh sửa nội dung thuyết minh",
              path: "/stall_content_manager/edit/:id",
            },
            DETAIL_STALL_CONTENT: {
              key: "DETAIL_STALL_CONTENT",
              label: "Chi tiết nội dung thuyết minh",
              path: "/stall_content_manager/detail/:id",
            },
          },
        },
        SUBSCRIPTION_PACKAGE_MANAGER: {
          key: "SUBSCRIPTION_PACKAGE_MANAGER",
          label: "Quản lý gói đăng ký",
          path: "/subscription_package_manager",
          children: {
            ADD_SUBSCRIPTION_PACKAGE: {
              key: "ADD_SUBSCRIPTION_PACKAGE",
              label: "Thêm gói đăng ký",
              path: "/subscription_package_manager/add",
            },
            EDIT_SUBSCRIPTION_PACKAGE: {
              key: "EDIT_SUBSCRIPTION_PACKAGE",
              label: "Chỉnh sửa gói đăng ký",
              path: "/subscription_package_manager/edit/:id",
            },
            DETAIL_SUBSCRIPTION_PACKAGE: {
              key: "DETAIL_SUBSCRIPTION_PACKAGE",
              label: "Chi tiết gói đăng ký",
              path: "/subscription_package_manager/detail/:id",
            },
          },
        },
      },
    },
  },
};
