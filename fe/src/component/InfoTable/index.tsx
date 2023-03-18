import {Avatar,Table,Tag} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterValue } from 'antd/lib/table/interface';
import React, { useState } from 'react';
import { addInfo, deleteInfo, getData,searchBySex,searchInfo,updateInfo} from '../../service/api';
import {Info, searchByKey } from '../../types';
import SearchForm from '../SearchForm';
import SetButton from '../SetButton';

const InfoTable: React.FC = () =>{
  //sexFilter用于表示当前的筛选状态，0代表未筛选或全筛选，1代表筛选男，2代表筛选女
  const [sexFilter,setSexFilter] = useState(0)

  //filterValue用于表示filters的状态，loading用来表示刷新状态
  const [filterValue,setFilterValue] = useState<FilterValue|null>()
  const [loading,setLoading] = useState(false)

  //用于记录页码，实现分页请求
  const [page,setPage] = useState(1)
  const [totalnum,setTotalnum] = useState(10)
  //搜索相关逻辑
  //sf为是否搜索的标志 
  const [sf,setSf] = useState(false)


  //列表相关逻辑
  const [temp,setTemp] = useState(0)
  const[infoList,setInfoList] = useState<Info[]>([]); 
  //通过特判逃出useState钩子的无限循环
  if(temp === 0) {
    console.log(1);
    
    getData(1)
      .then(res=>{
        setInfoList(res.data.list)
        setTotalnum(res.data.total)       
      })
    setTemp(1)
  }

  

  const addList=(info:Info)=>{
    if(sf === false){
      infoList.push(info)
      setTotalnum(totalnum+1)
      if(page === (Math.trunc(totalnum/5)+1)) setInfoList([...infoList]);
      addInfo(info)
    }
    else{
      addInfo(info)
        .then(()=>getData(1))
        .then(res=>{
          setInfoList(res.data.list)
          setTotalnum(res.data.total)
        })
      setSf(false)
    }
  }

  const updateList=(oldInfo:Info,newInfo:Info)=>{
    if(sf === false){
      let index = searchByKey(oldInfo.key,infoList)
      infoList[index] = newInfo
      //set后数据刷新弹窗关闭
      setInfoList([...infoList])
      console.log(1);
      
      updateInfo(oldInfo,newInfo)
    }
    else{
      updateInfo(oldInfo,newInfo)
      let nindex = searchByKey(oldInfo.key,infoList)
      infoList[nindex] = newInfo
      console.log(2);
      
      setInfoList([...infoList])
    }
    
  }

  const deleteList=(info:Info)=>{
    if(sf === false){
      let index = searchByKey(info.key,infoList)
      infoList.splice(index,1)
      deleteInfo(info).then(()=>getData(page)).then(res=>setInfoList(res.data.list))
    }
    else{
      //处理完整数据
      deleteInfo(info)
      //处理搜索数据
      let nindex = searchByKey(info.key,infoList)
      infoList.splice(nindex,1)
      setInfoList([...infoList])
    }
    setTotalnum(totalnum-1)
  }

  const search = (name:string)=>{
    //此处默认什么都不搜索为重置
    if(!!name){
      setSf(true)
      setPage(1)
      searchInfo(name)
      .then(res=>{
        setInfoList(res.data.list)
        setTotalnum(res.data.total)
      })
    }
    else{
      if(sf === true) getData(1).then(res=>setInfoList(res.data.list))
      setSf(false)
    }
  }

  const restart = ()=>{
    //重置:设置loading，情况搜索，回到第一页，请求数据
    setFilterValue(null)
    setSexFilter(0)
    setSf(false)
    getData(1).then(res=>{
      setInfoList(res.data.list)
      setTotalnum(res.data.total)
    })
    setPage(1)
  }

  const columns: ColumnsType<Info> = [
    {
      title: '头像',
      dataIndex: 'avg',
      key: 'key',
      width:128,
      render:(_,{avg})=><Avatar shape="square" size={64} src={avg} />
    }, 
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'key',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'key',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'key',
    },
    {
      title: '性别',
      key: 'key',
      dataIndex: 'sex',
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      filteredValue: filterValue||null,
      render:(_, { sex })=>{
        let color:string = sex==='男'?'blue':'red'
        return(
          <Tag color={color}>
              {sex}
          </Tag>
        )
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'key',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'key',
    },
    {
      title: '操作',
      key: 'key',
      //第三个参数才是列表下标
      render:(text, record)=>{
       return <SetButton info={record} updateList={updateList} deleteList={deleteList}></SetButton>},
    }
  ];


  return (
    <>
      <div>
        <SearchForm addInfo={addList} search={search} restart={restart}></SearchForm>
      </div>
      <div>
        <Table columns={columns} dataSource={infoList} className="tablebox" loading={loading}
          pagination={
            { pageSize:5,
              current:page,
              total:totalnum,
              showSizeChanger:false,
              onChange:(page)=>{
                setPage(page)
                if(sf===false) {
                  getData(page).then(res=>{setInfoList(res.data.list)})
                }}}}
            onChange={
              (pagination, filters, sorter, extra)=>{
                setFilterValue(filters.key)
                if(extra.action === 'filter'){                  
                  let sexStatus = -1    
                  if(filters.key?.length===1){
                    if(filters.key[0]==='男'){
                      sexStatus = 1//筛选为男，状态为1
                    } else{
                      sexStatus = 2//筛选为女，状态为2
                    }
                  } else{
                      sexStatus = 0//为不筛选，状态为0
                  }
                  if(sexStatus !== sexFilter){
                    setLoading(true)
                    setSexFilter(sexStatus)
                    if(sexStatus === 0) {restart();setLoading(false)}
                    else{
                      setSf(true)
                      searchBySex(sexStatus)
                        .then(res=>{setInfoList(res.data.list);setTotalnum(res.data.total);setLoading(false)})
                    }           
                  }
                }
              }}/>
      </div>
    </>
    
  );
}

export default InfoTable;