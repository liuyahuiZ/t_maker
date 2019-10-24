import React , { Component }from 'react';
import { Components,utils } from 'neo';
import { hashHistory } from 'react-router';
import BaseView from '../core/app';
import { classifyList, subclassList, fileRecord } from '../api/index'
import moment from 'moment';
import {arrSetKey} from '../utils/index'
import { goLink } from '../utils/common';
import BabyIcon from '../components/babyIcon';
import MusicSearch from '../components/music/search';
const {
    Row,
    Col,
    Icon,
    Buttons,
    Item,
    Header,
    Carousel,
    Modal,
    Collapse,
    Panel, TagRadio, Toaster
  } = Components;
const { sessions, storage } = utils;
const productList = [{text: '建筑专业'}, {text: '结构专业'}]
class Demo extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          refreshed: false,
          productList: [],
          typeArr: [],
          loadText: '加载中',
          selectType: '',
          dateArr: [],
          userInfo: storage.getStorage('userInfo') || {},
          hotFiles: [],
          newFiles: []
      };
    }
    componentWillMount(){
      
    }
    componentDidMount(){
      this.getType();
      this.getFileList('hot','hotFiles')
      this.getFileList('new','newFiles')
    }

    getType(){
      const self = this;
      const { productList, typeArr } = this.state;
      // if(typeArr&&typeArr.length>1){
      //   self.resetType()
      //   return;
      // }
      classifyList({}).then((res)=>{
          if(res.code=='00000'){
            if(res.responseData.records&&res.responseData.records.length>0){
              self.setState({
                typeArr: res.responseData.records
              })
              let typeArr = res.responseData.records
              for(let i = 0; i<typeArr.length;i++ ){
                self.getList(typeArr[i], (res)=>{
                  console.log(res);
                  productList[i] = res
                  self.setState({
                    productList: productList
                  })
                });
              }
            
            } else {
              self.setState({
                typeArr: []
              })
            }
            
          }
      }).catch((err)=>{
          console.log(err);
          Toaster.toaster({ type: 'normal', position: 'top', content: err, time: 3000 }, true);
      })
    }

    resetType(){
      const { productList, typeArr } = this.state;
      const self = this;
      let list = productList&&productList.length > 0 ? arrSetKey(productList, 'typecode') : [];
      // console.log(list);
      let newTypeArr = typeArr;
      if(list&&list.arr&&list.arr.length>0) {
        for(let i=0;i<newTypeArr.length;i++){
          if(newTypeArr[i].typeValue!=='全部') {
            newTypeArr[i].typeValue =  `${newTypeArr[i].typeKey} ${list.count[newTypeArr[i].typeKey] ||''}`
          };
        }
      }
      self.setState({
        typeArr: newTypeArr
      })
    }

    getList(type, callBack){
      const { selectType, productList } = this.state;
      const self = this;
      console.log(type);
      subclassList({obj: {classId: type.id}, size: 50}).then((res)=>{
          if(res.code=='00000'){
            let loadText = '加载中'
            if(res.responseData.records.length==0){
              loadText = '暂无数据'
            }
            callBack({
              item: type,
              records: res.responseData.records,
              loadText: loadText
            }) 
           
          } else {
            self.setState({
              loadText: '暂无数据'
            })
          }
      }).catch((err)=>{
          console.log(err);
          self.setState({
            loadText: '暂无数据'
          })
      })
    }

    getFileList(type, key){
      const { selectDay, pageNumber, pageSize, userInfo, keyWords } = this.state;
      console.log('type', type);
      let searchTyp ={}
      if(type=='hot'){
        searchTyp = { dorder: true}
      } else{
        searchTyp = { corder: true}
      }
      const self = this;
      fileRecord({obj: Object.assign({}, searchTyp),
        current: pageNumber,
        size: 3
      }).then((res)=>{
        let page =  pageNumber;
        let enableLoad = 'loading';
          console.log(res);
          let loadText = '加载中'
          if(res.code=='00000'){
            if(res.responseData.records.length==0){
                loadText = '暂无数据'
            }
            self.setState({
                [key]: res.responseData.records,
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

  
    render() {
        const self = this;
        const { productList, selectType, typeArr, loadText, hotFiles, newFiles} = this.state;
        const carouselMap = [{ tabName: 'first', content: (<img alt="text" src="http://neo-blick.oss-cn-shanghai.aliyuncs.com/banner1.png" />), isActive: true },
        { tabName: 'second', content: (<img alt="text" src="http://neo-blick.oss-cn-shanghai.aliyuncs.com/banner2.png" />), isActive: false },
        { tabName: 'thired', content: (<img alt="text" src="http://47.88.2.72:2016/getphotoPal/2017-3-28/14906636798813.jpg" />), isActive: false }];
        console.log('productList', productList);

        const tagTypeDom = typeArr&&typeArr.length > 0 ? typeArr.map((itm, idx)=>{
          return <Col key={`${idx}-type`} span={6} className="text-align-center padding-all" onClick={()=>{
            console.log(itm, idx);
            if(selectType==itm.id){
              self.setState({
                selectType: ''
              })
              self.getType()
              return;
            }
            self.getList(itm, (res)=>{
              self.setState({
                productList: [res],
                selectType: itm.id
              })
            })
          }}>
            <Row>
              <Col><Icon iconName={itm.icon} iconColor={selectType==itm.id? '#6E9EFB': '#313132'} size={'210%'} /></Col>
              <Col className={selectType==itm.id? 'textcolor-6E9EFB': 'textcolor-313132'}>{itm.name}</Col>
            </Row>
          </Col>
        }) : [];

        
        const productListDom = productList&&productList.length > 0 ? productList.map((itm, idx)=>{
          let itemDom = itm.records&&itm.records.length > 0 ?  itm.records.map((em, ix)=>{
            return  <Col span={6} gutter={16} key={`${ix}-ems`} className={`line-height-2r margin-bottom-1r margin-right-3`} onClick={()=>{
              goLink('/MyRecords', {id: em.id, name: em.name})
            }}>
            <Row className="padding-all border-radius-2f padding-bottom-3 bg-show border-all border-color-ddd"  >
              <Col span={24} className="text-align-center font-size-8 textcolor-313132 text-overflow">{em.name}</Col>
            </Row></Col>
          }) : <div className="border-radius-5f bg-show text-align-center line-height-3r textclolor-666">{itm.loadText}</div>;
          return (<Row key={`${idx}-itms`} className="bg-show margin-bottom-1r margin-top-1r border-radius-2f">
            <Col className=" font-size-12 padding-all-2 border-bottom border-color-ddd">{itm.item.name}</Col>
             <Row className="width-100 padding-all-2">
                {itemDom}
              </Row>
          </Row>)
        }) : '';
        const hotDom = hotFiles&&hotFiles.length > 0 ? hotFiles.map((itm, idx)=>{
            return  <Col key={`${idx}-ems`} className={`line-height-2r`} onClick={()=>{
              goLink('/FileDetail', {id: itm.id, name: itm.name})
            }}>
            <Row className={`${idx+1 == hotFiles.length? '': 'border-bottom border-color-ddd'} bg-show padding-left-2`}  >
              <Col span={20} className="text-align-left font-size-8 textcolor-313132 text-overflow">{itm.name}</Col>
              <Col span={4} className="text-align-right"><Icon iconName={'android-download '} size={'160%'} iconColor={'#999'} /></Col>
            </Row></Col>
          }) : <div className="text-align-center line-height-3r textclolor-666">'暂无数据'</div>;
        const newDom = newFiles&&newFiles.length > 0 ? newFiles.map((itm, idx)=>{
            return  <Col key={`${idx}-ems`} className={`line-height-2r`} onClick={()=>{
              goLink('/FileDetail', {id: itm.id, name: itm.name})
            }}>
            <Row className={`${idx+1 == newFiles.length? '': 'border-bottom border-color-ddd'} bg-show padding-left-2`}  >
              <Col span={20} className="text-align-left font-size-8 textcolor-313132 text-overflow">{itm.name}</Col>
              <Col span={4} className="text-align-right"><Icon iconName={'android-download '} size={'160%'} iconColor={'#999'} /></Col>
            </Row></Col>
          }) : <div className="text-align-center line-height-3r textclolor-666">'暂无数据'</div>;
      return(
          <section className="padding-all">
              <div className="heighr-6 border-radius-5f overflow-hide relative">
              <Carousel options={carouselMap} containerStyle={{borderRadius: '0.5rem', height:'6rem'}} dotDefaultStyle={{width: '5px'}} dotActiveStyle={{}} showDotsText={false} dragAble />
              </div>
              <Row justify='center' className="margin-top-1r">
              <Col>
              <MusicSearch callBack={(k)=>{
                        console.log(k);
                        goLink('/Search', {keyWord: encodeURIComponent(k)})
                }} />
              </Col>
              <Col className="margin-top-1r bg-show border-radius-2f">
                <Row >{tagTypeDom}</Row>
              </Col>
              <Col>{productListDom}</Col>
              <Col>
              <Row  className="bg-show margin-bottom-1r margin-top-1r border-radius-2f">
                <Col className=" font-size-12 padding-all-2 border-bottom border-color-ddd">
                <Row><Col span={20}>热门下载</Col><Col span={4} className="text-align-right font-size-8"
                  onClick={()=>{self.props.tabChange('3')}}
                >更多 <Icon iconName={'chevron-right '} iconColor={''} size={'100%'} /></Col></Row></Col>

                <Row className="width-100 padding-all-2">
                    {hotDom}
                  </Row>
              </Row>
              <Row  className="bg-show margin-bottom-1r margin-top-1r border-radius-2f">
                <Col className=" font-size-12 padding-all-2 border-bottom border-color-ddd">
                <Row><Col span={20}>最近更新</Col><Col span={4} className="text-align-right font-size-8"
                onClick={()=>{self.props.tabChange('4')}}
                >更多 <Icon iconName={'chevron-right '} iconColor={''} size={'100%'} /></Col></Row>
                </Col>
                <Row className="width-100 padding-all-2">
                    {newDom}
                  </Row>
              </Row>
              
              </Col>
            </Row>
        </section>
        );
    }
}
export default Demo;