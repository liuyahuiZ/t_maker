import React , { Component }from 'react';
import { classifyList } from '../api/index'
class Types extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.getType();
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

    handleClick(event) {
      this.props.onClick(event);
    }

    render() {
        const { typeArr } = this.props;
        const tagTypeDom = typeArr&&typeArr.length > 0 ? typeArr.map((itm, idx)=>{
            return <Col key={`${idx}-type`} span={6} className="text-align-center padding-all">
              <Row>
                <Col><Icon iconName={itm.icon} size={'210%'} /></Col>
                <Col>{itm.name}</Col>
              </Row>
            </Col>
        }) : [];
        const self = this;
        return(
        <Row>{tagTypeDom}</Row>
        );
    }
}
export default Types;
