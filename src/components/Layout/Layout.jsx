import moment from "moment/moment";
import css from "./Layout.module.css";
import { BiSearch } from "react-icons/bi";
import Sidebar from "../Sidebar/Sidebar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { logout } from "../../slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      // dispatch(resetCart());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={css.container}>
      <Sidebar />

      {/* making the dashboard as the default route */}
      {pathname === "/" && <Navigate to="/login" />}

      <div className={css.dashboard}>
        <div className={css.topBaseGradients}>
          <div className="gradient-red"></div>
          <div className="gradient-orange"></div>
          <div className="gradient-blue"></div>
        </div>

        <div className={css.header}>
          <span>{moment().format("dddd, Do MMM YYYY")}</span>

          {/* <div className={css.searchBar}>
            <BiSearch size={20} />
            <input type="text" placeholder="Search" />
          </div> */}
          {userInfo ? (
            <div className={css.profile}>
              <img src="./avatar.jpg" alt="person image" />
              <div className={css.details}>
                <span>{userInfo.profile?.fullName}</span>
                <span>{userInfo.profile?.email}</span>
              </div>
              <IconButton
                color="primary"
                aria-label="log out"
                onClick={logoutHandler}
              >
                <Logout />
              </IconButton>
            </div>
          ) : (
            <div className={css.profile}>
              <img src="./unknow_user.jpg" alt="person image" />
              <div className={css.details}>
                <span>Username</span>
                {/* <span>email</span> */}
              </div>
            </div>
          )}
        </div>

        <div className={css.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
