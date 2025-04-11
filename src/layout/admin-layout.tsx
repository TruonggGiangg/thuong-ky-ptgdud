import React, { useState } from "react";
import {
  PieChartOutlined,
  BookOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Dropdown, Avatar, Space, Switch, Badge } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <PieChartOutlined />),
  getItem(<Link to="/product">Product</Link>, "2", <BookOutlined />),
  getItem("Order", "3", <OrderedListOutlined />),
  getItem("User", "4", <UserOutlined />),
  getItem("Team", "5", <TeamOutlined />),
];

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { token } = theme.useToken();

  const handleToggleTheme = (checked: boolean) => {
    setDarkMode(checked);
    // TODO: Cập nhật theme trong ConfigProvider nếu có
  };

  const userMenu = (
    <Menu
      items={[
        { key: "1", label: <Link to="/profile">Profile</Link> },
        { key: "2", label: <Link to="/settings">Settings</Link> },
        { key: "3", label: "Logout" },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Avatar size={"large"} style={{ cursor: "pointer" }} src="https://i.pravatar.cc/40" />
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>
      <Layout style={{ width: "100%" }}>
        {/* Header */}
        <Header
          style={{
            padding: "0 20px",
            background: token.colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Bên trái: Placeholder */}
          <div />

          {/* Bên phải: Nút thông báo, Dark Mode, Avatar */}
          <Space size="large">
            {/* Nút thông báo */}
            <Badge count={3}>
              <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
            </Badge>

            {/* Nút chuyển đổi Dark Mode */}
            {/* <Switch
              checked={darkMode}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              onChange={handleToggleTheme}
            /> */}

            {/* Avatar + Dropdown */}
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Avatar size={"large"} style={{ cursor: "pointer" }} src="https://i.pravatar.cc/40" />
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{ display: "flex", justifyContent: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
