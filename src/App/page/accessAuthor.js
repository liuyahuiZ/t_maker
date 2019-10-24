import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import fetch from '../servise/fetch';
import { UrlSearch } from '../utils';
import { userWXLogin, userWXBind } from '../api/index'
import { goLink } from '../utils/common';

const {
    Buttons,
    Toaster,
    Header,
    Item,
    Row,
    Col,
    Icon,
    Modal
  } = Components;
  const { sessions, storage } = utils;
class OcrDoc extends Component {
    constructor(props) {
      super(props);
      this.state = {
          userInfo: {}
      };
    }
    componentDidMount(){
        console.log(UrlSearch());
        let obg = UrlSearch();
        this.getUserinfo(obg.code); 
    }

    getUserinfo(code){
        const self = this;
        userWXBind({
            code: code,
            // url: window.location.href.split('#')[0]
        }).then(res => {
          console.log(res)
          if(res.code=='00000'){
            storage.setStorage('WXUserInfo', res.responseData);
            self.setState({
              userInfo: res.responseData
            }, ()=>{
              setTimeout(()=>{ goLink('/RouteAll') }, 2500)
            })
          }
        //   Toaster.toaster({ type: 'success', position: 'top', content: JSON.stringify(data), time: 5000 });
        })
    }

    render() {
      const {userInfo} = this.state;
      const userInfoDom = userInfo.nickname ? (<Row justify="center">
        <Col>姓名: { userInfo.nickname }</Col>
        <Col>地址: { userInfo.country } - { userInfo.province } - { userInfo.city }</Col>
        <Col>头像: <image src={ userInfo.headimgurl } /></Col>
      </Row>) : '';
        return(
          <section className="bg-f5f5f5">
            <Row className="has-header">
                <Col className="padding-all-1r ">
                  <Item leftContent={{text:'用户授权回调'}} style={{padding: '0 0.5rem'}} />
                </Col>
                <Col className="padding-all-1r heighr-25">
                  {userInfoDom}
                </Col>
            </Row>
          </section>
        );
    }
}
export default OcrDoc;
