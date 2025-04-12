import React, { useState, useMemo } from "react";
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
import { Layout, Menu, theme, Dropdown, Avatar, Space, Switch, Badge, ConfigProvider } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

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
  getItem(<Link to="/user">User</Link>, "2", <BookOutlined />),
  getItem(<Link to="/order">Order</Link>, "3", <OrderedListOutlined />),
  getItem(<Link to="/product">Product</Link>, "4", <UserOutlined />),
  getItem(<Link to="/team">Team</Link>, "5", <TeamOutlined />),
];

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { token } = theme.useToken();
  const location = useLocation();

  // Map pathname to menu key
  const selectedKey = useMemo(() => {
    const pathKeyMap: { [key: string]: string } = {
      '/': '1',
      '/user': '2',
      '/order': '3',
      '/product': '4',
      '/team': '5',
    };
    return pathKeyMap[location.pathname] || '1';
  }, [location.pathname]);

  const handleToggleTheme = (checked: boolean) => {
    setDarkMode(checked);
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

  const isDarkTheme = darkMode;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#FF99AA", // Màu hồng pastel đậm
          colorBgLayout: isDarkTheme ? "#141414" : "#f5f5f5",
          colorText: isDarkTheme ? "#f5f5f5" : "#333",
          fontSize: 14,
          size: 20,
        },
        components: {
          Layout: {
            headerBg: isDarkTheme ? "#141414" : "#ffffff",
            headerColor: isDarkTheme ? "#f5f5f5" : "#333333",
            footerBg: isDarkTheme ? "#141414" : "#ffffff",
            colorBgLayout: isDarkTheme ? "#1f1f1f" : "#f5f5f5",
            siderBg: isDarkTheme ? "#141414" : "#ffffff",
            triggerBg: "#FF99AA", // Màu hồng pastel cho trigger
            triggerColor: "#ffffff",
            boxShadow: "none",
          },
          Menu: {
            itemBg: isDarkTheme ? "#141414" : "#ffffff",
            itemSelectedBg: "#FF99AA", // Màu hồng pastel khi menu active
            itemSelectedColor: "#ffffff",
            colorBorder: "transparent",
          },
          Input: {
            colorBorder: isDarkTheme ? "#333" : "#dedede",
          },
          Card: {
            colorBorder: isDarkTheme ? "#333" : "#dedede",
            bodyPadding: 12,
            borderRadius: 8,
            boxShadow: isDarkTheme
              ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
              : "0px 0px 12px rgba(0, 0, 0, 0.1)",
          },
          Table: {
            colorBgBase: isDarkTheme ? "#141414" : "#ffffff",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          },
          Collapse: {
            headerBg: isDarkTheme ? "#141414" : "#fff",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", maxWidth: "100vw", overflowX: "hidden" }}>
        <Sider
          style={{
            borderRight: isDarkTheme ? "1px solid #141414" : "1px solid #dedede",
            overflow: "hidden",
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={200}
          collapsedWidth={80}
        >
          <div
            className="demo-logo-vertical"
            style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Avatar size="large" style={{ cursor: "pointer" }} src="https://i.pravatar.cc/40" />
          </div>
          <Menu
            selectedKeys={[selectedKey]}
            mode="inline"
            items={items}
            style={{ borderRight: "none" }}
          />
        </Sider>
        <Layout style={{ width: collapsed ? "calc(100% - 80px)" : "calc(100% - 200px)" }}>
          <Header
            style={{

              padding: "0 20px",
              background: darkMode ? "#141414" : "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div />
            <Space size="large">
              <Badge count={3}>
                <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
              </Badge>
              <Switch
                checked={darkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                onChange={handleToggleTheme}
              />
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <Avatar size="large" style={{ cursor: "pointer" }} src="https://i.pravatar.cc/40" />
              </Dropdown>
            </Space>
          </Header>
          <Content style={{ margin: "16px", minHeight: "calc(100vh - 128px)" }}>
            <Outlet />
          </Content>
          <Footer style={{ display: "flex", justifyContent: "center", background: darkMode ? "#141414" : "#ffffff", }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;