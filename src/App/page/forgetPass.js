import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import { sendVc, forgetPwd } from '../api/index'
import Code from '../components/code';
import { goLink } from '../utils/common';

const {
    Buttons,
    Toaster,
    Header,
    Item,
    Row,
    Col,
    Icon,
    Modal,
    Input
  } = Components;
const { sessions, storage } = utils;
class ForgetPass extends Component {
    constructor(props) {
      super(props);
      this.state = {
          userInfo: storage.getStorage('userInfo') || {
            nickname: ''
          },
          phone: '',
          code: '',
          newPwd: ''
      };
    }
    componentDidMount(){
        let obg = UrlSearch();
    }

    setValue(key,val){
      this.setState({[key]: val});
    }
    sendCode(){
      const { phone } = this.state
      if(!phone&&phone==='') {
        Toaster.toaster({ type: 'normal', position: 'top', content: '请填写手机号', time: 3000 }, true);
        return false;
      }
      sendVc({
        "phoneNo": phone,
      }).then((res)=>{
        Toaster.toaster({ type: 'normal', position: 'top', content: '验证码已发送', time: 5000 });
      }).catch((err)=>{
        Toaster.toaster({ type: 'success', position: 'top', content: '验证码已发送', time: 5000 });
      })
    }
    bindUser(){
      const self = this;
      const { phone, code, newPwd } = this.state
      if(!phone&&phone==='') {
        Toaster.toaster({ type: 'normal', position: 'top', content: '请填写手机号', time: 3000 }, true);
        return false;
      }
      if(!code&&code==='') {
        Toaster.toaster({ type: 'normal', position: 'top', content: '请填写验证码', time: 3000 }, true);
        return false;
      }
      if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/.test(newPwd)) {
        Toaster.toaster({ type: 'normal', position: 'top', content: '新密码必须在6-12位之内，必须包含数字，大小写字母', time: 3000 }, true);
        return false;
      }
      forgetPwd({
        "phoneNo": phone,
        "newPwd": newPwd,
        "vc": code
      }).then((res)=>{
        console.log(res);
        if(res.code=='00000'){
          if(res.responseData&&res.responseData.userId){
            Toaster.toaster({ type: 'normal', position: 'top', content: '绑定成功', time: 5000 });
            storage.setStorage('userInfo', res.responseData);
            goLink('/RouteAll')
          }else{
            Toaster.toaster({ type: 'normal', position: 'top', content: '该账号未注册', time: 5000 });
          }
        }else{
          Toaster.toaster({ type: 'normal', position: 'top', content: res.msg, time: 5000 });
        }
      }).catch((err)=>{
        Toaster.toaster({ type: 'normal', position: 'top', content: JSON.stringify(err), time: 5000 });
      })
    }

    render() {
      const { phone, code, newPwd} = this.state;
      const self = this;
        return(
          <section className="bg-f5f5f5 heighth-90">
            <Row className="padding-all ">
                <Col span={24} className="padding-all-1r line-height-3r">忘记密码</Col>
                <Col span={24} className="bg-show margin-top-2 padding-all-1r border-radius-5f">
                  <Row className="border-bottom border-color-e5e5e5 padding-bottom-1r">
                      <Col span={3} className="padding-top-1 text-align-center">
                        <Icon iconName={'iphone'} size={'190%'} iconColor={'#6E9EFB'} /> 
                      </Col>
                      <Col span={21}>
                      <Input
                          value={phone}
                          placeholder="请输入用户名/手机号"
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setValue('phone',v)
                          }}
                          />
                      </Col>
                  </Row>
                  <Row className="margin-top-1r border-bottom border-color-e5e5e5 padding-bottom-1r">
                      <Col span={3} className="padding-top-1 text-align-center">
                        <Icon iconName={'android-lock '} size={'190%'} iconColor={'#6E9EFB'} /> 
                      </Col>
                      <Col span={13} className="">
                      <Input
                          value={code}
                          placeholder="请输入验证码"
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setValue('code',v)
                          }}
                          />
                      </Col>
                      <Col span={8} className="padding-top-1"><Code isDisable={phone==''} callBack={()=>{
                          self.sendCode()
                        }} /></Col>
                  </Row>
                  <Row className="">
                      <Col span={3} className="padding-top-1 text-align-center">
                        <Icon iconName={'android-lock '} size={'190%'} iconColor={'#6E9EFB'} /> 
                      </Col>
                      <Col span={21}>
                      <Input
                          value={newPwd}
                          placeholder="请输入新密码"
                          type={'password'}
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setValue('newPwd',v)
                          }}
                          />
                      </Col>
                  </Row>
                </Col>
                
                <Col className="margin-top-5r padding-all-1r text-align-center" >
                  <Buttons
                    text="提交"
                    type={'primary'}
                    size={'large'}
                    style={{backgroundColor: '#6E9EFB', color:'#fff', borderRadius: '3rem'}}
                    onClick={()=>{
                      this.bindUser()
                    }}
                  />
                </Col>
            </Row>
            {/* </div> */}
          </section>
        );
    }
}
export default ForgetPass;
