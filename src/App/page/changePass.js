import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import { resetPwd } from '../api/index'
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
class ChangePass extends Component {
    constructor(props) {
      super(props);
      this.state = {
          userInfo: storage.getStorage('userInfo') || {
            nickname: ''
          },
          oldPass: '',
          code: '',
          password: '',
          checkPass: ''
      };
    }
    componentDidMount(){
    }

    setValue(key,val){
      this.setState({[key]: val});
    }

    bindUser(){
      const self = this;
      const { oldPass, password, checkPass } = this.state
      if(!oldPass&&oldPass==='') {
        Toaster.toaster({ type: 'normal', position: 'top', content: '请填写原密码', time: 3000 }, true);
        return false;
      }
      if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/.test(password)) {
        Toaster.toaster({ type: 'normal', position: 'top', content: '新密码必须在6-12位之内，必须包含数字，大小写字母', time: 3000 }, true);
        return false;
      }
      if(!checkPass&&checkPass==='') {
        Toaster.toaster({ type: 'normal', position: 'top', content: '请填写再次确认密码', time: 3000 }, true);
        return false;
      }
      if(password!==checkPass) {
        Toaster.toaster({ type: 'normal', position: 'top', content: '两次输入密码不一致', time: 3000 }, true);
        return false;
      }
      resetPwd({
        "oldPass": oldPass,
        "newPwd": password 
      }).then((res)=>{
        console.log(res);
        if(res.code=='00000'){
          if(res.responseData){
            hashHistory.goBack();
          }
        }else{
          Toaster.toaster({ type: 'normal', position: 'top', content: res.msg, time: 5000 });
        }
      }).catch((err)=>{
        Toaster.toaster({ type: 'normal', position: 'top', content: JSON.stringify(err), time: 5000 });
      })
    }

    render() {
      const { oldPass, code, password, checkPass} = this.state;
      const self = this;
        return(
          <section className="bg-f5f5f5">
            <Row className="padding-all ">
                <Col span={24} className="padding-all-1r line-height-3r">修改密码</Col>
                <Col span={24} className="bg-show margin-top-2 padding-all-1r border-radius-5f">
                  <Row className="border-bottom border-color-e5e5e5 padding-bottom-1r">
                      <Col span={3} className="padding-top-1 text-align-center">
                        <Icon iconName={'android-lock'} size={'190%'} iconColor={'#6E9EFB'} /> 
                      </Col>
                      <Col span={21}>
                      <Input
                          value={oldPass}
                          placeholder="请输原登陆密码"
                          type={'password'}
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setValue('oldPass',v)
                          }}
                          />
                      </Col>
                  </Row>
                  <Row className="margin-top-1r border-bottom border-color-e5e5e5 padding-bottom-1r">
                      <Col span={3} className="padding-top-1 text-align-center">
                        <Icon iconName={'android-lock '} size={'190%'} iconColor={'#6E9EFB'} /> 
                      </Col>
                      <Col span={21}>
                      <Input
                          value={password}
                          placeholder="请输入新密码"
                          type={'password'}
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setValue('password',v)
                          }}
                          />
                      </Col>
                  </Row>
                  <Row className="margin-top-1r">
                      <Col span={3} className="padding-top-1 text-align-center">
                        <Icon iconName={'android-lock '} size={'190%'} iconColor={'#6E9EFB'} /> 
                      </Col>
                      <Col span={21}>
                      <Input
                          value={checkPass}
                          placeholder="确认新密码"
                          type={'password'}
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setValue('checkPass',v)
                          }}
                          />
                      </Col>
                  </Row>
                </Col>
                
                <Col className="margin-top-5r padding-all-1r text-align-center" >
                  <Buttons
                    text="更新"
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
export default ChangePass;
