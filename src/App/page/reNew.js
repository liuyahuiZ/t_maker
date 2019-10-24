import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import formate from '../utils/formate'
import { goLink } from '../utils/common';
import { templateQry, sendVc, payRegister } from '../api/index';
import { checkCode } from '../utils/common';
import Code from '../components/code';

const {
    Buttons,
    Toaster,
    Header,
    Item,
    Row,
    Col,
    Icon,
    Modal,
    Switch,
    Loade, TagRadio, Input
  } = Components;
const { sessions, storage } = utils;

class ReNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            cardInfo: {},
            loadText: '加载中',
            wxConfig: sessions.getStorage('WXCONFIG') || {},
            userInfo: storage.getStorage('userInfo') || {},
            hasCard: "LOADING", // LOADING ,  HASCARD, NULLCARD
            isPC: sessions.getStorage('screenWidth') >750,
            vcode: '',
            type: ''
        };
    }
    componentDidMount(){
        let obg = UrlSearch();

        if(!obg.code){
            // checkCode('ReNew')
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
    submitMark(){
        const {  wxCode, phone, userInfo, type, isPC, vcode } = this.state;
        // if(!wxCode){
        //     if(!isPC){ checkCode('Registor') }
        //     return false;
        // }
        if(!vcode&&vcode=='') {
            Toaster.toaster({ type: 'error', position: 'top', content: '请输入验证码', time: 3000 }, true);
            return false;
        }
        if(!type&&type==='') {
            Toaster.toaster({ type: 'error', position: 'top', content: '请选择会员类型', time: 3000 }, true);
            return false;
        }
        Loade.show();
        let req = {
          code: wxCode,
          vcode: vcode,
          userName: userInfo.userName,
          userId: userInfo.userId,
          phoneNo: userInfo.phoneNo,
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
    setValue(key,val){
        this.setState({[key]: val});
    }
    sendCode(){
        const { userInfo } = this.state
        if(!userInfo.phoneNo&&userInfo.phoneNo==='') {
          Toaster.toaster({ type: 'normal', position: 'top', content: '请填写手机号', time: 3000 }, true);
          return false;
        }
        sendVc({
          "phoneNo": userInfo.phoneNo,
        }).then((res)=>{
          Toaster.toaster({ type: 'normal', position: 'top', content: '验证码已发送', time: 5000 });
        }).catch((err)=>{
          Toaster.toaster({ type: 'success', position: 'top', content: '验证码已发送', time: 5000 });
        })
    }
    render(){
        const { cardInfo, hasCard, templeArr , vcode, userInfo} = this.state;
        const self = this;
        return (<section className="bg-f5f5f5 padding-all minheight-80">
            <Row>
                <Col className="line-height-3r font-size-12">会员续费</Col>
            </Row>
            <Row className="padding-all-1r  bg-show border-radius-5f box-shadow">
                <Col>
                <Row className="margin-top-1r">
                    <Col>请选择会员类型</Col>
                    <Col className="margin-top-1r">
                    {templeArr&&templeArr.length>0 ? <TagRadio options={templeArr}
                        checkStyle={{"padding": "0.5rem","backgroundColor":"#6E9EFB","color": '#fff','borderRadius': '0.5rem'}} normalStyle={{"padding": "0.5rem","backgroundColor":"#eee","color": '#1a1a1a','borderRadius': '0.5rem'}}
                        onChange={(v, it)=>{
                            console.log(it)
                            self.setState({'type': it.value})
                        }} /> : "暂无数据"}
                    </Col>
                </Row>
                </Col>
                <Col>
                <Row justify="center" className="border-bottom border-color-e5e5e5">
                      <Col span={3} className="textclolor-333 line-height-3r text-align-left"><Icon iconName={'ios-barcode-outline'} size={'120%'} iconColor={'#6E9EFB'}/></Col>
                      <Col span={13} className="">
                      <Input
                          value={vcode}
                          placeholder="请输入验证码"
                          maxLength={100}
                          onChange={(e,t,v)=>{
                              self.setState({'vcode': v})
                          }}
                          />
                      </Col>
                      <Col span={8} className="padding-top-1"><Code isDisable={userInfo.phoneNo==''} callBack={()=>{
                          self.sendCode()
                        }} /></Col>
                </Row>
                </Col>
                <Col className="margin-top-3" span={22}>
                <Buttons
                  text="续费"
                  type={'primary'}
                  size={'large'}
                  style={{backgroundColor: '#6E9EFB', color:'#fff', borderRadius: '3rem'}}
                  onClick={()=>{
                    this.submitMark()
                  }}
                />
                </Col>
            </Row>
        </section>)
    }
}

export default ReNew;