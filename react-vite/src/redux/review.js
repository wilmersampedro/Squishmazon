import { csrfFetch } from "./csrf";
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const RECEIVE_REVIEW = 'reviews/RECEIVE_REVIEW'
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW'

const loadReviews = reviews => ({
  type: LOAD_REVIEWS,
  reviews
});

const receiveReview = review => ({
  type: RECEIVE_REVIEW,
  review
});

const removeReview = reviewId => ({
  type: REMOVE_REVIEW,
  reviewId
});

export const thunkFetchReviews = (productId) => dispatch => {
  csrfFetch(`/api/products/${productId}/reviews`)
  .then(r => r.json())
  .then(d => dispatch(loadReviews(d.reviews)))
  .catch(console.error)
};

export const thunkCreateReview = (productId, body) => dispatch => {
  csrfFetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  })
  .then(r => r.json())
  .then(d => dispatch(receiveReview(d)))
  .catch(console.error)
}

export const thunkEditReview = (reviewId, body, callback) => dispatch => {
  csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  })
  .then(r => r.json())
  .then(d => {
    dispatch(receiveReview(d));
    callback(true, d)
  })
  .catch(e => {
    console.error(e)
    e.json()
    .then(j => callback(false, j))
  })
}

export const thunkDeleteReview = reviewId => dispatch => {
  csrfFetch(`/api/reviews/${reviewId}`, {method: "DELETE"})
  .then(r => r.json())
  .then(() => dispatch(removeReview(reviewId)))
  .catch(console.error)
}




const reviewReducer = (state = { review: {} }, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      const reviewsState = {};
      action.reviews.forEach(review => {
        reviewsState[review.id] = review
      });
      return reviewsState
    }
    case RECEIVE_REVIEW:
      return {...state, [action.review.id]: action.review}
    case REMOVE_REVIEW: {
      const newState = {...state};
      delete newState[action.reviewId]
      return newState
    }
    default:
      return state
  }
}


export default reviewReducer;
