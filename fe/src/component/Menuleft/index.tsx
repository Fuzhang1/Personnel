import { UserOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps} from 'antd';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('人员管理', '1', <UserOutlined />),
  getItem('关于', '2', <QuestionCircleOutlined />),
];

const Menuleft: React.FC = () => {
  const [current, setCurrent] = useState('1')
  const nav = useNavigate()
  
  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e)
    if(e.key !== current){
      if(e.key === '1'){
        nav('/Main')
      }
      else if(e.key === '2'){
        nav('/Main/About')
      }
      setCurrent(e.key)
    }
    
  };

  return (
      <Menu
        className='menuleft'
        theme={'dark'}
        onClick={onClick}
        defaultOpenKeys={['1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
  );
};

export default Menuleft;