import ReactDOM from 'react-dom';
import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import { userWXLogin } from '../api/index'
import { UrlSearch } from '../utils';
import { goLink, checkWXUser  } from '../utils/common';
const {
    Row,
    Col,
    Icon
  } = Components;
const { sessions, storage } = utils;
import Tab from './tab';
import PcHome from './pcHome';
  
class RouteAll extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          screenWidth: 0,
      };
    }
    componentDidMount(){
        const routeContant = this.$$routeContainer;
        console.log(routeContant.offsetWidth);
        this.setState({
            screenWidth: routeContant.offsetWidth
        })
        sessions.setStorage('screenWidth', routeContant.offsetWidth )
        // let obg = UrlSearch();
        // if(obg&&obg.code){
        //     this.getUserinfo(obg.code); 
        // }
        
    }

    getUserinfo(code){
        const self = this;
        userWXLogin({
            code: code
        }).then(res => {
          console.log(res)
          if(res.code=='00000'){
            storage.setStorage('WXUserInfo', res.responseData);
            // self.setState({
            //   userInfo: JSON.parse(res.responseData)
            // })
          }
        //   Toaster.toaster({ type: 'success', position: 'top', content: JSON.stringify(data), time: 5000 });
        })
    }

    render() {
        const {screenWidth} = this.state;
        console.log(screenWidth);
        return(
          <section className="images-all" ref={(r) => { this.$$routeContainer = r; }}>
            {
                screenWidth&&screenWidth>650 ? <PcHome /> :<Tab />
            }
          </section>
        );
    }
}
export default RouteAll;
