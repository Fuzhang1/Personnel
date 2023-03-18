import { Avatar, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {toLogout } from '../../service/api';


interface Props{
    user:string
}

const ExitAvg:React.FC<Props> = ({user})=>{

    const nav = useNavigate()
    const handleMenuClick: MenuProps['onClick'] = () => {
        toLogout()
        nav('/')
    };
    
    const items: MenuProps['items'] = [
    {
        label: '退出登录',
        key: '0',
    },
    ];
    
    const menuProps = {
    items,
    onClick: handleMenuClick,
    };

    return(
        <Dropdown menu={menuProps} placement="bottom">
            <Avatar size={40} style={{fontWeight:"bolder"}} >{user}</Avatar>
        </Dropdown>
    )
}

export default ExitAvg