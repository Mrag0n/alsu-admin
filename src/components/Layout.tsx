import React from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd/lib';
import {
  DashboardOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons/lib';

const { Header, Sider } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const router = useRouter();

  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => router.push('/'),
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
      onClick: () => router.push('/projects'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push('/settings'),
    },
  ];

  const getSelectedKeys = (): string[] => {
    return [router.pathname];
  };

  return (
    <Layout>
      <Header className="header"></Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            items={items}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout>{children}</Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
