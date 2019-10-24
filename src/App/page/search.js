import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import formate from '../utils/formate'
import { goLink } from '../utils/common';
import { fileRecord } from '../api/index';
import Records from './records';
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
    TransAnimal, Input
  } = Components;
const { sessions, storage } = utils;

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            loadText: '加载中',
            hasCard: "LOADING", // LOADING ,  HASCARD, NULLCARD
            keyWords: "",
            productList: [],
            isPC: sessions.getStorage('screenWidth') > 750
        };
    }

    componentDidMount(){
        let obg = UrlSearch();
        this.setState({keyWords: decodeURIComponent(obg.keyWord)});
    }
    
    render(){
        let obg = UrlSearch();
        console.log('keyWordsssss', obg)
        const { keyWords, productList, loadText, isPC } = this.state;
        const self = this;
        return (<section className="bg-f5f5f5 width-100 minheight-100">
            <Records keyWords={obg.keyWord} />
        </section>)
    }
}

export default Search;