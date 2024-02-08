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

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

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
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <div className="inputFields">
          <label>
            First Name
          </label>
          <input
            type="text"
            minLength="2"
            maxLength="40"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <div className="form-errors">
            {errors.firstName}
          </div>
        </div>
        <div className="inputFields">
          <label>
            Last Name
          </label>
          <input
            type="text"
            minLength="2"
            maxLength="40"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <div className="form-errors">
            {errors.lastName}
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
          />
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
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
          />
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
          />
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
