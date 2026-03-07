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
        </Route>
      </Route>{" "}
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
