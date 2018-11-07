import {combineReducers} from 'redux';
import ProductsReducer from './ProductsReducer';

const AppReducer = combineReducers({
  products: ProductsReducer
});

export default AppReducer;
