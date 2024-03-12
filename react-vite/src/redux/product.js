import { csrfFetch } from "./csrf";
const LOAD_PRODUCTS = 'products/LOAD_PRODUCTS'
const RECEIVE_PRODUCT = 'products/RECEIVE_PRODUCT'
const REMOVE_PRODUCT = 'products/REMOVE_PRODUCT'
const RECEIVE_PRODUCT_IMAGE = 'products/RECEIVE_PRODUCT_IMAGE'

const loadProducts = products => ({
  type: LOAD_PRODUCTS,
  products
});

const receiveProduct = product => ({
  type: RECEIVE_PRODUCT,
  product
})

const removeProduct = productId => ({
  type: REMOVE_PRODUCT,
  productId
})

const receiveProductImage = (product, image) => ({
  type:RECEIVE_PRODUCT_IMAGE,
  product,
  image
})

export const thunkFetchProducts = () => dispatch => {
  csrfFetch(`/api/products`)
  .then(r => r.json())
  .then(d => dispatch(loadProducts(d.products)))
  .catch(console.error)
}

export const thunkFetchMyProducts = () => dispatch => {
  csrfFetch(`/api/products/current`)
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

export const thunkCreateProduct = (body) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/products/new`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    })

    if (res.ok) {
      const newProduct = await res.json()
      return newProduct;
    }
  } catch (error) {
    const errors = error.json();
    return errors;
  }
}

export const thunkEditProduct = (productId, body, callback ) => dispatch => {
  csrfFetch(`api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  })
  .then(r => r.json())
  .then(d => {
    dispatch(receiveProduct(d));
    callback(true, d)
  })
  .catch(e => {
    console.error(e)
    e.json()
    .then(j => callback(false, j))
  })
}

export const thunkDeleteProduct = productId => dispatch => {
  csrfFetch(`/api/products/${productId}`, {method: "DELETE"})
  .then(r => r.json())
  .then(() => dispatch(removeProduct(productId)))
  .catch(console.error)
}

export const thunkCreateImage = (newProduct, post) => async (dispatch) => {
  const response = await fetch(`/api/products/${newProduct.id}/images`, {
      method: "POST",
      body: post
    });


  if (response.ok) {

      const { resPost } = await response.json();
      dispatch(receiveProduct(newProduct));
  } else {
      const error = await response.json()
      
  }
}

export const thunkUpdateImage = (product, image, body) => dispatch => {
  fetch(`/api/product-images/${image.id}`, {
    method: "PUT",
    body
  })
  .then(r => r.json())
  .then((d) => dispatch(receiveProductImage(product, d)))
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
    case RECEIVE_PRODUCT_IMAGE:
      const newState = {...state, [action.product.id]: action.product}
      newState[action.product.id]["product_images"] = [...action.product.product_images, action.image]
      return newState
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
