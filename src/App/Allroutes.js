import React, {Component} from 'react';
import { Router, Route, hashHistory, IndexRedirect, IndexRoute } from 'react-router';
import LayOut from './core/LayOut';
import ListDoc from './page/list';

const AccessAuthor = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/accessAuthor').default)
  },'AccessAuthor')
};

const RouteAll = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/routeAll').default)
  },'RouteAll')
};

const CreateArticleDoc = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/createArticle').default)
  },'CreateArticleDoc')
};

const ArticleDetail = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/articleDetail').default)
  },'ArticleDetail')
};


const Search = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/search').default)
  },'Search')
};

const MyRecords = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/myRecords').default)
  },'MyRecords')
};

const BindUser = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/bindUser').default)
  },'BindUser')
};

const Registor = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/registor').default)
  },'Registor')
};


const UserInfo = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/userInfo').default)
  },'UserInfo')
};

const Clender = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/Clender').default)
  },'Clender')
};

const ChangePass = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/changePass').default)
  },'ChangePass')
};

const ForgetPass = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/forgetPass').default)
  },'ForgetPass')
};

const ReNew = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/reNew').default)
  },'ReNew')
};

const Personal = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/my').default)
  },'Personal')
};

const FileDetail = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/fileDetail').default)
  },'FileDetail')
};

const HotRecords = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/hotRecords').default)
  },'HotRecords')
};

const My = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/my').default)
  },'My')
};

class MyRouter extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <Router history={hashHistory}>
      <Route path={'/'} component={LayOut} >
        {/* <IndexRoute component={ListDoc} /> */}
        <IndexRedirect to="/RouteAll"/>
        <Route path={'Lists'} component={ListDoc} />
        <Route path={'AccessAuthor'} getComponent={AccessAuthor} />
        <Route path={'RouteAll'} getComponent={RouteAll} />
        <Route path={'CreateArticle'} getComponent={CreateArticleDoc} />
        <Route path={'ArticleDetail'} getComponent={ArticleDetail} />
        <Route path={'Search'} getComponent={Search} />
        <Route path={'MyRecords'} getComponent={MyRecords} />
        <Route path={'Registor'} getComponent={Registor} />
        <Route path={'BindUser'} getComponent={BindUser} />
        <Route path={'UserInfo'} getComponent={UserInfo} />
        <Route path={'Clender'} getComponent={Clender} />
        <Route path={'ChangePass'} getComponent={ChangePass} />
        <Route path={'ForgetPass'} getComponent={ForgetPass} />
        <Route path={'ReNew'} getComponent={ReNew} />
        <Route path={'Personal'} getComponent={Personal} />
        <Route path={'FileDetail'} getComponent={FileDetail} />
        <Route path={'HotRecords'} getComponent={HotRecords} />
        <Route path={'My'} getComponent={My} />
      </Route>
    </Router>
    )
  }
}
export default MyRouter
