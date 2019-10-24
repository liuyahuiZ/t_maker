import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import formate from '../utils/formate'
import { goLink } from '../utils/common';
import MusicSearch from '../components/music/search';

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
    Loade,
    RandomNumber,
    TransAnimal
  } = Components;
const { sessions, storage } = utils;

class Menus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            cardInfo: {},
            loadText: '加载中',
            wxConfig: sessions.getStorage('WXCONFIG') || {},
            userInfo: storage.getStorage('userInfo') || {},
            hasCard: "LOADING", // LOADING ,  HASCARD, NULLCARD
        };
    }
    render(){
        const { cardInfo, userInfo } = this.state;
        const self = this;
        return (<Row className="width-100 textclolor-white padding-all-1 heighr-5 bg-2d68c4-2E94C1 line-height-4r">
        <Col span={4} className="padding-left-1 cursor-pointer" onClick={()=>{
            goLink('/RouteAll')
        }}>LOGO</Col>
        <Col span={10}>
            <Row>
            <Col span={6} className="cursor-pointer" onClick={()=>{
            goLink('/RouteAll')
        }}>首页</Col>
            <Col span={6} className="cursor-pointer" onClick={()=>{
            goLink('/HotRecords', {type: 'hot'})
        }}>最热资料</Col>
            <Col span={6} className="cursor-pointer" onClick={()=>{
            goLink('/HotRecords', {type: 'new'})
        }}>最新资料</Col>
            { userInfo&&userInfo.phoneNo ?<Col span={6} className="cursor-pointer" onClick={()=>{
            goLink('/My')
            }}>我的</Col> : ''}
            </Row>
        </Col>
        <Col span={4} className={"padding-top-1"}>
        <MusicSearch onChange={(v)=>{
            console.log(v);
            console.log(window.location.hash)
            if(v==''){
                let hash = window.location.hash;
                if(hash.indexOf('Search')>=0){
                    hashHistory.goBack();
                }
                
            }
        }} callBack={(k)=>{
                console.log(k);
                goLink('/Search', {keyWord: encodeURIComponent(k)})
        }} />
        </Col>
        <Col span={6} className="text-align-right cursor-pointer" >{ userInfo&&userInfo.phoneNo ? 
        <Row onClick={()=>{
            goLink('/Personal')
        }}><Col>{userInfo.phoneNo}</Col></Row> : 
        <Row justify="center" className=" border-radius-5f">
        <Col span={8} className="">
            <Buttons
                text={'登陆'}
                type={'primary'}
                size={'normal'}
                style={{backgroundColor: '#F55936', color:'#fff', borderRadius: '5rem'}}
                onClick={()=>{
                    goLink('/BindUser')
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
                goLink('/Registor')
              }}
            />
        </Col>
      </Row> }</Col>
      </Row>)
    }
}

export default Menus;