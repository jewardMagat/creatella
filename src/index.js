import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import Root from '@navigation/Root';
import AppReducer from '@redux/reducers/AppReducer';
import thunk from 'redux-thunk';

const store = createStore(
  AppReducer,
  applyMiddleware(thunk)
);

export default class App extends React.Component {
  render(){
    return(
      <Provider store={store}>
        <Root/>
      </Provider>
    )
  }
}
