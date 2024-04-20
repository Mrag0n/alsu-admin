import { useRouter } from 'next/router';
import { Layout, Menu, Button } from 'antd/lib';
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

  // Определяем элементы меню с помощью свойства `items`
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
    // Добавьте дополнительные элементы по мере необходимости
  ];

  // Вспомогательная функция для получения текущего активного ключа
  const getSelectedKeys = (): string[] => {
    return [router.pathname];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header"></Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            items={items} // используем `items` вместо `children`
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout>{children}</Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
