import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/Slices/AuthSlice";
import { Dropdown } from "react-bootstrap";
import "./Header.css"; // Import a custom CSS file for additional styling
import { collection, getDocs } from "firebase/firestore";
import { setAllUsers } from "../../Redux/Slices/userSlice";
import { db } from "../Auth/firebase";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const fetchContacts = async () => {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      uid: doc.data().uid,
      email: doc.data().email,
    }));
    // setContacts(users);
    dispatch(setAllUsers(users));
  };
  React.useEffect(() => {
    fetchContacts();
    // fetchCOnversations();
  }, []);

  return (
    <header className="bg-dark text-white sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            MyApp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/chat">
                  Chat
                </Link>
                <Link className="nav-link" to="/inbox">
                  Inbox
                </Link>
              </li>
              {isLogin ? (
                <>
                  <li className="nav-item dropdown">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="link"
                        id="dropdown-basic"
                        className="dropdown-toggle-nav"
                      >
                        {/* {user.email} */}
                        qxewfge
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-nav">
                        <Dropdown.Item as={Link} to="/dashboard">
                          Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/dashboard/profile">
                          Profile
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      Signup
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
