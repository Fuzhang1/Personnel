import { Info } from "../types";
import axios from 'axios'

export async function getUser() {
    //获取当前的登录状态与用户名
    const res = await axios.get('/api/user/info')
    return res
}

export async function getData(page:number){
    //根据页码获取当前页面的数据
    const res = await axios.post('/api/stu/list',{page:page})
    return res
}

export async function getInfo(key:string) {
    //根据key获取对应项的数据
    const res = await axios.post('/api/stu/getone',{key:key})
    return res
}

export async function addInfo(info:Info){
    //往列表中加入信息
    const res = await axios.post('/api/stu/create',info)
    return res
}

export async function updateInfo(oldInfo:Info,newInfo:Info){
    //根据oldInfo更新列表信息
    const res = await axios.post('/api/stu/update',{key:oldInfo.key,newInfo:newInfo})
    return res
}

export async function deleteInfo(info:Info){
    //根据info删除列表信息
    const res = await axios.post('/api/stu/delete',{key:info.key})
    return res
}

export async function searchInfo(name:string) {
    //根据name查找信息
    const res = await axios.post('/api/stu/search',{name:name})
    return res    
}
  
export interface User{
    username:string,
    password:string
}

export async function toLogin(user:User){
    //登录
    const res = await axios.post('/api/user/login',user)
    return res
}

export async function toLogout(){
    //退出登录
    const res = await axios.post('/api/user/logout')
    return res
    
}

export async function getLogin(){
    //判断是否登录
    const res = await axios.get('/api/user/info')
    return res
    
}

export async function searchBySex(status:number) {
    //返回按照性别筛选后的列表，1为男，2为女
    const res = await axios.post('/api/stu/sex',{status:status})
    return res
}