import { getDateTimeStr } from './timeStamp';
import { hashHistory } from 'react-router';
import { utils } from 'neo';
import SysConfig from '../config/sysConfig';

const { storage, sessions } = utils;

function clientInfo(){
  var u = navigator.userAgent, app = navigator.appVersion;
  return {
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i) == " qq" //是否QQ
  };
}
export function setReq(obj) {
    return {
        "appUser": 'jfxqj_wx',
        "requestData": obj,
        "requestNo": parseInt(Math.random()*Math.pow(10,15)),
        "requestTime": getDateTimeStr(),
        "source": "jfxqj_wx",
        "version": "1.2",
        "productCode": "2000",
        "channelCode": 'jbs2000',
        "accessMode": 'wx',
        "clientType": 'wx',
        "osType": 'weichart',
        "appVersion": '1.0',
        "jfpalVersion": '1.0',
        "mobileSerialNum": storage.getStorage('userId'),
        "phone": storage.getStorage('userId')
    }
}

export function goLink(link, itm, isRelad){
    if(link) {
      hashHistory.push({
        pathname: link,
        query: itm || ''
      });
    }
    if(isRelad) { window.location.reload() }
}

export function checkWXUser(page){
  let wxConfig = sessions.getStorage('WXCONFIG');
  let url = window.location.href.split('#')[0] + `#/${page||'AccessAuthor'}`
  let reditUrl = encodeURIComponent(url); //config.REDIRECT_URL
  let appId = SysConfig.APPID;
  let nowClientInfo = clientInfo()
  console.log('nowClientInfo', nowClientInfo);
  // let reditUrl = "https%3A%2F%2Ftest-jbsg.91dbq.com%2Fwx-h5%2F%23%2FAccessAuthor";
  if(nowClientInfo.weixin){
    let WXUserInfo = storage.getStorage('WXUserInfo');
    if(!WXUserInfo){
      window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${reditUrl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`;
    }
  }else{
    return false;
  }
  //identityStatus 实名认证状态  00是已认证。01是未认证
}

export function checkUser(callBack){
  let wxConfig = sessions.getStorage('WXCONFIG');
  // let reditUrl = "https%3A%2F%2Ftest-jbsg.91dbq.com%2Fwx-h5%2F%23%2FAccessAuthor";
  let userInfo = storage.getStorage('userInfo');
  //identityStatus 实名认证状态  00是已认证。01是未认证
  
  if (userInfo) {
    if(callBack&&(typeof callBack)==='function') {callBack();}
  } else {
    window.location.href = window.location.href.split('#')[0] + '#/BindUser'
  }
}


export function checkCode(route){
  let appId = SysConfig.APPID;
  let url = window.location.href.split('#')[0] + '#/'+ route
  let reditUrl = encodeURIComponent(url); //config.REDIRECT_URL
  //identityStatus 实名认证状态  00是已认证。01是未认证
  window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${reditUrl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`;
  
}

export function checkWXCode(route){
  let appId = SysConfig.APPID;
  let url = window.location.href.split('#')[0] + '#/'+ route
  let reditUrl = encodeURIComponent(url); //config.REDIRECT_URL
  let nowClientInfo = clientInfo()
  console.log('nowClientInfo', nowClientInfo);
  // let reditUrl = "https%3A%2F%2Ftest-jbsg.91dbq.com%2Fwx-h5%2F%23%2FAccessAuthor";
  if(nowClientInfo.weixin){
  //identityStatus 实名认证状态  00是已认证。01是未认证
    window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${reditUrl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`;
  } else{
    return false
  }
}
