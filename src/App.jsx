import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import BoardPage from "./pages/Board/Board";
import Calendar from "./pages/Calendar/Calendar";
import Dashboard from "./pages/Dashboard/Dashboard";
import DataGrid from "./pages/DataGrid/DataGrid";
import Orders from "./components/Orders/Orders";
import Subjects from "./pages/form/SubjectListScreen";
import Lecturers from "./pages/form/LecturerListScreen";
import ClassCredit from "./pages/form/ClassCreditListScreen";
import Classrooms from "./pages/form/ClassRoomListScreen";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
// import Header from './components/Old/Header';
// import Footer from './components/Old/Footer';
import { logout } from "./slices/authSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const expirationTime = localStorage.getItem('expirationTime');
  //   if (expirationTime) {
  //     const currentTime = new Date().getTime();

  //     if (currentTime > expirationTime) {
  //       dispatch(logout());
  //     }
  //   }
  // }, [dispatch]);
  return (
    <div id="dashboard">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="users" element={<DataGrid />} />
            <Route path="orders" element={<Orders />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="lecturers" element={<Lecturers />} />
            <Route path="class-credit" element={<ClassCredit />} />
            <Route path="classrooms" element={<Classrooms />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
