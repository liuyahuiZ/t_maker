import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import formate from '../utils/formate'
import { goLink } from '../utils/common';


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

class ReNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            cardInfo: {},
            loadText: '加载中',
            wxConfig: sessions.getStorage('WXCONFIG') || {},
            hasCard: "LOADING", // LOADING ,  HASCARD, NULLCARD
        };
    }
    render(){
        const { cardInfo, hasCard } = this.state;
        const self = this;
        return (<section className="bg-f5f5f5 padding-all minheight-100">
            <Row>
                <Col className="line-height-3r font-size-12">会员续费</Col>
            </Row>
            <Row className="padding-all-1r  bg-show border-radius-5f box-shadow">
                <Col>
                </Col>
            </Row>
        </section>)
    }
}

export default ReNew;