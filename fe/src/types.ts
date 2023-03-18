import { v4 } from "uuid";
import { faker } from '@faker-js/faker';

export interface Values {
  avg: string;
  name: string;
  major: string;
  grade: number;
  sex: string;
  phone: string;
  email: string;
}

export interface Info {
  key: string;//
  avg: string;//头像
  name: string;//姓名
  major: string;//专业
  grade: number;//年级
  sex: string;//性别
  phone: string;//电话
  email: string;//邮箱
}

export function creatInfo(values:Values){
  return {
    key:v4(),
    avg:(!values.avg||values.avg.trim()==='')?faker.image.food(1234,1234,true):values.avg.trim(),
    name:values.name.trim(),
    major: values.major.trim(),
    grade: values.grade,
    sex: values.sex.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
  }
}

export function searchByKey(key:string,List:Info[]){
  for(let i=0;i<List.length;i++){
    if(List[i].key===key){
      return i;
    }
  }
  return -1;
}
