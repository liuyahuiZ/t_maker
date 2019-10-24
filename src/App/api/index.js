import fetch from '../servise/fetch';
import request from '../servise/request';
import config from '../config/config';

export function createRecord(reqbody){
    return new Promise((resolve, reject)=>{
        fetch(config.ROOT_URL+ 'record/doCreate',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}


export function findType(reqbody){
    return new Promise((resolve, reject)=>{
        fetch(config.ROOT_URL+ 'commonType/findType',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function addType(reqbody){
    return new Promise((resolve, reject)=>{
        fetch(config.ROOT_URL+ 'commonType/addType',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function userUpdInfo(reqbody){
    return new Promise((resolve, reject)=>{
        fetch(config.ROOT_URL+ 'users/register',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function findUser(reqbody){
    return new Promise((resolve, reject)=>{
        fetch(config.ROOT_URL+ 'api/user/get',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function updateUser(reqbody){
    return new Promise((resolve, reject)=>{
        fetch(config.ROOT_URL+ 'users/updateUser',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function classifyList(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/file/classify/qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
export function subclassList(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/file/subclass/qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function userWXLogin(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/wx_login',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function userWXBind(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/wx_bind',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function userLogin(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/user_login',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
// 文件记录查询
export function fileRecord(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/file/record/qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 文件记录详情
export function fileGet(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/file/record/get',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
// 重置密码
export function resetPwd(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/resetPwd',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
// 忘记密码
export function forgetPwd(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/forgetPwd',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 发送验证码
export function sendVc(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/sendVc',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 获取文件下载地址
export function getDownUrl(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/getDownUrl',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 获取微信ticket
export function createSign(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/wechat/ticket',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 支付注册
export function payRegister(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/wechat/pay_register',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 会员模板查询
export function templateQry(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'api/vip/template/qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}