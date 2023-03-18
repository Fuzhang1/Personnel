import { Button, Form, Input} from 'antd';
import React from 'react';
import { Info } from '../../types';
import AddButton from '../AddButton';
import './index.css'

interface Props{
  addInfo:(info:Info)=>void
  search:(name:string)=>void,
  restart:()=>void
}



const SearchForm: React.FC<Props> = ({addInfo,search,restart}) => {
  const [form] = Form.useForm()

  return (
    <Form className='fromToSearch'
      layout={'inline'}
      form={form}
      initialValues={{ layout: 'inline '}}
    >
      <Form.Item>
        <AddButton addInfo={addInfo}></AddButton>
      </Form.Item>
      <Form.Item name="name">
        <Input type="textarea"  placeholder="请输入查询内容"/>
      </Form.Item>
      <Form.Item>
        <Button 
          type="primary" 
          onClick={()=>{
            form
              .validateFields()
              .then(values => {
                search(values.name)
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
        }}>
          搜索
          </Button>
      </Form.Item>
      <Form.Item>
        <Button type="default" onClick={()=>{restart();form.resetFields()}}>重置</Button>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;