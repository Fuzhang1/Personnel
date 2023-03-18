import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { creatInfo, Info, Values } from '../../types';


interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  addInfo:(newinfo:Info)=>void;
}

interface Props{
  addInfo:(info:Info)=>void;
}



const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  addInfo,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  let emailPattern = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$")
  let numberPattern = new RegExp("^[0-9]*$")
  let namePattern = new RegExp('^([\u4e00-\u9fa5]{2,100}|[a-zA-Z.]{2,100})$')
  let spacePattern = new RegExp('^\\S*$')
  return (
    <Modal
      open={open}
      title="添加用户"
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            addInfo(creatInfo(values))
            onCreate(values);
            form.resetFields();
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
        initialValues={{ modifier: 'public' }}>
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
          rules={[{ required: true, message: '年级不能为空!' },
          {pattern:numberPattern,transform:(value=>value.trim()),message:'年级应当为数字'}]}>
          <Input type="textarea" />
        </Form.Item>
        <Form.Item 
          name="sex" 
          label="性别" 
          rules={[{ required: true, message: '性别不能为空!',}]}>
          <Select
                options={[
                  { value: '男',label: '男',},
                  { value: '女',label: '女',},
                ]}
          />
        </Form.Item>
        <Form.Item name="phone" 
          label="电话" 
          rules={[{ required: true, message: '电话不能为空!' },
          {len:11,message:'电话号码应为11位'},
          {pattern:numberPattern,message:'电话号码应该只由数字组成'}]}>
          <Input type="textarea" />
        </Form.Item>
        <Form.Item 
          name="email" 
          label="邮箱" 
          rules={[{ required: true, message: '邮箱不能为空!', },
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

const AddButton: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        + 添加用户
      </Button>
      <CollectionCreateForm
        open={open}
        addInfo={props.addInfo}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default AddButton;