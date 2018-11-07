import {SET_PRODUCTS, SET_PREFETCHED_PRODUCTS} from '../actions/Types';

const init ={
  products: [],
  prefetchedProducts: []
}

export default (state = init, action) => {
  switch(action.type){
    case SET_PRODUCTS:
      return {...state, products: action.products};
    case SET_PREFETCHED_PRODUCTS:
      return {...state, prefetchedProducts: action.prefetchedProducts};
    default:
     return state;
  }
}
