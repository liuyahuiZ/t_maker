import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import { UrlSearch } from '../utils';
import FileUpUtil from '../servise/fileUp';
import config from '../config/config';
import { templateQry, sendVc, payRegister } from '../api/index';
import Code from '../components/code';
import wx from 'weixin-js-sdk';
import { checkCode } from '../utils/common';

const {
    Buttons,
    Toaster,
    Item,
    Row,
    Col,
    Icon,
    Modal,
    TransAnimal,
    Rate,
    Loade,
    Input, FileUp, TagRadio, Checkbox
} = Components;
const { sessions, storage } = utils;

class RegistorUser extends Component {
    constructor(props) {
      super(props);
      this.state = {
          userInfo: {},
          resourceKey: '1',
          userName: '',
          password: '',
          checkPass: '',
          phone: '',
          active: 'man',
          nickName: '',
          remark: '',
          code: '',
          imgSrc: '',
          checkPro: false,
          isPC: sessions.getStorage('screenWidth') >750,
          templeArr: [] //[{value: '100', checked:true, text:<Row><Col>年度会员(100元/年，365天免费下载权限)</Col></Row>}, {value: '120', text:<Row><Col>终身会员-120元/永久有效。原价198元，今日活动价120元，活动时间8月15号-8月25号，无时间限制、无次数限制、包括后续更新</Col></Row>}]
      };
    }

    componentDidMount(){
        let obg = UrlSearch();
        const { isPC }= this.state;
        if(!obg.code){
        //    if(!isPC){ checkCode('Registor') }
        } else {
            this.setState({
                wxCode: obg.code 
            })
        }
        this.getTemplate()
    }


    getTemplate(){
        const self = this;
        templateQry({obj: {},current: 1, size: 50}).then((res)=>{
            console.log(res);
            if(res.code=='00000'){
                if(res.responseData.records&&res.responseData.records.length>0){
                    let dataArr = res.responseData.records;
                    let newArr = []
                    for(let i=0;i<dataArr.length;i++){
                        newArr.push({value: dataArr[i].id, checked: i==0 ?true: false, text: <Row><Col>{dataArr[i].desc}</Col></Row>})
                    }
                    self.setState({
                        templeArr: newArr
                    })
                }
                
            }
        }).catch((err)=>{

        })
    }

    setValue(key,val){
        this.setState({[key]: val});
    }

    submitMark(){
      let obg = UrlSearch();
      const self = this;
      const {  wxCode, phone, userName, password, checkPass, code, type, checkPro, isPC } = this.state;
    //   if(!wxCode){
    //     if(!isPC){ checkCode('Registor') }
    //     return false;
    //   }
      if(!userName&&userName==='') {
        Toaster.toaster({ type: 'error', position: 'top', content: '请输入用户名', time: 3000 }, true);
        return false;
      }
      if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/.test(password)){
        Toaster.toaster({ type: 'error', position: 'top', content: '密码必须在6-12位之内，必须包含数字，大小写字母', time: 3000 }, true);
        return false;
      }
      if(password!==checkPass) {
        Toaster.toaster({ type: 'error', position: 'top', content: '两次输入密码不一致', time: 3000 }, true);
        return false;
      }
      
      if(!phone&&phone==='') {
        Toaster.toaster({ type: 'error', position: 'top', content: '请输入电话', time: 3000 }, true);
        return false;
      }
      if(!code&&code==='') {
        Toaster.toaster({ type: 'error', position: 'top', content: '请输入验证码', time: 3000 }, true);
        return false;
      }
      if(!type&&type==='') {
        Toaster.toaster({ type: 'error', position: 'top', content: '请选择会员类型', time: 3000 }, true);
        return false;
      }
      if(checkPro===false) {
        Toaster.toaster({ type: 'error', position: 'top', content: '请同意用户服务协议', time: 3000 }, true);
        return false;
      }
      
      Loade.show();
      let req = {
        code: wxCode,
        userName: userName,
        phoneNo: phone,
        password: password,
        vcode: code,
        vipTemplate: type,
      }
      payRegister(req).then((res)=>{
        Loade.hide();
        if(res.code=='00000') { 
            self.bought(res.responseData);
        }
        Toaster.toaster({ type: 'error', content: res.msg, time: 3000 }); return;
        
      }).catch((e)=>{
        Loade.hide();
        console.log(e)
      })
    }

    bought(res){
        const self = this;
        wx.chooseWXPay({
          timestamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: 'prepay_id='+res.prepayId,
          signType: 'MD5', // 注意：新版支付接口使用 MD5 加密
          paySign: res.paySign,
          success: function (respon) {
            Toaster.toaster({ type: 'error', content: '注册购买成功', time: 3000 });
          }
        });
    }

    fileUp(file, type) {
        let data = new FormData();
        data.append('file', file);
        data.append('userid', 'auto');
        const self = this;
        FileUpUtil(config.ROOT_URL + 'files/fileUp', {
          method: 'POST',
          mode: "cors",
          data: data
        }).then(data => {
          console.log(data);
          self.setValue('imgSrc', `${(data.respBody.filePath + '/'+data.respBody.fileName)}`)
        }).then(err => {
          console.log(err)
        })
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

    render() {
        const { userInfo, password,  checkPass, templeArr, code, phone, active, userName, remark, checkPro } = this.state;
        const self = this;

        return(
          <section className="padding-all bg-f5f5f5 minheight-100">
            <Row justify="center">
              <Col span={22} >
              <TransAnimal >
                <Row justify="center" className="padding-all-1r overflow-hide relative">
                  <Col className="zindex-10 text-align-center margin-top-1r">
                    <div className="middle-round border-radius-round bg-gray display-inline-block line-height-4r  overflow-hide">
                        {/* <FileUp defaultSrc={`${config.ROOT_URL}files/getTheImage?path=${imgSrc}`} fileReady={(file) => {
                            // console.log(file);
                            self.fileUp(file);
                        }} callType={'H5'} fileType="blob" description="头像" /> */}
                        <Icon iconName={'social-reddit '} size={'180%'} iconColor={'#fff'} />
                    </div>
                  </Col>
                  <Col className="zindex-10 text-align-center margin-top-1r">
                    <span className="zindex-10 textclolor-white">{userInfo.userName}</span>
                  </Col>
                </Row>
                </TransAnimal>
              </Col>
             
              <Col span={22} className="bg-show padding-all margin-top-2 border-radius-5f">
                <Row justify="center">
                    <Col span={3} className="textclolor-333 line-height-3r text-align-left">
                    <Icon iconName={'android-contact'} size={'120%'} iconColor={'#6E9EFB'} /> 
                    </Col>
                    <Col span={21}>
                    <Input
                        placeholder="请输入用户名并牢记"
                        value={userName}
                        innerStyle={{"backgroundColor":"#fff","color":"#333"}}
                        maxLength={100}
                        onChange={(e,t,v)=>{
                            self.setValue('userName',v)
                        }}
                        />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={3} className="textclolor-333 line-height-3r text-align-left">
                    <Icon iconName={'android-lock '} size={'120%'} iconColor={'#6E9EFB'} /> 
                    </Col>
                    <Col span={21}>
                    <Input
                        placeholder="请输入密码"
                        value={password}
                        innerStyle={{"backgroundColor":"#fff","color":"#333"}}
                        maxLength={100}
                        type={'password'}
                        onChange={(e,t,v)=>{
                            self.setValue('password',v)
                        }}
                        />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={3} className="textclolor-333 line-height-3r text-align-left">
                    <Icon iconName={'android-lock '} size={'120%'} iconColor={'#6E9EFB'} /> 
                    </Col>
                    <Col span={21}>
                    <Input
                        placeholder="请再次确认密码"
                        value={checkPass}
                        innerStyle={{"backgroundColor":"#fff","color":"#333"}}
                        maxLength={100}
                        type={'password'}
                        onChange={(e,t,v)=>{
                            self.setValue('checkPass',v)
                        }}
                        />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={3} className="textclolor-333 line-height-3r text-align-left">
                    <Icon iconName={'android-phone-portrait '} size={'120%'} iconColor={'#6E9EFB'} /> 
                    </Col>
                    <Col span={21}>
                    <Input
                        placeholder="请输入手机号"
                        value={phone}
                        innerStyle={{"backgroundColor":"#fff","color":"#333"}}
                        maxLength={100}
                        onChange={(e,t,v)=>{
                            self.setValue('phone',v)
                        }}
                        />
                    </Col>
                </Row>
                <Row justify="center" className="border-bottom border-color-e5e5e5">
                      <Col span={3} className="textclolor-333 line-height-3r text-align-left"><Icon iconName={'ios-barcode-outline'} size={'120%'} iconColor={'#6E9EFB'}/></Col>
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
                <Row className="margin-top-1r">
                    <Col>请选择会员类型</Col>
                    <Col className="margin-top-1r">
                    {templeArr&&templeArr.length>0 ? <TagRadio options={templeArr}
                        checkStyle={{"padding": "0.5rem","backgroundColor":"#6E9EFB","color": '#fff','borderRadius': '0.5rem'}} normalStyle={{"padding": "0.5rem","backgroundColor":"#eee","color": '#1a1a1a','borderRadius': '0.5rem'}}
                        onChange={(v, it)=>{
                            console.log(it)
                            self.setValue('type', it.value)
                        }} /> : "暂无数据"}
                    </Col>
                </Row>
                <Row>
                    <Col span={3}><Checkbox
                    options={[{ value: 'agree', text: '', checkStatus: checkPro ? 'checked': '' }]}
                    onChange={(data) => {
                        console.log(data);
                        let check = data.agree.checkStatus == 'checked' ? true : false;
                        this.setValue('checkPro',check);
                    }}
                    ref={(r) => { this.$$checkbox1 = r; }}
                    /></Col>
                    <Col span={21} className="textclolor-black-low font-size-small line-height-2r" >
                    我同意 <span className="underline" onClick={()=>{
                        this.goLink('/ParqPage')
                    }}>《用户服务协议》</span> </Col>
                </Row>
              </Col>
              
              <Col className="margin-top-3 text-align-center" span={22}>
                <Buttons
                  text="注 册"
                  type={'primary'}
                  size={'large'}
                  style={{backgroundColor: '#6E9EFB', color:'#fff', borderRadius: '3rem'}}
                  onClick={()=>{
                    this.submitMark()
                  }}
                />
              </Col>
            </Row>
          </section>
        );
    }
}
export default RegistorUser;
