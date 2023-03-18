import { Button, Dropdown, Form, Input, MenuProps,Modal, Select} from "antd"
import React, {  useState } from "react"
import { useNavigate } from "react-router-dom";
import { creatInfo, Info } from "../../types";
import { SettingOutlined} from '@ant-design/icons';

// interface Values {
//   title: string;
//   description: string;
//   modifier: string;
// }

//编辑弹窗
interface UpdateFormFormProps {
  open: boolean;
  onCancel: () => void;
  info:Info,
  update:(oldInfo:Info,newInfo:Info)=>void,
}

const UpdateForm: React.FC<UpdateFormFormProps> = ({open,onCancel,info,update}) => {
  const [form] = Form.useForm();
  let emailPattern = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$")
  let numberPattern = new RegExp("^[0-9]*$")
  let namePattern = new RegExp('^([\u4e00-\u9fa5]{2,100}|[a-zA-Z.]{2,100})$')
  let spacePattern = new RegExp('^\\S*$')
  return (
    <Modal
      open={open}
      title="编辑用户"
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            let oldInfo = info
            let newInfo = creatInfo(values)
            update(oldInfo,newInfo)
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        name="form_in_modal"
        labelCol={{span:3}}
        initialValues={info}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '姓名不能为空!' },
          {pattern:namePattern,message:'姓名不符合规范！(如姓名中不应有数字，不应中英文混用，且起码有两字)'},
          {pattern:spacePattern,message:"姓名不应包含空格"}]}>
          <Input />
        </Form.Item>
        <Form.Item name="major" 
          label="专业" 
          rules={[{ required: true, message: '专业不能为空!' },{pattern:spacePattern,message:'专业不应包含空格'}]}>
          <Input type="textarea" />
        </Form.Item>
        <Form.Item 
          name="grade" 
          label="年级" 
          rules={[{ required: true, message: '年级不能为空!',transform:(value=>value.trim()) },
          {pattern:numberPattern,transform:(value=>value.trim()),message:'年级应当为数字'}]}>
          <Input type="textarea" />
        </Form.Item>
        <Form.Item 
          name="sex" 
          label="性别" 
          rules={[{ required: true, message: '性别不能为空!',transform:(value=>value.trim()) },]}>
          <Select
                options={[
                  { value: '男',label: '男',},
                  { value: '女',label: '女',},
                ]}
          />
        </Form.Item>
        <Form.Item name="phone" 
          label="电话" 
          rules={[{ required: true,transform:(value=>value.trim()), message: '电话不能为空!' },
          {len:11,message:'电话号码应为11位',transform:(value=>value.trim())},
          {pattern:numberPattern,transform:(value=>value.trim()),message:'电话号码应该只由数字组成'}]}>
          <Input type="textarea" />
        </Form.Item>
        <Form.Item 
          name="email" 
          label="邮箱" 
          rules={[{ required: true, message: '邮箱不能为空!',transform:(value=>value.trim()) },
          {pattern:emailPattern,message:'邮箱格式应为名称@域名,且不应包含中文字符',transform:(value=>value.trim())}]}>
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="avg" label="头像">
          <Input type="textarea" placeholder="头像若不填则由系统自动生成"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};
  
//删除弹窗
const { confirm } = Modal;




interface SBProps{
  info:Info,
  updateList:(oldInfo:Info,newInfo:Info)=>void,
  deleteList:(info:Info)=>void,
}

const SetButton:React.FC<SBProps> = ({info,updateList,deleteList})=>{
  const nav = useNavigate()
  //编辑弹窗相关逻辑
  const [openUpdate, setOpenUpdate] = useState(false);

  const onCancelUpdate = ()=>{
    setOpenUpdate(false)
  }

  const showDeleteCom = ()=>{
    confirm({
      title: '提示',
      // icon: <ExclamationCircleOutlined />,
      content: `你确定要删除用户${info.name}吗？`,
      onOk() {
        deleteList(info);
      },
      okText:"确认",
      cancelText:"取消"

    })
  }

  const handleMenuClick: MenuProps['onClick'] = ({key}) => {
    if(key === '0'){
      //采用key而非index的原因：为了后期建立查询功能时易于维护
      nav(`/Main/Person/${info.key}`)
    }
    else if(key === '1'){
      setOpenUpdate(true)
    }
    else if(key === '2'){
      showDeleteCom()
    }
  };

 

  
  const items: MenuProps['items'] = [
    {
      label: '查看',
      key: '0',
    },
    {
      label: '编辑',
      key: '1',
    },
    {
      label: '删除',
      key: '2',
    },
  ];
  
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

    return (
      <Dropdown menu={menuProps}>
        <Button>
            <SettingOutlined />
            <UpdateForm info={info} update={updateList}
             open={openUpdate} onCancel={onCancelUpdate}></UpdateForm> 
        </Button>
      </Dropdown>
    )
}

export default SetButton