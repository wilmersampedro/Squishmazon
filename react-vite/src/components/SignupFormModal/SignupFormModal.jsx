import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if(!firstName) errs.firstName = "Please provide a first name"
    if(firstName.length > 40) errs.firstName = "First name cannot be more than 40 characters"
    if(!lastName) errs.lastName = "Please provide a last name"
    if(lastName.length > 40) errs.lastName = "Last name cannot be more than 40 characters"
    if(!email) errs.email = "Please provide an email"
    if(email.length > 320) errs.email = "Please provide a valid email"
    if(!address) errs.address = "Please provide an address"
    if(!address.length > 50) errs.address = "Address cannot be more than 50 characters"
    if(!password) errs.password = "Please provide a password"
    if(!password.length > 64) errs.password = "Password must be less than 64 characters"
    if(!confirmPassword) errs.confirmPassword = "Please confirm password"
    // if(!password.length > 64) errs.password = "Password must be less than 64 characters"

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    if(Object.keys(errors).length) return setErrors(errs)

    const serverResponse = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        email,
        address,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      {/* <div className="form-errors">
            {Object.values(errors)}
          </div> */}
      <form onSubmit={handleSubmit}>
        <div className="inputFields">
          <label>
            First Name
          </label>
          <input
            type="text"
            minLength="2"
            // maxLength="40"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <div className={firstName.length > 40 ? "overCharLimit" : "charLimitDiv"} >{firstName.length}/40</div>
          <div className="form-errors">
            {errors.firstName}{errors.first_name}
          </div>
        </div>
        <div className="inputFields">
          <label>
            Last Name
          </label>
          <input
            type="text"
            minLength="2"
            // maxLength="40"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <div className={lastName.length > 40 ? "overCharLimit" : "charLimitDiv"} >{lastName.length}/40</div>
          <div className="form-errors">
            {errors.lastName}{errors.last_name}
          </div>
        </div>
        <div className="inputFields">

          <label>
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // maxLength="320"
          />
          <div className={email.length > 320 ? "overCharLimit" : "charLimitDiv"} >{email.length}/320</div>
          <div className="form-errors">
            {errors.email}
          </div>
        </div>
        <div className="inputFields">
          <label>
            Address
          </label>
          <input
            type="text"
            // maxLength="50"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className={address.length > 50 ? "overCharLimit" : "charLimitDiv"} >{address.length}/50</div>
          <div className="form-errors">
            {errors.address}
          </div>
        </div>
        <div className="inputFields">

          <label>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
            // maxLength="64"
          />
          <div className={password.length > 64 ? "overCharLimit" : "charLimitDiv"} >{password.length}/64</div>
          <div className="form-errors">
            {errors.password}
          </div>
        </div>
        <div className="inputFields">

          <label>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="8"
            // maxLength="64"
          />
          <div className={confirmPassword.length > 64 ? "overCharLimit" : "charLimitDiv"} >{confirmPassword.length}/64</div>
          <div className="form-errors">
            {errors.confirmPassword}
          </div>
        </div>
        <div id="loginBtnsContainer">
        <button type="submit">Sign Up</button>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
