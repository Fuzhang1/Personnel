import { Collapse } from 'antd';
import React from 'react';
import './index.css'

const { Panel } = Collapse;

const text1:string = `
    1.人员管理\t2.用户添加\t3.用户编辑\t4.用户删除
    5.详情信息\t6.姓名搜索\t7.搜索重置\t8.性别筛选
`;

const text2:string = `
    1.姓名:仅由中文或英文组成且不包含数字，数量上起码有2个字以上但不能过长\t
    2.年级:年级应为一个数字，不允许出现空格\t
    3.性别:性别应为男或女\t
    4.电话:电话应为11位数字\t
    5.邮箱应符合地址@域名的格式\t
    6.头像:头像若不填写则使用系统自动赋予的头像\t
`;

const text3:string = `
    1.数据请求: 数据请求采用了根据分页从后台请求对应数据的方法，而非直接获取整个列表
    2.性别筛选: 可以在性别栏处根据男女来进行用户的筛选
    3.输入校验: 在表单项中实现了较为完备的输入校验。
    4.权限处理: 当未登录的用户直接通过输入路由Main进入主页时，会被导向Login页面
    5.Session外部存储: 将session列表的内容写入了文件中,避免了列表过长时cookie超过4096字节而导致的列表不能加载的问题。
      具体实现为当列表为空时,从文件中读入初始化Session,在Session列表修改时,同时修改相关文件。
    6.数据分离: 不同账号之间存储的数据是各自独立的(root与admin两个账号)。
`;

const About: React.FC = () => (
    <div className='about'>
        <Collapse accordion >
            <Panel header="实现功能" key="1">
            <p>{text1}</p>
            </Panel>
            <Panel header="输入校验" key="2">
            <p>{text2}</p>
            </Panel>
            <Panel header="亮点" key="3">
            <p>{text3}</p>
            </Panel>
        </Collapse>
    </div>
);

export default About;