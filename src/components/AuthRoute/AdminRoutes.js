import React, { useEffect } from "react";
import Login from "../Users/Forms/Login";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../redux/slice/users/userSlice";

const AdminRoutes = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getUserProfileAction())
  },[dispatch])

  const {userAuth} = useSelector(state=> state?.users)
  // console.log(userAuth?.userInfo?.userFound?.isAdmin);
  

  // get user from localstorage
  // const user = JSON.parse(localStorage.getItem("userInfo"));

  const isAdmin = userAuth?.userInfo?.userFound?.isAdmin ? true : false;

  if (!isAdmin) return <h1>Access Denied, Admin Only</h1>;
  return <>{children}</>;
};

export default AdminRoutes;
