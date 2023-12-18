import css from "./Sidebar.module.css";
import { MdSpaceDashboard } from "react-icons/md";
import {
  AiFillBook,
  AiFillCalendar,
  AiOutlineBook,
  AiOutlineCalendar,
  AiOutlineTable,
  AiOutlineUser,
  AiOutlineWindows,
} from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Label } from "@mui/icons-material";
import { useEffect, useState } from "react";
const Sidebar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [tkb, setTKB] = useState(false);
  const [mh, setMH] = useState(false);
  const [gv, setGV] = useState(false);
  const [ltc, setLTC] = useState(false);
  const [lichhoc, setlichhoc] = useState(false);
  const [ph, setPH] = useState(false);
  const [dkm, setDKM] = useState(false);
  const [phanmon, setphanmon] = useState(false);

  const resetState = () => {
    setTKB(false);
    setMH(false);
    setGV(false);
    setLTC(false);
    setlichhoc(false);
    setPH(false);
    setDKM(false);
    setphanmon(false);
  };

  const setRole = () => {
    console.log(userInfo);
    if (userInfo) {
      if (userInfo.role !== "undefine" && userInfo.role === "student") {
        setlichhoc(true);
        setDKM(true);
      }
      if (userInfo.role !== "undefine" && userInfo.role === "lecturer") {
        setlichhoc(true);
        setMH(true);
        setGV(true);
        setLTC(true);
      }
      if (userInfo.role !== "undefine" && userInfo.role === "employee") {
        setTKB(true);
        setMH(true);
        setGV(true);
        setLTC(true);
        setlichhoc(true);
        setPH(true);
        setphanmon(true);
      }
    }
  };

  useEffect(() => {
    resetState();
    setRole();
  }, []);

  return (
    <div className={css.container}>
      <img src="./logo-ptit.png" alt="logo" className={css.logo} />
      {userInfo ? (
        <div className={css.menu}>
          {/* <NavLink to="dashboard" className={css.item} title={"Dashboard"}>
          <MdSpaceDashboard size={30} />
        </NavLink> */}

          <NavLink
            to="calendar"
            className={css.item}
            title="Calendar"
            hidden={!userInfo}
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineCalendar size={30} />
            <p>Thời khóa biểu</p>
          </NavLink>

          {/* <NavLink to="board" className={css.item} title="Trello Board">
          <FaTasks size={30} />
        </NavLink> */}

          <NavLink
            to="subjects"
            className={css.item}
            hidden={userInfo.role === "student"}
            title="Subjects"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineBook size={30} />
            <p>Môn học</p>
          </NavLink>

          <NavLink
            to="lecturers"
            className={css.item}
            hidden={userInfo.role === "student"}
            title="Lecturers"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineUser size={30} />
            <p>Giảng viên</p>
          </NavLink>

          <NavLink
            to="class-credit"
            className={css.item}
            hidden={userInfo.role === "student"}
            title="class-credit"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineWindows size={30} />
            <p>Lớp tín chỉ</p>
          </NavLink>

          <NavLink
            to="class-credit-bulk"
            className={css.item}
            hidden={userInfo.role !== "employee"}
            title="class-credit-bulk"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineWindows size={30} />
            <p>Tạo lịch học</p>
          </NavLink>

          <NavLink
            to="classrooms"
            className={css.item}
            hidden={userInfo.role !== "employee"}
            title="Classrooms"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineTable size={30} />
            <p>Phòng học</p>
          </NavLink>

          <NavLink
            to="class-credit-registration"
            className={css.item}
            title="Đăng ký môn"
            hidden={userInfo.role !== "student"}
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineTable size={30} />
            <p>Đăng ký môn</p>
          </NavLink>

          {/* <NavLink
            to="phan-mon"
            className={css.item}
            title="Phân Môn"
            hidden={userInfo.role !== "employee"}
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineTable size={30} />
            <p>Phân Môn</p>
          </NavLink> */}

          <NavLink
            to="phan-mon-ltc"
            className={css.item}
            title="Phân Môn"
            hidden={userInfo.role !== "employee"}
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineTable size={30} />
            <p>Phân Môn LTC</p>
          </NavLink>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Sidebar;
