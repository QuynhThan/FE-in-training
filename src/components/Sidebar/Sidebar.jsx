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
const Sidebar = () => {
  const { userInfo } = useSelector((state) => state.auth);

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
            title="Subjects"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineBook size={30} />
            <p>Môn học</p>
          </NavLink>

          <NavLink
            to="lecturers"
            className={css.item}
            title="Lecturers"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineUser size={30} />
            <p>Giảng viên</p>
          </NavLink>

          <NavLink
            to="class-credit"
            className={css.item}
            title="class-credit"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineWindows size={30} />
            <p>Lớp tín chỉ</p>
          </NavLink>

          <NavLink
            to="classrooms"
            className={css.item}
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
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineTable size={30} />
            <p>Đăng ký môn</p>
          </NavLink>

          <NavLink
            to="phan-mon"
            className={css.item}
            title="Phân Môn"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <AiOutlineTable size={30} />
            <p>Phân Môn</p>
          </NavLink>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Sidebar;
