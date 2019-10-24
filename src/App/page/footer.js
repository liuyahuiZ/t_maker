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

class Footer extends Component {
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
        return (<Row justify={'center'} className="width-100 textclolor-black-low padding-all-1 heighr-5  bg-262626 line-height-4r">
        <Col span={10}>
            <Row>
            <Col span={6} className="cursor-pointer" onClick={()=>{
            // goLink('/RouteAll')
        }}>关于我们</Col>
            <Col span={6} className="cursor-pointer" onClick={()=>{
            goLink('/HotRecords', {type: 'hot'})
        }}>最热资料</Col>
            <Col span={6} className="cursor-pointer" onClick={()=>{
            goLink('/HotRecords', {type: 'new'})
        }}>最新资料</Col>
            </Row>
        </Col>
        <Col span={4} className={""}>版权所有
        </Col>
      </Row>)
    }
}

export default Footer;