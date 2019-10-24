import axios from 'axios';
import {Toaster, Loader} from '../../neo/Components';
import { storage } from '../../neo/utils';
import {getDateTimeStr} from '../utils/timeStamp';
import { hashHistory } from 'react-router';
import { goLink } from '../utils/common'

function setReq(obj) {
    let token  = storage.getStorage('token')
    return {
      'requestNo': parseInt(Math.random() * Math.pow(10, 15)),
      'requestTime': getDateTimeStr(),
      'version': '1.0',
      'requestData': obj,
      'token': token //"ca8c613a-e200-43ef-b1ba-5188f287d466" //localStorage.token //storage.getStorage('Token')||'13b57c24-a470-458c-ac67-883dc74561f7',
    }
}
const errorCode = ['99993','99995','99996']

export default function (url, options = {}, header) {
    Loader.showProgress();
    return new Promise((resolve, reject)=>{
        // let headers = Object.assign({
        //     'Content-Type': 'application/json',
        // }, header)
        axios({
            method: options.method,
            url: url,
            // headers: headers, 
            data: setReq(options.data)
        }).then((response) => {
            Loader.hideProgress();
            if (response.status !== 200) {
                Toaster.toaster({ type: 'error', content: '系统错误', time: 3000 });
                reject(response)
            } else {
                if( errorCode.indexOf(response.data.code) >=0){
                    goLink('/BindUser');
                }
                resolve(response.data)
            }
        }).catch(error => reject(error));
    })
    
}