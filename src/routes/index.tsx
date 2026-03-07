import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import HomePage from "@/pages/main/home";
import EmployeeManager from "@/pages/main/user/employee";
import AddEmployeeScreen from "@/pages/main/user/employee/add";
import DetailEmployeeScreen from "@/pages/main/user/employee/detail";
import EditEmployeeScreen from "@/pages/main/user/employee/edit";
import CustomerManager from "@/pages/main/user/customer";
import AddCustomerScreen from "@/pages/main/user/customer/add";
import DetailCustomerScreen from "@/pages/main/user/customer/detail";
import EditCustomerScreen from "@/pages/main/user/customer/edit";
import RoleManager from "@/pages/main/role";
import AddRoleScreen from "@/pages/main/role/add";
import DetailRoleScreen from "@/pages/main/role/detail";
import EditRoleScreen from "@/pages/main/role/edit";
import OwnerManager from "@/pages/main/user/owner";
import AddOwnerScreen from "@/pages/main/user/owner/add";
import DetailOwnerScreen from "@/pages/main/user/owner/detail";
import EditOwnerScreen from "@/pages/main/user/owner/edit";
import StallManager from "@/pages/main/stall";
import AddStallScreen from "@/pages/main/stall/add";
import DetailStallScreen from "@/pages/main/stall/detail";
import EditStallScreen from "@/pages/main/stall/edit";
import StallContentManager from "@/pages/main/stallContent";
import AddStallContentScreen from "@/pages/main/stallContent/add";
import DetailStallContentScreen from "@/pages/main/stallContent/detail";
import EditStallContentScreen from "@/pages/main/stallContent/edit";
import SubscriptionPackageManager from "@/pages/main/subscriptionPackage";
import AddSubscriptionPackageScreen from "@/pages/main/subscriptionPackage/add";
import DetailSubscriptionPackageScreen from "@/pages/main/subscriptionPackage/detail";
import EditSubscriptionPackageScreen from "@/pages/main/subscriptionPackage/edit";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OAuthCallbackPage from "@/pages/auth/OAuthCallbackPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />
      <Route
        path={ROUTES.AUTH.CHANGE_PASSWORD.path}
        element={<ChangePasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.FORGOT_PASSWORD.path}
        element={<ForgotPasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.RESET_PASSWORD.path}
        element={<ResetPasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.OAUTH_CALLBACK.path}
        element={<OAuthCallbackPage />}
      />
      {/* Route bảo vệ */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          {/* Trang chủ */}
          <Route
            index
            path={ROUTES.MAIN.HOME.path}
            element={<HomePage />}
          />
          {/* Quản lý nhân viên */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.path}
            element={<EmployeeManager />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .ADD_EMPLOYEE.path
            }
            element={<AddEmployeeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .EDIT_EMPLOYEE.path
            }
            element={<EditEmployeeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .DETAIL_EMPLOYEE.path
            }
            element={<DetailEmployeeScreen />}
          />
          {/* Quản lý khách hàng */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST.path}
            element={<CustomerManager />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.children.ADD_CUSTOMER.path
            }
            element={<AddCustomerScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.children.EDIT_CUSTOMER.path
            }
            element={<EditCustomerScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.children.DETAIL_CUSTOMER.path
            }
            element={<DetailCustomerScreen />}
          />
          {/* Quản lý vai trò */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.path}
            element={<RoleManager />}
          />
          <Route
            path={
              ROUTES.MAIN.ROLE_MANAGER.children.ADD_ROLE.path
            }
            element={<AddRoleScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.ROLE_MANAGER.children.EDIT_ROLE.path
            }
            element={<EditRoleScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.ROLE_MANAGER.children.DETAIL_ROLE.path
            }
            element={<DetailRoleScreen />}
          />
          {/* Quản lý chủ quán */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.path}
            element={<OwnerManager />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.children.ADD_OWNER.path
            }
            element={<AddOwnerScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.children.EDIT_OWNER.path
            }
            element={<EditOwnerScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.OWNER_MANAGER.children.DETAIL_OWNER.path
            }
            element={<DetailOwnerScreen />}
          />
          {/* Quản lý quán ăn */}
          <Route
            path={ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.path}
            element={<StallManager />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.children.ADD_STALL.path
            }
            element={<AddStallScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.children.EDIT_STALL.path
            }
            element={<EditStallScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_MANAGER.children.DETAIL_STALL.path
            }
            element={<DetailStallScreen />}
          />
          {/* Quản lý nội dung thuyết minh */}
          <Route
            path={ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER.path}
            element={<StallContentManager />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER.children.ADD_STALL_CONTENT.path
            }
            element={<AddStallContentScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER.children.EDIT_STALL_CONTENT.path
            }
            element={<EditStallContentScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.STALL_CONTENT_MANAGER.children.DETAIL_STALL_CONTENT.path
            }
            element={<DetailStallContentScreen />}
          />
          {/* Quản lý gói đăng ký */}
          <Route
            path={ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.path}
            element={<SubscriptionPackageManager />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.children.ADD_SUBSCRIPTION_PACKAGE.path
            }
            element={<AddSubscriptionPackageScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.children.EDIT_SUBSCRIPTION_PACKAGE.path
            }
            element={<EditSubscriptionPackageScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CONTENT_SERVICE_MANAGER.children.SUBSCRIPTION_PACKAGE_MANAGER.children.DETAIL_SUBSCRIPTION_PACKAGE.path
            }
            element={<DetailSubscriptionPackageScreen />}
          />
        </Route>
      </Route>{" "}
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
