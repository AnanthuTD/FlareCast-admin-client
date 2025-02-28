import React from 'react';
import { Button, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import axiosInstance from '@/lib/axios';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { adminLogout } from '@/actions/adminActions';

const { Header } = Layout;

interface HeaderBarProps {
  collapsed: boolean;
  toggle: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, toggle }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleLogout = () => {
    dispatch(adminLogout);
    axiosInstance.get('/admin/auth/logout');
    router.push('/admin/signin');
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      <Button onClick={handleLogout} style={{ marginInline: 16 }} danger>
        Logout
      </Button>
    </Header>
  );
};

export default HeaderBar;
