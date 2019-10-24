import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import config from '../config/config';
import { UrlSearch } from '../utils';
import formate from '../utils/formate'
import { goLink } from '../utils/common';
import { fileGet, getDownUrl } from '../api/index'
import { checkUser } from '../utils/common';

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
    TransAnimal, ExModal
  } = Components;
const { sessions, storage } = utils;

class FileDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            cardInfo: {},
            loadText: '加载中',
            wxConfig: sessions.getStorage('WXCONFIG') || {},
            hasCard: "LOADING", // LOADING ,  HASCARD, NULLCARD
            selectItm: "",
            MDdisplay: '',
            MDaction: '',
            isPC: sessions.getStorage('screenWidth') > 750
        };
    }

    componentDidMount(){
        this.getDetail()
    }

    getDetail(){
        const { selectDay } = this.state;
        let obg  = UrlSearch();
        const self = this;
        fileGet({id: obg.id }).then((res)=>{
          let enableLoad = 'loading';
            console.log(res);
            let loadText = '加载中'
            if(res.code=='00000'){
                self.setState({selectItm: res.responseData})
            }
        })
    }
    downloadFile(){
        const { selectItm }= this.state;
        getDownUrl({id: selectItm.id}).then((res)=>{
          console.log(res)
          if(res.code=='00000'){
            var a = document.createElement("a");  
            document.body.appendChild(a);  
            a.download = selectItm.name;  
            a.href = res.responseData;  
            a.click();
          }else{
            Toaster.toaster({ type: 'normal', position: 'top', content: res.msg, time: 3000 }, true);
          }
          
        }).catch((err)=>{
          console.log(err);
        })
      }
    showPlayer(){
        this.setState({
            MDdisplay: 'show',
            MDaction: 'enter'
        })
    }
    render(){
        const { cardInfo, selectItm, MDdisplay, MDaction, isPC } = this.state;
        const self = this;
        return (<section className="bg-f5f5f5 minheight-100">
            {isPC ? '':<Header
              leftContent={{
                text: (<Icon iconName={'ios-arrow-back'} size={'180%'} iconColor={'#fff'} />), style:{flex: '1.3',width: '23%', paddingLeft: '0.2rem'},
                onClick: ()=>{hashHistory.goBack();}
              }}
              centerContent={{text: '资料下载页', style:{flex: '3.5'} }}
              rightContent={{text:'', style:{flex: '1.5'}}}
            />}
            <div className={`${isPC ? '': 'has-header '}`}>
            <Row className="padding-all bg-show border-radius-2f " justify={'center'}>
                <Col className="font-size-12 line-height-3r border-bottom border-color-e5e5e5">
                <Row><Col span={20}>{selectItm.name}</Col>
                </Row>
                </Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>资料名称：</span> {selectItm.name}</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>文件大小：</span> {selectItm.size}M</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>分享人：</span> {selectItm.upUserName||'xxx'}</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>解压密码：</span> 微信公众号：施工者，后台回复“密码”即可获取</Col>
                <Col  span={20} className="margin-top-1r text-align-center">
                  <Buttons
                    text={<Row justify="center" align="center" content="center"><Icon iconName={'android-download '} iconPadding={1} size={'190%'} iconColor={'#fff'} /> <span>下载</span></Row>}
                    type={'primary'}
                    size={'normal'}
                    style={{background: 'linear-gradient(126deg,#2d68c4, #2E94C1)', color:'#fff', borderRadius: '3rem', height: '3rem'}}
                    onClick={()=>{
                        self.showPlayer(); //checkUser(()=>{self.downloadFile()})
                    }}
                  />
                </Col>
            </Row>
            <Row className="padding-all bg-show margin-top-1r border-radius-2f" justify={'center'}>
                <Col className=" border-bottom border-color-e5e5e5 line-height-3r">详细介绍</Col>
                <Col>{selectItm.remark||'暂无数据'}</Col>
            </Row>
            <ExModal display={MDdisplay} action={MDaction} options={{
                content: (<Row className="padding-all">
                <Col className="font-size-12 line-height-3r border-bottom border-color-e5e5e5">
                <Row><Col span={20}>{selectItm.name}</Col>
                <Col span={4} className={'text-align-center'} onClick={() => { self.setState({
                      MDdisplay: 'hide',
                      MDaction: 'leave'
                    }) }} >
                </Col></Row>
                </Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>资料名称：</span> {selectItm.name}</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>文件大小：</span> {selectItm.size}M</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>解压密码：</span> 微信公众号：施工者，后台回复“密码”即可获取</Col>
                <Col className="margin-top-1r text-align-center">
                  <Buttons
                    text="复制页面链接"
                    type={'primary'}
                    size={'normal'}
                    style={{background: 'linear-gradient(126deg,#2d68c4, #2E94C1)', color:'#fff', borderRadius: '3rem', height: '2.3rem'}}
                    onClick={()=>{
                        // var clipBoardContent=window.location.href;
                        // window.clipboardData.setData("Text",clipBoardContent);
                        let oInput = document.createElement('input')
                        oInput.value = window.location.href
                        document.body.appendChild(oInput)
                        oInput.select()
                        document.execCommand("Copy")
                        oInput.style.display = 'none'
                        document.body.removeChild(oInput)

                    }}
                  />
                </Col>
                <Col className="margin-top-1r text-align-center">
                  <Buttons
                    text="立即下载"
                    type={'primary'}
                    size={'normal'}
                    style={{background: 'linear-gradient(126deg,#2d68c4, #2E94C1)', color:'#fff', borderRadius: '3rem', height: '2.3rem'}}
                    onClick={()=>{
                        checkUser(()=>{self.downloadFile()})
                    }}
                  />
                </Col>
                </Row>),
                type: 'bottom',
                containerStyle: isPC ? { width: '70%'} :{ width: '100%'},
                }} />
            </div>
        </section>)
    }
}

export default FileDetail;