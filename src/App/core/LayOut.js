import ReactDOM from 'react-dom';
import React , { Component }from 'react';
import {Components, Parts, utils} from 'neo';
import { Router, Route, hashHistory, IndexRedirect, History } from 'react-router';
import '../style/comment.scss';
import '../style/common.scss';
import '../style/font.scss';
import { createSign } from '../api/index';
import wx from 'weixin-js-sdk';
import SysConfig from '../config/sysConfig';
import Static from './static';
import MusicSearch from '../components/music/search';
import { goLink, checkWXUser  } from '../utils/common';
import Menus from '../page/menus';
import Footer from '../page/footer';

const { Button, PageTransition, Loade, Row, Col, Buttons } = Components;
const { HeaderPart } = Parts
const { sessions, storage } = utils;

class LayOut extends Component {
    constructor(props, context) {
        super(props, context);
      this.state = {
          action: 'enter',
          compontArr: [],
          titleArr: [],
          historyArr:[],
          moving: true,
          isPC: sessions.getStorage('screenWidth') >750,
          userInfo: storage.getStorage('userInfo') || {},
          screenWidth: 0
      };
    }
    componentDidMount(){
        const arr = [];
        const histArr = [];
        arr.push(this.props.children);
        histArr.push(this.props.location.pathname);
        this.setState({
            compontArr: arr,
            historyArr: histArr,
            titleArr: histArr,
            moving: false
        })
        const WXCONFIG = sessions.getStorage('WXCONFIG');
        if(!WXCONFIG) {
            this.getSign();
        }
        const routeContant = this.$$routeContainer;
        console.log(routeContant.offsetWidth);
        this.setState({
            screenWidth: routeContant.offsetWidth
        })
        sessions.setStorage('screenWidth', routeContant.offsetWidth )
    }
    componentWillReceiveProps(nextProps, nextContext) {
        const { moving, historyArr } = this.state;
        if(moving) {
            this.setState({
                moving: false
            });
            return;
        }
        if(nextProps.location.pathname === '/') {
            this.setState({
                historyArr: [],
            })
            this.changeContent('leave', nextProps)
            return
        }
        if(!sessions.getStorage('isFirst')){
            sessions.setStorage('isFirst', 'is')
            return 
        }
        if(nextProps.location.action === "PUSH") {
            this.changeContent('enter', nextProps)
        } else if(nextProps.location.action === "POP") {
            this.changeContent('leave', nextProps)
        }
    }
    
    changeContent(action, nextProps){
        const self = this;
        const arr = this.state.compontArr;
        const titArr = this.state.titleArr;
        
        if(arr.length < 2) {   
            let child = React.cloneElement(nextProps.children, { pageIn: 'viewAppear' });
            arr.push(child);
            titArr.push(nextProps.location.pathname);
        }
        this.setState({
            compontArr: arr,
            action: action,
            titleArr: titArr,
            moving: true,
        })
        setTimeout(()=> {
            const arr = self.state.compontArr;
            const titArr = this.state.titleArr;
            arr.shift();
            titArr.shift();
            let child = React.cloneElement(arr[0], { pageIn: '' });
            self.setState({
                compontArr: [child],
                titleArr:titArr,
                moving: false
            })
        }, 600)
    }

    actions(){
        const {historyArr, action} = this.state;
        hashHistory.goBack();
    }
    getSign(){
        const self = this;
        let url =  encodeURIComponent(window.location.href.split('#')[0]);
        Loade.show();
        createSign({
        "url": url
        }).then(data => {
        Loade.hide();
        if(data.code == '00000'){
        let resp = data.responseData
        resp.appId = SysConfig.APPID;
        // alert(JSON.stringify(data.respBody));
        sessions.setStorage('WXCONFIG', resp);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: resp.appId, // 必填，公众号的唯一标识
            timestamp: resp.timestamp, // 必填，生成签名的时间戳
            nonceStr: resp.nonceStr, // 必填，生成签名的随机串
            signature: resp.signature,// 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'chooseImage',
                'scanQRCode',
                'getLocation',
                'chooseWXPay'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(()=>{
            console.log('wx.ready');
            // alert('wx.ready')
        });

        wx.error(function(res){
            console.log('wx err',res);
        });
        }
        })
        .catch((error) => {console.log(error);Loade.hide();})
    }
    render() {
        const self = this;
        const {compontArr, titleArr, isPC, userInfo, screenWidth} = this.state;
        const Action = this.state.action;
        let actionArr = [{action: 'leave', enter: 'doc-leave', leave:'doc-enter' },
        {action: 'enter', enter: 'doc-enter', leave:'doc-leave-end' }];
        if(Action === 'enter') {
            actionArr = [{action: 'leave', enter: 'doc-enter', leave:'doc-leave-end' },
            {action: 'enter', enter: 'doc-enter', leave:'doc-leave' }];
        }
        
        let ZIndex = 5;
        const components = screenWidth&&screenWidth>650? 
        <Row className="width-70 margin-left-15 min-content"> {compontArr[0]}</Row> : compontArr.map((item, idx) => {
            return (<PageTransition
                disable={ compontArr.length === 1 ? false : true }
                act={actionArr[idx].action}
                enter={ (compontArr.length ==1) ? actionArr[idx].leave : actionArr[idx].enter}
                leave={ (compontArr.length ==1) ? actionArr[idx].enter : actionArr[idx].leave}
                key={`${item.props.location.pathname}-com`}
                ><div className={`${screenWidth&&screenWidth>650? 'width-70 margin-left-15':''} pageContent transf pages`} style={{zIndex: ZIndex + idx}}>{item}</div>
                </PageTransition>);
        });
        console.log(this.props.location.pathname);
        return(
            <div ref={(r) => { this.$$routeContainer = r; }}>
                {screenWidth&&screenWidth>650? <Menus />: ''
                }
                {/* <HeaderPart titlepart={titleArr} action={Action} onback={() => {this.actions()}}/> */}
                {components}
                {screenWidth&&screenWidth>650? <Footer /> : ''}
                {/* <div className="pageContent transf">{this.props.children}</div> */}
            </div>
        );
    }
}

export default LayOut;
