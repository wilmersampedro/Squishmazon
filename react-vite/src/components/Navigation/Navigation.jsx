import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import CreateProductModal from "../CreateProductModal/CreateProductModal";
import { thunkLogout } from "../../redux/session";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector(state => state.session.user)
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate("/")
  };

  return (
    <div id="navHeaderContainer">

    <ul id="navHeader">
      <li>
        <NavLink to="/" style={{"color": "white"}} ><img id="homeLogo"src="/homelogo.svg" alt="" /> </NavLink>
      </li>

      <li id="accountInfo" onClick={toggleMenu}>
        {user ?
        <>
        <div>
        <span>Hello, {user?.first_name}</span>
        </div>
        <span>Account & Wish List</span>
        </> :
        <>
        <div>
          <span>Hello, sign in</span>
        </div>
        <span>Or sign up</span>
        </>
        }
        <span id="downArrow"><i class="fa-solid fa-caret-down"></i></span>
      </li>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              {/* <li>Hello, {user.first_name}</li>
              <li>{user.email}</li> */}
              <li>
                <NavLink to="/my-products" id="manageLink"onClick={closeMenu}>Manage my 'mallows</NavLink>
                </li>
              <OpenModalMenuItem
              itemText="Create new 'mallow"
              onItemClick={closeMenu}
              id="CreateNewMallow"
              modalComponent={<CreateProductModal />}
              />
              <li>
                <button id="logoutBtn"onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </ul>
    </div>
  );
}

export default Navigation;
