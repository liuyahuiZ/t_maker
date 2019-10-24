import React , { Component }from 'react';
import { Components } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import fetch from '../servise/fetch';
import { UrlSearch } from '../utils';

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
    Collapse,
    Panel
  } = Components;
  
class ArticleDetail extends Component {
    constructor(props) {
      super(props);
      this.state = {
          article: {}
      };
    }

    setValue(key,val){
        this.setState({[key]: val});
    }


    render() {
        const {article} = this.state;

        return(
          <section className="bg-show">
            <Row className="padding-all-1r " justify="center">
              <Col span={24} className="font-size-12 line-height-4r ">
               {article.title}
              </Col>
              <Col span={24} className="font-size-8 textcolor-aeaeae">
              {article.user} | {article.createTime}
              </Col>
              <Col className="margin-top-2 ">
              </Col>
            
            </Row>
          </section>
        );
    }
}
export default ArticleDetail;
