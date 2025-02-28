import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Divider, MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

const { Sider } = Layout;

export type MenuItem = Required<MenuProps>['items'][number];

type BaseSidebarProps = {
  title: string;
  collapsed: boolean;
  items: MenuItem[];
  accountMenuItems: MenuItem[];
};

const BaseSidebar: React.FC<BaseSidebarProps> = ({ title, collapsed, items, accountMenuItems }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(pathname);

  useEffect(() => {
    setActiveMenu(pathname);
  }, [pathname]);

  const handleMenuItemClick = (e: { key: string }) => {
    setActiveMenu(e.key);
    router.push(e.key);
  };

  return (
    <Sider
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{ height: '100vh' }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Typography.Title style={{ paddingLeft: 3 }} level={3} className='justify-center flex items-center'>
          {title}
        </Typography.Title>
        <div style={{ overflowY: 'auto', paddingBottom: '5rem' }} className="hidden-scrollbar">
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            items={items}
            onClick={handleMenuItemClick}
          />
          <Divider>Accounts</Divider>
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            items={accountMenuItems}
            onClick={handleMenuItemClick}
          />
        </div>
      </div>
    </Sider>
  );
};

export default BaseSidebar;
