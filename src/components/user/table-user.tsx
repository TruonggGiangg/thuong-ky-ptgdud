import React, { useRef } from 'react';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Card, Typography, Button, Space, message, Dropdown } from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

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
    const actionRef = useRef<ActionType | null>(null);

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
                transform: (value) => ({ email: value }), // Định dạng lại dữ liệu gửi lên API
            },
        },
        {
            title: 'Tuổi',
            dataIndex: 'age',
            sorter: true,

            hideInSearch: true,
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
                Khác: { text: 'Khác' },
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
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            ellipsis: true,
            search: false,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ',
                    },
                ],
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,

            hideInSearch: true,
            render: (_: any, record: User) => formatDate(record.createdAt),
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
            render: (_: any, record: User) => formatDate(record.updatedAt),
        },
        {
            title: 'Thời gian tạo/cập nhật',
            dataIndex: 'createdAt',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => ({
                    startTime: value[0],
                    endTime: value[1],
                }),
            },
            hideInSearch: true,
        },
        {
            title: 'Hành động',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record._id);
                    }}
                >
                    Sửa
                </a>,
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => {
                        if (key === 'delete') {
                            message.success(`Đã xóa ${record.name}`);
                            action?.reload();
                        }
                    }}
                    menus={[
                        { key: 'delete', name: 'Xóa' },
                        { key: 'delete', name: 'Xem chỉ tiết' },
                    ]}
                />,
            ],
        },
    ];

    // Request handler with fuzzy search
    // const requestTableData = async (params: {
    //     pageSize?: number;
    //     current?: number;
    //     name?: string;
    //     email?: string;
    //     startTime?: string;
    //     endTime?: string;
    //     gender?: string;
    //     role?: string;
    //     [key: string]: any;
    // }) => {
    //     try {
    //         const response = await axios.get<PaginatedResponse>(
    //             'http://localhost:8080/users',
    //             {
    //                 params: {
    //                     _page: params.current,
    //                     _per_page: params.pageSize,
    //                     // Use _like for fuzzy search (assumes API support, e.g., json-server)
    //                     ...(params.name && { name_like: params.name }),
    //                     ...(params.email && { email_like: params.email }),
    //                     ...(params.startTime && { startTime: params.startTime }),
    //                     ...(params.endTime && { endTime: params.endTime }),
    //                     ...(params.gender && params.gender !== 'all' && { gender: params.gender }),
    //                     ...(params.role && params.role !== 'all' && { role: params.role }),
    //                 },
    //             }
    //         );
    //         const { data, items } = response.data;
    //         console.log('Fetched users:', data);
    //         return {
    //             data,
    //             success: true,
    //             total: items,
    //         };
    //     } catch (error) {
    //         message.error('Không thể tải dữ liệu người dùng');
    //         console.error('Error fetching user data:', error);
    //         return {
    //             data: [],
    //             success: false,
    //             total: 0,
    //         };
    //     }
    // };

    // Client-side fuzzy search alternative (uncomment if API doesn't support _like)

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
            // Fetch all data or current page without name/email filters
            const response = await axios.get<PaginatedResponse>(
                'http://localhost:8080/users',
                {
                    params: {
                        _page: params.current,
                        _per_page: params.pageSize,
                        ...(params.startTime && { startTime: params.startTime }),
                        ...(params.endTime && { endTime: params.endTime }),
                        ...(params.gender && params.gender !== 'all' && { gender: params.gender }),
                        ...(params.role && params.role !== 'all' && { role: params.role }),
                    },
                }
            );
            let { data, items } = response.data;

            // Apply fuzzy search client-side
            if (params.name || params.email) {
                data = data.filter((user) => {
                    const nameMatch = params.name
                        ? user.name.toLowerCase().includes(params.name.toLowerCase())
                        : true;
                    const emailMatch = params.email
                        ? user.email.toLowerCase().includes(params.email.toLowerCase())
                        : true;
                    return nameMatch && emailMatch;
                });
                // Adjust total to reflect filtered results (approximation)
                items = data.length;
            }

            console.log('Fetched users:', data);
            return {
                data,
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


    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', color: '#1a1a1a' }}>
                📋 Bảng người dùng
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
                    scroll={{ x: 1000 }}
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={requestTableData}

                    rowKey="_id"
                    search={{
                        labelWidth: 'auto',
                        defaultCollapsed: false,
                    }}
                    options={{

                        fullScreen: true,
                        density: true,
                        // setting: {
                        //     listsHeight: 400,
                        // },
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
                        pageSize: 2, // Match API's default _per_page
                        showSizeChanger: true,
                        pageSizeOptions: ['2', '5', '10'],
                        onChange: (page) => console.log('Page:', page),
                    }}
                    dateFormatter="string"
                    headerTitle="Danh sách người dùng"
                    toolBarRender={() => [
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                message.info('Chức năng thêm mới đang phát triển');
                            }}
                            type="primary"
                        >
                            Thêm mới
                        </Button>,
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