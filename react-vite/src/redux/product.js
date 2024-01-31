import { csrfFetch } from "./csrf";
const LOAD_PRODUCTS = 'products/LOAD_PRODUCTS'
const RECEIVE_PRODUCT = 'products/RECEIVE_PRODUCT'
const REMOVE_PRODUCT = 'products/REMOVE_PRODUCT'

const loadProducts = products => ({
  type: LOAD_PRODUCTS,
  products
});

const receiveProduct = product => ({
  type: RECEIVE_PRODUCT,
  product
})

export const thunkFetchProducts = () => dispatch => {
  csrfFetch(`/api/products`)
  .then(r => r.json())
  .then(d => dispatch(loadProducts(d.products)))
  .catch(console.error)
}

export const thunkFetchOneProduct = (productId) => dispatch => {
  csrfFetch(`/api/products/${productId}`)
  .then(r => r.json())
  .then(d => dispatch(receiveProduct(d)))
  .catch(console.error)
}





const productReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS: {
      const productsState = {};
      action.products.forEach(product => {
        productsState[product.id] = product
      });
      return productsState
    }
    case RECEIVE_PRODUCT:
      return {...state, [action.product.id]: action.product}
    case REMOVE_PRODUCT: {
      const newState = {...state};
      delete newState[action.productId]
      return newState
    }
    default:
      return state
  }
}


export default productReducer;
