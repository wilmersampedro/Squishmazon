import { csrfFetch } from "./csrf";
const LOAD_WISHLIST = "wishlists/LOAD_WISHLIST";
const RECEIVE_WISHLIST_PRODUCT = "wishlists/RECEIVE_WISHLIST_PRODUCT";
const REMOVE_WISHLIST_PRODUCT = "wishlists/REMOVE_WISHLIST_PRODUCT";

const loadWishlist = (wishlist) => ({
  type: LOAD_WISHLIST,
  wishlist,
});

const receiveWishlistProduct = (wishlistProduct) => ({
  type: RECEIVE_WISHLIST_PRODUCT,
  wishlistProduct,
});

const removeWishlistProduct = (wishlistProductId) => ({
  type: REMOVE_WISHLIST_PRODUCT,
  wishlistProductId,
});

export const thunkFetchMyWishlist = () => (dispatch) => {
  csrfFetch(`/api/wishlists`)
    .then((r) => r.json())
    .then((d) => dispatch(loadWishlist(d.wishlist)))
    .catch(console.error);
};

export const thunkFetchUserWishlist = (userId) => (dispatch) => {
  csrfFetch(`/api/users/${userId}/wishlist`)
    .then((r) => r.json())
    .then((d) => dispatch(loadWishlist(d.wishlist)))
    .catch(console.error);
};

export const thunkAddWishlistItem = (product) => (dispatch) => {
  csrfFetch(`/api/products/${product.id}/wishlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((r) => r.json())
    .then((d) => dispatch(receiveWishlistProduct(d)))
    .catch(console.error);
};

export const thunkDeleteWishlistItem = productId => dispatch => {
  csrfFetch(`/api/products/${productId}/wishlists`, {method: "DELETE"})
  .then(r => r.json())
  .then(() => dispatch(removeWishlistProduct(productId)))
  .catch(console.error)
}

const wishlistReducer = (state = { wishlist: {} }, action) => {
  switch (action.type) {
    case LOAD_WISHLIST: {
      const wishlistState = {};
      action.wishlist.forEach((product) => {
        wishlistState[product.id] = product;
      });
      return wishlistState;
    }
    case RECEIVE_WISHLIST_PRODUCT:
      return { ...state, [action.wishlistProduct.id]: action.wishlistProduct };
    case REMOVE_WISHLIST_PRODUCT: {
      const newState = { ...state };
      delete newState[action.wishlistProductId];
      return newState;
    }
    default:
      return state;
  }
};

export default wishlistReducer;
