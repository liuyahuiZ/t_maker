import React , { Component }from 'react';
import { Components,utils } from 'neo';
import { hashHistory } from 'react-router';
import BaseView from '../core/app';
import { fileRecord, getDownUrl } from '../api/index'
import moment from 'moment';
import BabyIcon from '../components/babyIcon';
import { UrlSearch } from '../utils';
import { checkUser } from '../utils/common';
import { goLink } from '../utils/common';

const {
    Row,
    Col,
    Icon,
    Buttons,
    Switch,
    Item,
    Header,
    PullRefresh,
    Carousel,
    Modal,
    Collapse, ExModal,
    Panel, TagRadio, DatePicker, LoadMore, Toaster
  } = Components;
const { sessions, storage } = utils;
class MyRecordsDoc extends Component {
    constructor(props) {
      super(props);
      let obg  = UrlSearch();
      const startDate = moment().subtract(0, 'days').format('YYYY-MM-DD'); // 设置开始日期，没有就默认昨天的日期
	    const endDate =  moment().subtract(0, 'days').format('YYYY-MM-DD'); // 设置结束日期，没有就默认昨天的日期
      this.state = {
          confirmDirty: false,
          refreshed: false,
          productList: [],
          loadText: '加载中',
          pageNumber: 1,
          pageSize: 10,
          total: 0,
          enableLoad: 'canload',
          selectItm: {},
          MDdisplay: '',
          MDaction: '',
          tagName: decodeURIComponent(obg.name||''),
          keyWords: this.props.keyWords||'',
         userInfo: storage.getStorage('userInfo') || {},
         isPC: sessions.getStorage('screenWidth') > 750
      };
    }

    componentDidMount(){
      if(sessions.getStorage('screenWidth') > 750){
        this.getList();
      }
    }

    componentWillReceiveProps(nextProps){
      const { keyWords } = this.state;
      console.log('nextProps', nextProps)
      if(keyWords!==nextProps.keyWords) {
        this.setState({
          keyWords: nextProps.keyWords,
          productList: []
        }, ()=>{this.getList()})
      }
    }
  
    getList(){
      const { selectDay, pageNumber, pageSize, productList, userInfo, keyWords } = this.state;
      console.log(keyWords);
      let obg  = UrlSearch();
      const self = this;
      self.setState({
        productList: []
      })
      fileRecord({obj: {subclassId: obg.id, name: keyWords },
        current: pageNumber,
        size: pageSize
      }).then((res)=>{
        let page =  pageNumber;
        let products = productList;
        let enableLoad = 'loading';
          console.log(res);
          let loadText = '加载中'
          if(res.code=='00000'){
            if(res.responseData.records&&res.responseData.records.length>0){
              products.push(...res.responseData.records);
            } else{
              products=[];
              page=1;
            }
            //products = products.concat(res.respBody.record);
            if( products.length >= res.responseData.total ) {
                enableLoad = 'loaded'
            } else{
                page = page + 1;
                enableLoad = 'canload';
            }
            if(res.responseData.records.length==0){
                loadText = '暂无数据'
            }
            self.setState({
                productList: products,
                enableLoad: enableLoad,
                pageNumber: page,
                loadText: loadText,
                total: res.responseData.total
            })
          }
      }).catch((err)=>{
          console.log(err);
          self.setState({
            loadText: '暂无数据'
          })
      })
    }

    loadmore(){
        console.log('load...');
        const self = this;
        // 'loading' 'loaded' 'canload'
        self.setState({
          enableLoad: 'loading'
        })
        self.getList();
    }


    showPlayer(){
      this.setState({
          MDdisplay: 'show',
          MDaction: 'enter'
      })
    }

    downloadFile(){
      const { selectItm }= this.state;
      getDownUrl({id: selectItm.id}).then((res)=>{
        console.log(res)
        // var a = document.createElement("a");  
        // document.body.appendChild(a);  
        // a.download = selectItm.name;  
        // a.href = selectItm.fileUrl;  
        // a.click();
      }).catch((err)=>{
        console.log(err);
      })
    }
  
    render() {
        const self = this;
        const { productList, total, selectItm, tagName, MDaction, MDdisplay, loadText, enableLoad, isPC} = this.state;
        let mainHeight = productList&&productList.length > 0 ? {height: '85vh'} : {height: '9vh'};
        const productListDom = productList&&productList.length > 0 ? productList.map((itm, idx)=>{
          return (<Row className="padding-all border-radius-2f padding-bottom-3 margin-bottom-1r bg-show"  key={`${idx}-itm`}
          onClick={()=>{ self.setState({selectItm: itm}); 
          goLink('/FileDetail', {id: itm.id, name: itm.name})
          }}>
            <Col span={3}>
              <Icon iconName={'cube'} size={'160%'} iconColor={'#fc9378'} />
            </Col>
            <Col span={18}>
              <Row>
                <Col  className="font-size-12 ">{itm.name}</Col>
                <Col span={18} className=" font-size-8  textclolor-gray">文件大小：{itm.size} M</Col>
              </Row>
            </Col>
            <Col span={3}>
              <Icon iconName={'android-download '} size={'160%'} iconColor={'#999'} />
            </Col>
          </Row>
          )
        }) : <div className="border-radius-2f bg-show text-align-center line-height-3r textclolor-666">{loadText}</div>;;
        console.log('isPC', isPC)
        return(
          <section className={`width-100 bg-f5f5f5`}>
          {isPC ? '': <Header
              leftContent={{
                text: (<Icon iconName={'ios-arrow-back'} size={'180%'} iconColor={'#fff'} />), style:{flex: '1.3',width: '23%', paddingLeft: '0.2rem'},
                onClick: ()=>{hashHistory.goBack();}
              }}
              centerContent={{text: '资料列表页', style:{flex: '3.5'} }}
              rightContent={{text:'', style:{flex: '1.5'}}}
            />}
            <div className={`${isPC ? '': 'has-header '}`}>
              <Row justify='center' className={` padding-all margin-top-2`} >
              <Col span={12} className="line-height-3r font-size-12">{tagName||'搜索结果'} </Col>
              <Col span={12} className="line-height-3r text-align-right textcolor-313132">总数（{total}）</Col>
              <Col className="margin-top-1r ">
              <LoadMore enableLoad={enableLoad} percent={20} 
                loadfunc={()=>{this.loadmore()}} style={mainHeight}
                >{productListDom}</LoadMore>
            </Col>
            </Row>
            <ExModal display={MDdisplay} action={MDaction} options={{
                content: (<Row className="padding-all">
                <Col className="font-size-12 line-height-3r border-bottom border-color-e5e5e5">
                <Row><Col span={20}>{selectItm.name}</Col>
                <Col span={4} className={'text-align-center'} onClick={() => { self.setState({
                      MDdisplay: 'hide',
                      MDaction: 'leave'
                    }) }} >
                        <Icon iconName={"android-cancel"} size={'100%'} iconColor={'#333'} />
                </Col></Row>
                </Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>资料名称：</span> {selectItm.name}</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>文件大小：</span> {selectItm.size}M</Col>
                <Col className="font-size-8 textcolor-313132 line-height-2r"><span>解压密码：</span> 微信公众号：施工者，后台回复“密码”即可获取</Col>
                <Col className="margin-top-1r">
                  <Buttons
                    text="下载"
                    type={'primary'}
                    size={isPC?'small':'normal'}
                    style={{backgroundColor: '#6E9EFB', color:'#fff', borderRadius: '0.3rem', height: '2.3rem'}}
                    onClick={()=>{
                      checkUser(()=>{self.downloadFile()})
                    }}
                  />
                </Col>
                <Col className="margin-top-1r line-height-3r">详细介绍</Col>
                </Row>),
                type: 'bottom',
                containerStyle: { top: '3rem'},
                }} />
              </div>
        </section>
        );
    }
}
export default MyRecordsDoc;