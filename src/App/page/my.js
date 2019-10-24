import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import fetch from '../servise/fetch';
import { UrlSearch, datedifference } from '../utils';
import { goLink, checkWXUser, checkWXCode } from '../utils/common';
import formate from '../utils/formate'
import moment from 'moment';
import { findUser } from '../api/index';

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
    Collapse,
    Panel,
    TransAnimal, Loade
  } = Components;
  const { sessions, storage } = utils;
class OcrDoc extends Component {
    constructor(props) {
      super(props);
      this.state = {
          userInfo: storage.getStorage('userInfo') || {},
          wxUserinfo: storage.getStorage('WXUserInfo'),
          loadText: '加载中',
          isPC: sessions.getStorage('screenWidth') >750
      };
    }

    componentDidMount(){
      let obg = UrlSearch();
      let userInfo = storage.getStorage('userInfo')
      if(userInfo&&userInfo!==''&&obg.clean){
        storage.removeStorage('userInfo');
        storage.removeAllStorage();
      }
    }

    switchChange(date){
        console.log(date);
    }


    checkUser(){
      const { userInfo } = this.state;
      if(!(userInfo&&userInfo.phone)) {
        goLink('/Registor');
      }
    }
 
    quirtAccount(){
      const self = this;
      Modal.formConfirm({
        content: (
          <div className="text-align-center">确定退出当前账号吗</div>
        ),
        style: '',
        btnConStyle: 'center',
        btnSure: {
          text: '确认',
          type: 'link',
          style: { 'height': '2rem'}
        },
        btnCancle: {
          text: '取消',
          type: 'link',
          style: { 'height': '2rem'}
        }
      },
      (id, callback) => { callback(id); self.removeUserInfo()},
      (id, callback) => { callback(id);  });
    }

    removeUserInfo(){
      Loade.show()
      const self = this;
      storage.removeStorage('userInfo');
      sessions.setStorage('quiet', true);
      setTimeout(()=>{
        Loade.hide()
        goLink('/BindUser',{}, true);
      }, 2000)
      
    }

    waister(){
      const self = this;
      Modal.alert({
        content: (
          <div className="text-align-center padding-all-2r"><img className="width-100" src="http://neo-blick.oss-cn-shanghai.aliyuncs.com/1567685782.png" /></div>
        ),
        style: '',
        btnConStyle: 'center',
        containerStyle: {maxWidth: '400px'},
        btn: {
          text: '确认',
          type: 'link',
          style: { 'height': '2rem'}
        },
      },
      (id, callback) => { callback(id); })
    }

    render() {
        const { userInfo, loadText, isPC, wxUserinfo } = this.state;
        const self = this;
        return(
          <section className="bg-f5f5f5">
            <Row justify="center" className="padding-all">
              <Col span={24} className="">
                <TransAnimal >
                <Row  className="padding-all-1r bg-2d68c4-2E94C1 border-radius-5f relative overflow-hide">
                  <Col span={12} className="text-align-left">
                    {/* <Icon iconName={'quote '} size={'150%'} iconColor={'#fff'}   /> */}
                  </Col>
                  <Col span={12} className="text-align-right zindex-10" onClick={()=>{
                    // goLink('/UserInfo')
                  }}>
                    {/* <Icon iconName={'android-settings '} size={'150%'} iconColor={'#fff'}   /> */}
                  </Col>
                  <Col className="zindex-10" onClick={()=>{
                    self.checkUser()
                  }}>
                  <Row justify="center" >
                    <Col className="text-align-center" >
                      <div className="middle-round border-radius-round bg-gray display-inline-block line-height-4r overflow-hide border-all border-color-fff">
                          {userInfo.headerUrl? <img className="width-100" src={userInfo.headerUrl} />
                          : <Icon iconName={'social-reddit '} size={'180%'} iconColor={'#fff'} /> }
                      </div>
                    </Col>
                    <Col  className="text-align-center margin-top-3">
                    { userInfo&&userInfo.userName ? 
                        <Row>
                          <Col className="textclolor-white font-size-12" >{userInfo.userName} </Col>
                        </Row>
                      : ''}
                      </Col>
                  </Row>
                    
                  </Col>
              
                  <Col className="margin-top-1r zindex-10">
                  { userInfo&&userInfo.phoneNo ? <Row>
                      <Col className="margin-top-1r text-align-center" span={12}>
                        <Row>
                          <Col className="textclolor-white font-size-8" >会员类型</Col>
                          <Col className="textclolor-white font-size-12" >{userInfo.userStatus==1? 'VIP会员': '普通会员'}</Col>
                        </Row>
                      </Col>
                      <Col className="margin-top-1r text-align-center" span={12}>
                        <Row>
                          <Col className="textclolor-white font-size-8" >剩余天数</Col>
                          <Col className="textclolor-white font-size-12" >{userInfo.dueTime||0}</Col>
                        </Row>
                      </Col>
                    </Row> : <Row justify="center" className=" padding-all border-radius-5f">
                <Col span={8} className="">
                    <Buttons
                        text={'登陆'}
                        type={'primary'}
                        size={'normal'}
                        style={{backgroundColor: '#F55936', color:'#fff', borderRadius: '5rem'}}
                        onClick={()=>{
                          // goLink('/BindUser')
                          let result = checkWXUser('BindUser')
                          if(result==false){
                            goLink('/BindUser')
                          }
                        }}
                      />
                    </Col>
                <Col span={2} />
                <Col span={8} className="">
                    <Buttons
                        text={'注册'}
                        type={'primary'}
                        size={'normal'}
                        style={{backgroundColor: '#6E9EFB', color:'#fff', borderRadius: '5rem'}}
                        onClick={()=>{
                          // goLink('/Registor')
                          let result = checkWXUser('Registor')
                          if(result==false){
                            goLink('/Registor')
                          }
                        }}
                      />
                    </Col>
                </Row> }
                  </Col>
                 { isPC ? '' :<div className="width-100 opacity-2 heightp-100 absolute-left zindex-9 water"></div>}
                </Row>
                </TransAnimal>
                  
              </Col>
              {/* <div class="animate wave">
                <div class="w1"></div>
                <div class="w2"></div>
                <div class="w3"></div>
                <div class="w4"></div>
              </div> */}
              <Col className="margin-top-1r overflow-hide">
              {userInfo&&userInfo.phoneNo  ?<Row className="padding-all-1r line-height-2r bg-show border-radius-5f">
                    <Col span={12} className="">我的信息</Col>
                     
                      <Col>
                      <Item
                      leftContent={{text: (<Row><Col span={isPC? 4: 6} className="text-align-center"><Icon iconName={'iphone'} size={'170%'} iconColor={'#6E9EFB'}  /></Col>
                        <Col span={18}>{formate.hidephone(userInfo&&userInfo.phoneNo)}</Col></Row>), style: {flex: '5'}}} 
                      rightContent={{text: '', style: {flex: '5'}, className: 'font-size-8 textclolor-gray text-align-right'}}
                      onClick={()=>{
                      }}
                      />
                      <Item
                      leftContent={{text: (<Row><Col span={isPC? 4: 6} className="text-align-center"><Icon iconName={'android-contact '} size={'150%'} iconColor={'#6E9EFB'}  /></Col>
                        <Col span={18}>{userInfo&&userInfo.userName}</Col></Row>), style: {flex: '5'}}} 
                      rightContent={{text: '', style: {flex: '5'}, className: 'font-size-8 textclolor-gray text-align-right'}}
                      onClick={()=>{
                      }}
                      />
                  
                    </Col> 
                    
                  </Row>: ''
                  }
              </Col>
              <Col span={24} className="margin-top-1r overflow-hide">
              
              {userInfo.phoneNo ?  <div className="padding-all-1r bg-show border-radius-5f">
                <Item
                    leftContent={{text: (<Row className="cursor-pointer"><Col span={isPC? 4: 6} className="text-align-center"><Icon iconName={'android-list '} size={'150%'} iconColor={'#6E9EFB'}  /></Col>
                      <Col span={18}>会员续费</Col></Row>), style: {flex: '5'}}} 
                    rightContent={{text: '会员续费', style: {flex: '5'}, className: 'font-size-8 textclolor-gray text-align-right cursor-pointer'}}
                    showRight 
                    onClick={()=>{
                      let result = checkWXCode('ReNew')
                      if(result==false){
                        goLink('/ReNew')
                      }
                    }}
                    />
                <Item
                    leftContent={{text: (<Row className="cursor-pointer"><Col span={isPC? 4: 6} className="text-align-center "><Icon iconName={'compose '} size={'150%'} iconColor={'#6E9EFB'}  /></Col>
                    <Col span={18}>修改密码</Col>
                    </Row>), style: {flex: '5'}}} 
                    rightContent={{text: '', style: {flex: '5'}, className: 'font-size-8 textclolor-gray text-align-right cursor-pointer'}}
                    showRight 
                    onClick={()=>{goLink('/ChangePass')}} />
                <Item
                    leftContent={{text: (<Row className="cursor-pointer"><Col span={isPC? 4: 6} className="text-align-center"><Icon iconName={'android-people  '} size={'150%'} iconColor={'#6E9EFB'}  /></Col>
                    <Col span={18}>关于我们</Col>
                    </Row>), style: {flex: '5'}}} 
                    rightContent={{text: '', style: {flex: '5'}, className: 'font-size-8 textclolor-gray text-align-right cursor-pointer'}}
                    showRight 
                    onClick={()=>{goLink('/AboutUs')}} />
                <Item
                    leftContent={{text: (<Row className="cursor-pointer"><Col span={isPC? 4: 6} className="text-align-center"><Icon iconName={'android-happy '} size={'150%'} iconColor={'#6E9EFB'}  /></Col>
                    <Col span={18}>联系客服</Col>
                    </Row>), style: {flex: '5'}}} 
                    rightContent={{text: '', style: {flex: '5'}, className: 'font-size-8 textclolor-gray text-align-right cursor-pointer'}}
                    showRight 
                    onClick={()=>{
                      self.waister()
                    }} />
                </div> : ''
                
              }
                
              </Col>
              <Col className="margin-top-1r overflow-hide">
              {
                    userInfo&&userInfo.phoneNo ?<Row className="padding-all-1r line-height-2r" justify="center"> 
                    <Col span={24} className="text-align-center">
                      <Buttons
                        text={'退出'}
                        type={'primary'}
                        size={'large'}
                        style={{backgroundColor: '#F55936', color:'#fff', borderRadius: '5rem'}}
                        onClick={()=>{
                          this.quirtAccount()
                        }}
                      />
                    </Col>
                    </Row>: ''
                  }
              </Col>
            </Row>
          </section>
        );
    }
}
export default OcrDoc;
