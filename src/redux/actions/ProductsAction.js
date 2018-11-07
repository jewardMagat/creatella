import {SET_PRODUCTS, SET_PREFETCHED_PRODUCTS} from './Types';

export const setProducts = (products) => {
  console.log('SET_PRODUCTS');

  return {
    type: SET_PRODUCTS,
    products
  }
}

export const setPrefetchedProducts = (prefetchedProducts) => {
  console.log('SET_PREFETCHED_PRODUCTS');

  return {
    type: SET_PREFETCHED_PRODUCTS,
    prefetchedProducts
  }
}
