import { Button, Drawer, Form, Input, notification, Select, Space } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    isOpenCreateModal: boolean;
    setIsOpenCreateModal: (v: boolean) => void;
    reload: () => void;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};

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

interface Role {
    _id: string;
    name: string;
}

const UserCreate = (props: IProps) => {
    const { isOpenCreateModal, setIsOpenCreateModal, reload } = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();




    const createUserApi = async (values: any) => {
        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    age: parseInt(values.age),
                    gender: values.gender === 'male' ? 'Nam' : 'Nữ',
                    address: values.address,
                    role: values.role,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: {
                        _id: "admin1",
                        email: "admin1@example.com"
                    },
                    updatedBy: {
                        _id: "admin1",
                        email: "admin1@example.com"
                    },
                }),
            });
            return await response.json();
        } catch (error) {
            return { message: "Lỗi khi tạo người dùng" };
        }
    };

    const onFinish = async (values: any) => {
        setIsLoading(true);
        const res = await createUserApi(values);
        setIsLoading(false);

        if (res && res.id) {
            api.success({
                message: "Thành công",
                description: "Tạo mới user thành công",
                placement: "topRight",
            });
            setIsOpenCreateModal(false);
            onReset();
            reload();
        } else {
            api.error({
                message: "Lỗi",
                description: res.message || "Không thể tạo người dùng",
                placement: "topRight",
            });
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <>
            {contextHolder}
            <Drawer
                title="Create user"
                open={isOpenCreateModal}
                onClose={() => setIsOpenCreateModal(false)}
                width={"60%"}
            >
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: "Tên không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email không được để trống" },
                            { type: "email", message: "Email không đúng định dạng" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Mật khẩu không được để trống" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: "Tuổi không được để trống" }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: "Giới tính không được để trống" }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Địa chỉ không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: "Vai trò không được để trống" }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">Người dùng</Select.Option>
                            <Select.Option value="moderator">Quản lý</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default UserCreate;