import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import "./index.css"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toLogin, User } from '../../service/api';

const Login: React.FC = () => {
  const nav = useNavigate()
  const [hidden,setHidden] = useState('none')
  const onFinish = (values: any) => {
    let user:User = {username:values.username,password:values.password}
    
    let status:number
    toLogin(user)
        .then(res=>status=res.data.code)
        .then(()=>{
            if(status === 1){
                nav('/Main')
            }
            else{
                setHidden('block')
            }
    })
  };



  return (
    <div id='app'>
        <Card className='login-card'>
                <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}>
                <Form.Item className='title'>
                登录
                </Form.Item> 
                <div className='error' style={{display:hidden}}>账号密码错误,请重新输入</div> 
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入您的账号!' },{validateTrigger:'onFinish'}]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入您的密码!' }]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" >
                    登录
                    </Button>
                </Form.Item>
                </Form>
            </Card>
    </div>
    
  );
};

export default Login;