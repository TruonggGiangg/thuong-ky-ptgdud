import React, { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Card, Typography, Button, Space, message, Dropdown, Popconfirm } from 'antd';
import { PlusOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import UserCreate from './create-user';
import UserDetail from './detail-user';

// Enable plugins for date range filtering
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title } = Typography;

// Interfaces for type safety
interface Admin {
    _id: string;
    email: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    address: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    createdBy: Admin;
    updatedBy: Admin;
    password: string;
    id: string;
}

interface PaginationMeta {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    current: number;
    pageSize: number;
}

interface PaginatedResponse {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: User[];
}

// Consistent color palette
const COLOR_PALETTE = {
    primary: '#1890FF',
    secondary: '#FF6B6B',
};

const TableUser: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
    const [dataDetailModal, setDataDetailModal] = useState<User | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
        first: 1,
        prev: null,
        next: null,
        last: 1,
        pages: 1,
        items: 0,
        current: 1,
        pageSize: 5,
    });

    // Validate and format date
    const formatDate = (date: string | undefined | null): string => {
        if (!date) {
            console.warn('Date is null or undefined:', date);
            return 'N/A';
        }
        const parsedDate = dayjs(date);
        if (!parsedDate.isValid()) {
            console.warn('Invalid date detected:', date);
            return 'N/A';
        }
        return parsedDate.format('DD/MM/YYYY HH:mm');
    };

    // Update user via API
    const updateUser = async (record: User) => {
        try {
            const response = await axios.put(`http://localhost:8080/users/${record.id}`, {
                ...record,
                updatedAt: new Date().toISOString(),
                updatedBy: {
                    _id: "admin1",
                    email: "admin1@example.com",
                },
            });
            if (response.status === 200) {
                message.success('Cập nhật người dùng thành công');
                return true;
            }
            return false;
        } catch (error) {
            message.error('Cập nhật người dùng thất bại');
            console.error('Error updating user:', error);
            return false;
        }
    };

    // Delete single user
    const deleteUser = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/users/${id}`);
            if (response.status === 200) {
                message.success('Xóa người dùng thành công');
                reload();
            }
        } catch (error) {
            message.error('Xóa người dùng thất bại');
            console.error('Error deleting user:', error);
        }
    };

    // Delete multiple users
    const deleteMultipleUsers = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một người dùng để xóa');
            return;
        }
        try {
            await Promise.all(
                selectedRowKeys.map((id) =>
                    axios.delete(`http://localhost:8080/users/${id}`)
                )
            );
            message.success(`Xóa ${selectedRowKeys.length} người dùng thành công`);
            setSelectedRowKeys([]);
            reload();
        } catch (error) {
            message.error('Xóa nhiều người dùng thất bại');
            console.error('Error deleting multiple users:', error);
        }
    };

    // Define columns
    const columns: ProColumns<User>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true,
            tooltip: 'Tên người dùng',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng nhập tên',
                    },
                ],
            },
            search: {
                transform: (value) => ({ name: value }), // Định dạng lại dữ liệu gửi lên API
            },
            editable: () => true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng nhập email',
                    },
                    {
                        type: 'email',
                        message: 'Email không hợp lệ',
                    },
                ],
            },
            search: {
                transform: (value) => ({ email: value }),
            },
            editable: () => true,
        },
        {
            title: 'Tuổi',
            dataIndex: 'age',
            valueType: 'digit',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng nhập tuổi',
                    },
                ],
            },
            hideInSearch: true,
            editable: () => true,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            filters: true,
            onFilter: true,
            valueType: 'select',
            valueEnum: {
                all: { text: 'Tất cả' },
                Nam: { text: 'Nam' },
                Nữ: { text: 'Nữ' },
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng chọn giới tính',
                    },
                ],
            },
            hideInSearch: true,
            editable: () => true,
            fieldProps: {
                options: [
                    { label: 'Nam', value: 'Nam' },
                    { label: 'Nữ', value: 'Nữ' },
                ],
            },
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            filters: true,
            onFilter: true,
            valueType: 'select',
            valueEnum: {
                all: { text: 'Tất cả' },
                user: { text: 'Người dùng', status: 'Default' },
                moderator: { text: 'Quản lý', status: 'Processing' },
                admin: { text: 'Admin', status: 'Success' },
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng chọn vai trò',
                    },
                ],
            },
            hideInSearch: true,
            editable: () => true,
            fieldProps: {
                options: [
                    { label: 'Người dùng', value: 'user' },
                    { label: 'Quản lý', value: 'moderator' },
                    { label: 'Admin', value: 'admin' },
                ],
            },
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ',
                    },
                ],
            },
            hideInSearch: true,
            editable: () => true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            hideInSearch: true,
            render: (_: any, record: User) => formatDate(record.createdAt),
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
            hideInSearch: true,
            render: (_: any, record: User) => formatDate(record.updatedAt),
        },
        {
            title: 'Hành động',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    Sửa
                </a>,
                <a
                    key="detail"
                    onClick={() => {
                        setDataDetailModal(record);
                        setIsOpenDetailModal(true);
                    }}
                >
                    Chi tiết
                </a>,
                <Popconfirm
                    key="delete"
                    title="Bạn có chắc muốn xóa người dùng này?"
                    onConfirm={() => deleteUser(record.id)}
                    okText="Có"
                    cancelText="Không"
                >
                    <a style={{ color: COLOR_PALETTE.secondary }}>Xóa</a>
                </Popconfirm>,
            ],
        },
    ];

    // Fetch data from API
    const requestTableData = async (params: {
        pageSize?: number;
        current?: number;
        name?: string;
        email?: string;
        startTime?: string;
        endTime?: string;
        gender?: string;
        role?: string;
        [key: string]: any;
    }) => {
        try {
            const pageSize = params.pageSize || paginationMeta.pageSize;
            const currentPage = params.current || paginationMeta.current;

            const response = await axios.get<PaginatedResponse>(
                'http://localhost:8080/users',
                {
                    params: {
                        _page: currentPage,
                        _per_page: pageSize,
                        ...(params.name && { name_like: params.name }),
                        ...(params.email && { email_like: params.email }),
                        ...(params.startTime && { startTime: params.startTime }),
                        ...(params.endTime && { endTime: params.endTime }),
                        ...(params.gender && params.gender !== 'all' && { gender: params.gender }),
                        ...(params.role && params.role !== 'all' && { role: params.role }),
                    },
                }
            );
            const { data, first, prev, next, last, pages, items } = response.data;

            // Update pagination meta
            setPaginationMeta({
                first,
                prev,
                next,
                last,
                pages,
                items,
                current: currentPage,
                pageSize,
            });

            // Client-side fuzzy search if API doesn't support _like
            let filteredData = data;
            // Apply fuzzy search client-side with string handling
            if (params.name || params.email) {
                const nameQuery = params.name?.trim().toLowerCase();
                const emailQuery = params.email?.trim().toLowerCase();

                filteredData = data.filter((user) => {
                    const nameMatch = nameQuery
                        ? user.name.toLowerCase().includes(nameQuery)
                        : true;
                    const emailMatch = emailQuery
                        ? user.email.toLowerCase().includes(emailQuery)
                        : true;
                    return nameMatch && emailMatch;
                });
                // Keep original items as total; filtering only affects current page data
            }

            console.log('Fetched users:', filteredData, 'Pagination meta:', {
                first,
                prev,
                next,
                last,
                pages,
                items,
            });
            return {
                data: filteredData,
                success: true,
                total: items,
            };
        } catch (error) {
            message.error('Không thể tải dữ liệu người dùng');
            console.error('Error fetching user data:', error);
            return {
                data: [],
                success: false,
                total: 0,
            };
        }
    };

    const reload = () => {
        actionRef.current?.reload();
    };

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <UserCreate
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
                reload={reload}
            />
            <UserDetail
                isOpenDetailModal={isOpenDetailModal}
                setIsOpenDetailModal={setIsOpenDetailModal}
                dataDetailModal={dataDetailModal}
                setDataDetailModal={setDataDetailModal}
            />
            <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', color: '#1a1a1a' }}>
                Bảng người dùng
            </Title>
            <Card
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                hoverable
            >
                <ProTable<User>
                    direction='ltr'
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={requestTableData}
                    editable={{
                        type: 'single',
                        onSave: async (key, record) => {
                            return await updateUser(record);
                        },
                        actionRender: (row, config, defaultDoms) => [
                            defaultDoms.save,
                            defaultDoms.cancel,
                        ],
                    }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (newSelectedRowKeys) => {
                            setSelectedRowKeys(newSelectedRowKeys);
                        },
                    }}
                    rowKey="id"
                    search={{
                        labelWidth: 'auto',
                        defaultCollapsed: false,
                    }}
                    options={{
                        density: true,
                    }}
                    form={{
                        syncToUrl: (values, type) => {
                            if (type === 'get') {
                                return {
                                    ...values,
                                    createdAt: [values.startTime, values.endTime],
                                };
                            }
                            return values;
                        },
                    }}
                    pagination={{
                        pageSize: paginationMeta.pageSize,
                        showSizeChanger: true,
                        total: paginationMeta.items,
                        current: paginationMeta.current,
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên tổng {total} người dùng
                            </div>
                        ),
                        onChange: (page, pageSize) => {
                            setPaginationMeta((prev) => ({
                                ...prev,
                                current: page,
                                pageSize,
                            }));
                        },
                    }}
                    dateFormatter="string"
                    headerTitle="Danh sách người dùng"
                    toolBarRender={() => [
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setIsOpenCreateModal(true);
                            }}
                            type="primary"
                        >
                            Thêm mới
                        </Button>,
                        <Popconfirm
                            key="delete-selected"
                            title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} người dùng?`}
                            onConfirm={deleteMultipleUsers}
                            okText="Có"
                            cancelText="Không"
                            disabled={selectedRowKeys.length === 0}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                disabled={selectedRowKeys.length === 0}
                            >
                                Xóa đã chọn
                            </Button>
                        </Popconfirm>,
                        <Dropdown
                            key="menu"
                            menu={{
                                items: [
                                    { label: 'Xuất Excel', key: 'export' },
                                    { label: 'Tải lại', key: 'reload', onClick: () => actionRef.current?.reload() },
                                ],
                            }}
                        >
                            <Button>
                                <EllipsisOutlined />
                            </Button>
                        </Dropdown>,
                    ]}
                    sticky
                    locale={{
                        emptyText: 'Không có dữ liệu',
                    }}
                />
            </Card>
        </div>
    );
};

export default TableUser;