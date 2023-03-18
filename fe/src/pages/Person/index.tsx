import { Breadcrumb } from 'antd';
import React, { useState } from 'react';
import { Link, useParams} from 'react-router-dom';
import { getInfo } from '../../service/api';
import './index.css'

type Params = {
  key:string
}

const Person: React.FC = () => {
  const params = useParams<Params>()
   const [info,setInfo] = useState({
        key:"-1",
        avg:"https://loremflickr.com/640/480/food",
        name:"wait",
        major: "wait",
        grade: 2020,
        sex: "wait",
        phone: "wait",
        email: "wait",
    })
    if(info.key === '-1'){
        getInfo(params.key as string)
        .then(res=>{
            setInfo(res.data.Info)
            })
    }
   
  return(
    <>
      <Breadcrumb className='bread'>
          <Breadcrumb.Item>
              <Link to='/Main'>人员管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <div className='box'>
          <div className='infobox'>
              <div className="smallbox">
                  <div className="des">
                      头像:
                  </div>
                  <img style={{width:100,height:100,objectFit:'contain'}} src={info.avg} alt=""/>
              </div>
              <div className="smallbox">
                  <div className="des">
                      姓名:
                  </div>
                  {info.name}
              </div>
              <div className="smallbox">
                  <div className="des">专业:</div>
                  {info.major}
              </div>
              <div className="smallbox">
                  <div className="des">年级:</div>
                  {info.grade}
              </div>
              <div className="smallbox">
                  <div className="des">性别:</div>
                  {info.sex}
              </div>
              <div className="smallbox">
                  <div className="des">电话:</div>
                  {info.phone}
              </div>
              <div className="smallbox">
                  <div className="des">邮箱:</div>
                  {info.email}
              </div>
          </div>
      </div>    
    </>
  );
}
export default Person;