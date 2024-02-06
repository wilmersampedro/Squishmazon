import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateReview } from "../../redux/review";
import './CreateReviewModal.css'

function CreateReviewModal({ product }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [reviewText, setReviewText] = useState("")
  const [stars, setStars] = useState(0)
  const [activeRating, setActiveRating] = useState(stars);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (reviewText.length > 350) errs.reviewText = "Review text must be less than 350 characters"
    if(!reviewText.length) errs.reviewText = "Please include a written review"
    if (stars < 1 || stars > 5) errs.stars = "Star rating must be between 1-5"
    if (!stars) errs.stars = "Please select a star rating"
    if (Object.keys(errs).length) return setErrors(errs)

    const body = {
      review_text: reviewText,
      stars
    }

    dispatch(thunkCreateReview(product.id, body))
    closeModal()
  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <>
      <div id="editModalTitle">Create Review</div>
      <form onSubmit={handleSubmit} >
        <div id="overallRating">Overall Rating</div>
        <div id="stars-container" onMouseLeave={() => { setActiveRating(stars) }}>
          <div value={1} onClick={() => onChange(1)} onMouseEnter={() => setActiveRating(1)} className={activeRating >= 1 ? 'filled' : 'empty'}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div value={2} onClick={() => onChange(2)} onMouseEnter={() => setActiveRating(2)} className={activeRating >= 2 ? 'filled' : 'empty'}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div value={3} onClick={() => onChange(3)} onMouseEnter={() => setActiveRating(3)} className={activeRating >= 3 ? 'filled' : 'empty'}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div value={4} onClick={() => onChange(4)} onMouseEnter={() => setActiveRating(4)} className={activeRating >= 4 ? 'filled' : 'empty'}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div value={5} onClick={() => onChange(5)} onMouseEnter={() => setActiveRating(5)} className={activeRating >= 5 ? 'filled' : 'empty'}>
            <i className="fa-solid fa-star"></i>
          </div>
        </div>
        <div className="form-errors">
          {errors.stars}
        </div>
        
        <div id="reviewTextContainer">
          <label htmlFor="reviewText">
            Add a written review
          </label>

          <textarea
          id="reviewTxt"
            name="reviewText"
            value={reviewText}
            placeholder="What did you like or dislike? Leave your review here..."
            rows="7"
            cols="50"
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className="form-errors">
          {errors.reviewText}
        </div>
        </div>
        <br />
        <div id="submitModalBtns">
          <div id="cancelBtn" onClick={closeModal}>Cancel</div>
          <input type="submit" />
        </div>
      </form>
    </>
  )

}

export default CreateReviewModal;
