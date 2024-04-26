import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Layout, Menu } from 'antd/lib';
import {
  DashboardOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons/lib';

const { Content, Footer, Sider } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

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

  const logoSize = collapsed ? 40 : 60;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <Image
              width={logoSize}
              height={logoSize}
              src="/images/logo.svg"
              alt="logo"
            />
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>{children}</Content>
          <Footer style={{ textAlign: 'center' }}>
            Alsu ©{new Date().getFullYear()} Created by Alsu Agency
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
