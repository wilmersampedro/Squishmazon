import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
      console.log(".....",errors)
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1 id="authHeader">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div id="emailInputContainer">

          <label htmlFor="emailInput">
            Email
          </label>
          <input
            name="emailInput"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="form-errors">
            {errors.email}
          </div>
        </div>
        <div id="passwordInputContainer">

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
        <div id="loginBtnsContainer">
        <button type="submit">Log In</button>
        <div id="demoBtn" onClick={(e) => { dispatch(thunkLogin({ email: 'demo@aa.io', password: 'password' })); closeModal(); e.preventDefault() }}>Demo User</div>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
