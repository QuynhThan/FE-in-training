import { LinkContainer } from "react-router-bootstrap";
import { Table, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Old/Message";
import Loader from "../../components/Old/Loader";
import {
  useGetClassCreditsQuery,
  useDeleteClassCreditsMutation,
  useCreateClassCreditsMutation,
  useUpdateClassCreditsMutation,
} from "../../slices/classCreditApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import React, { useMemo } from "react";
import FormContainer from "../../components/Old/FormContainer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MaterialReactTable from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
// import "../../App.css";
import { MultiSelectComponent } from "@syncfusion/ej2-react-dropdowns";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Stack,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
} from "@mui/material";

import { facultyData } from "../../data";
import { useGetSubjectsQuery } from "../../slices/subjectsApiSlice";
import { useGetClassroomsQuery } from "../../slices/classroomApiSlice";
import { useGetLecturersQuery } from "../../slices/lecturerApiSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import ToastServive from "react-material-toast";
import { Add } from "@mui/icons-material";
import { useRegisterSubmitMutation } from "../../slices/registerApiSlice";

const LecturerListScreen = () => {
  const toast = ToastServive.new({
    place: "topRight",
    duration: 5,
    maxCount: 8,
  });
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (!userInfo || userInfo.role !== "student") {
      logoutHandler();
    }
    if (userInfo && userInfo.userName) {
      setTenTk(userInfo.userName);
    }
  }, []);
  //
  // const [profileCode, setProfileCode] = useState("");
  const classCredit = null;
  const [subjectId, setSubjectId] = useState("0");
  const [roomId, setRoomId] = useState("0");
  const [lecturerId, setLecturerId] = useState("0");
  const [regisOpening, setRegisOpening] = useState(0);
  const [regisClosing, setRegisClosing] = useState(0);
  const [year, setYear] = useState(0);
  const [semesterNo, setSemesterNo] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [multiValue, setMultiValue] = useState([]);
  // const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [tenTk, setTenTk] = useState("");

  const navigate = useNavigate();
  const formData = new FormData();

  const resetState = () => {
    setSubjectId("");
    setRoomId("");
    setLecturerId(0);
    setRegisOpening(0);
    setRegisClosing(0);
    setYear("");
    setMinSize(0);
    setTenTk("");
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await createClassCredit({
        subjectId,
        roomId,
        lecturerId,
        regisOpening,
        regisClosing,
        year,
        semesterNo,
        minSize,
      }).unwrap();
      toast.success("Class Credit Created");
      resetState();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    refetch();
    navigate("/class-credit");
  };

  const handleEditRow = async ({ values, table }) => {
    if (window.confirm("Are you sure ?")) {
      try {
        const response = await editClassCredit(values);
        toast.success("Class credit Edited");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      refetch();
      navigate("/class-credit");
    }
    table.setEditingRow(null);
  };

  useEffect(() => {
    if (classCredit) {
      setSubjectId(classCredit.name);
      setRoomId(classCredit.price);
      setStatus(classCredit.status);
      setType(classCredit.type);
      setSize(classCredit.size);
      setCountInStock(classCredit.countInStock);
      setDescription(classCredit.description);
    }
  }, [classCredit]);

  const uploadFileHandler = (e) => {
    var files = e.target.files;
    setFile(files[0]);
    // for(let i = 0; i < files.length; i++){
    //   formData.append('files', files[i]);
    // }
    console.log(formData.getAll("files"));
  };
  //
  const { pageNumber } = useParams();
  const searchRequest = {};
  const searchCCRequest = {
    userName: userInfo.userName,
    role: "student",
    filters: [
      {
        key: "status",
        operator: "EQUAL",
        fieldType: "STRING",
        value: "ACTIVE",
        valueTo: {},
        values: [{}],
      },
    ],
  };
  const searchHuyCCRequest = {
    userName: userInfo.userName,
    role: "student",
    registered: "true",
    filters: [
      {
        key: "status",
        operator: "EQUAL",
        fieldType: "STRING",
        value: "ACTIVE",
        valueTo: {},
        values: [{}],
      },
    ],
  };

  const { data, isLoading, error, refetch } =
    useGetClassCreditsQuery(searchCCRequest);

  const {
    data: dataHuy,
    isLoading: isLoadingHuy,
    error: errorHuy,
    refetch: refetchHuy,
  } = useGetClassCreditsQuery(searchHuyCCRequest);
  const { data: rooms, isLoading: isLoadingRooms } = useGetClassroomsQuery({
    searchRequest,
  });
  const { data: lecturers, isLoadingLecturers } = useGetLecturersQuery({
    searchRequest,
  });
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    error: errorSubjects,
  } = useGetSubjectsQuery({
    searchRequest,
  });
  const [deleteClassCredit, { isLoading: loadingDelete }] =
    useDeleteClassCreditsMutation();

  const [registerSubmit, { isLoading: loadingRegister }] =
    useRegisterSubmitMutation();

  const deleteHandler = async (classCredit) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteClassCredit(classCredit);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createClassCredit, { isLoading: loadingCreate }] =
    useCreateClassCreditsMutation();

  const [editClassCredit, { isLoading: loadingEdit }] =
    useUpdateClassCreditsMutation();

  const columns = useMemo(() => [
    {
      accessorKey: "classCreditId",
      header: "ID",
      enableEditing: false,
      size: 1,
    },
    {
      accessorKey: "subject.name",
      header: "MÔN HỌC",
      enableEditing: false,
    },
    {
      accessorKey: "lecturer.profile.fullName",
      enableEditing: false,
      header: "GIẢNG VIÊN",
    },
    {
      accessorKey: "regisOpening", //normal accessorKey
      header: "NGÀY MỞ ĐĂNG KÝ",
    },
    {
      accessorKey: "regisClosing", //normal accessorKey
      header: "HẠN ĐĂNG KÝ",
    },
    {
      accessorKey: "year", //normal accessorKey
      header: "NĂM",
    },
    {
      accessorKey: "semesterNo", //normal accessorKey
      header: "HỌC KỲ",
    },
    {
      accessorKey: "status", //normal accessorKey
      header: "Trạng thái",
    },
  ]);
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: "light",
      },
    })
  );
  const yearData = ["2021", "2023"];

  const dkMonHandle = async (ltc) => {
    if (window.confirm("Are you sure")) {
      try {
        const response = await registerSubmit({
          classCredit: ltc,
          userName: userInfo.userName,
          status: "true",
        }).unwrap();
        console.log(response);
        refetch();
        refetchHuy();
        toast.success("Đăng ký thành công thành công!!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const huyMonHandle = async (ltc) => {
    if (window.confirm("Are you sure")) {
      try {
        const response = await registerSubmit({
          classCredit: ltc,
          userName: userInfo.userName,
          status: "false",
        }).unwrap();
        refetch();
        refetchHuy();

        toast.success("Hủy thành công!!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div className="table-container">
        <Row className="align-items-center">
          <Col>
            <h1 style={{ color: "black" }}>Đăng ký môn học</h1>
          </Col>
          {/* <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col> */}
        </Row>
        <form onSubmit={handleSearch} hidden>
          {console.log(lecturers)}
          <Stack spacing={3} direction="row" sx={{}}>
            <TextField
              select
              variant="outlined"
              color="secondary"
              label="Môn học"
              onChange={(e) => {
                setSubjectId(e.target.value);
                console.log(e.target.value);
              }}
              value={subjectId}
              fullWidth
              required
            >
              {subjects?.map((subject) => (
                <MenuItem value={subject.subjectId}>{subject.name}</MenuItem>
              ))}
            </TextField>
            <MultiSelectComponent
              placeholder="Select Year"
              dataSource={yearData}
              // fields={{ value: "EmployeeID", text: "FirstName" }}
              popupHeight="200"
            ></MultiSelectComponent>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              style={{ height: "50px" }}
            >
              <AiOutlineSearch type="submit" />
            </Button>
          </Stack>
        </form>
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ||
        isLoadingSubjects ||
        isLoadingRooms ||
        isLoadingHuy ||
        isLoadingLecturers ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message}</Message>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={data}
                enableRowActions
                // enableEditing
                onEditingRowCancel={() => setValidationErrors({})}
                onEditingRowSave={handleEditRow}
                renderRowActions={({ row }) => (
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <Tooltip title="Đăng ký">
                      <IconButton
                        variant="danger"
                        // color="error"
                        onClick={() => dkMonHandle(row.original)}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              />
            </ThemeProvider>

            <h1
              style={{
                color: "black",
                paddingTop: "100px",
                paddingBottom: "20px",
              }}
            >
              Hủy đăng ký
            </h1>
            {loadingCreate && <Loader />}
            {isLoadingSubjects ||
            isLoadingRooms ||
            isLoadingLecturers ||
            isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error.data.message}</Message>
            ) : (
              <>
                <>
                  <ThemeProvider theme={theme}>
                    <MaterialReactTable
                      columns={columns}
                      data={dataHuy}
                      enableRowActions
                      // enableEditing
                      onEditingRowCancel={() => setValidationErrors({})}
                      onEditingRowSave={handleEditRow}
                      renderRowActions={({ row }) => (
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                          <Tooltip title="Hủy">
                            <IconButton
                              variant="danger"
                              // color="error"
                              onClick={() => huyMonHandle(row.original)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    />
                  </ThemeProvider>
                </>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LecturerListScreen;
