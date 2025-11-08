import React from 'react';
import { Alert, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as UserServices from '../../services/UserServices';

/**
 * Higher-Order Component để bảo vệ component theo permission
 * @param {Component} WrappedComponent - Component cần bảo vệ
 * @param {string|array} requiredPermissions - Permission cần thiết (string hoặc array of strings)
 * @param {object} options - Các tùy chọn
 * @param {boolean} options.requireAll - Yêu cầu tất cả permissions (default: false)
 */
const withPermission = (WrappedComponent, requiredPermissions, options = {}) => {
    const { requireAll = false } = options;

    return (props) => {
        const user = useSelector((state) => state.user);

        // Fetch thông tin user đầy đủ
        const { data: userDetails, isLoading } = useQuery({
            queryKey: ['userDetails', user?.id],
            queryFn: () => UserServices.getDetailsUser(user?.id, user?.access_token),
            enabled: !!user?.id && !!user?.access_token
        });

        const permissions = userDetails?.data?.permissions || {};
        const userRole = userDetails?.data?.role || 'customer';

        // Loading state
        if (isLoading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
                    <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
                </div>
            );
        }

        // Super admin có toàn quyền
        if (userRole === 'super_admin') {
            return <WrappedComponent {...props} permissions={permissions} userRole={userRole} />;
        }

        // Kiểm tra permissions
        const checkPermissions = () => {
            // Nếu requiredPermissions là string
            if (typeof requiredPermissions === 'string') {
                return permissions[requiredPermissions] === true;
            }

            // Nếu requiredPermissions là array
            if (Array.isArray(requiredPermissions)) {
                if (requireAll) {
                    // Yêu cầu TẤT CẢ permissions
                    return requiredPermissions.every(perm => permissions[perm] === true);
                } else {
                    // Chỉ cần 1 permission
                    return requiredPermissions.some(perm => permissions[perm] === true);
                }
            }

            return false;
        };

        const hasAccess = checkPermissions();

        if (!hasAccess) {
            return (
                <div style={{ padding: '40px' }}>
                    <Alert
                        type="error"
                        message="Truy cập bị từ chối"
                        description="Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi."
                        showIcon
                    />
                </div>
            );
        }

        return <WrappedComponent {...props} permissions={permissions} userRole={userRole} />;
    };
};

export default withPermission;

// Hook để sử dụng permissions trong functional component
export const usePermissions = () => {
    const user = useSelector((state) => state.user);

    const { data: userDetails, isLoading } = useQuery({
        queryKey: ['userDetails', user?.id],
        queryFn: () => UserServices.getDetailsUser(user?.id, user?.access_token),
        enabled: !!user?.id && !!user?.access_token
    });

    const permissions = userDetails?.data?.permissions || {};
    const userRole = userDetails?.data?.role || 'customer';

    const hasPermission = (permission) => {
        if (userRole === 'super_admin') return true;
        return permissions[permission] === true;
    };

    const hasAnyPermission = (permissionArray) => {
        if (userRole === 'super_admin') return true;
        return permissionArray.some(perm => permissions[perm] === true);
    };

    const hasAllPermissions = (permissionArray) => {
        if (userRole === 'super_admin') return true;
        return permissionArray.every(perm => permissions[perm] === true);
    };

    return {
        permissions,
        userRole,
        isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isSuperAdmin: userRole === 'super_admin'
    };
};