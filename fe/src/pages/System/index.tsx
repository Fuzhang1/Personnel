import {Layout,PageHeader } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ExitAvg from '../../component/ExitAvg';
// import { useNavigate } from 'react-router-dom';
import Menuleft from '../../component/Menuleft';
import { getUser } from '../../service/api';
import './index.css'


const { Header, Sider, Content } = Layout;

const System: React.FC = () => {
  
  // const nav =useNavigate()
  // const back = ()=>{
  //   nav('/')
  // }
  const nav = useNavigate()
  const [user,setUser] = useState("")
  if(user === ""){
      getUser()
      .then(res=>{
          if(res.data.code === -1){
              nav('/')
          }
          else{
              setUser(res.data.user)
          }
      })
  }

  return(
    <Layout id='mainbox'>
      <Header>
        <PageHeader className='pagehead'
            ghost={false}
            title="人员管理系统"
            extra={[
              <div key={2} className='username'>{user}</div>,
              <ExitAvg user={user} key={3}/>,
            ]}
          >
        </PageHeader>
      </Header>
      <Layout>
        <Sider>
          <Menuleft></Menuleft>
        </Sider>
        <Content className='information'>
            <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
}
export default System;