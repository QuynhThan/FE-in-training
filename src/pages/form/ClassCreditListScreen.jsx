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
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Stack,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import ToastServive from "react-material-toast";

import { facultyData } from "../../data";
import { useGetSubjectsQuery } from "../../slices/subjectsApiSlice";
import { useGetClassroomsQuery } from "../../slices/classroomApiSlice";
import { useGetLecturersQuery } from "../../slices/lecturerApiSlice";
import {
  useGetTimetablesQuery,
  useSubmitTimetableMutation,
} from "../../slices/timeTableApiSlice";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";

const LecturerListScreen = () => {
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
    if (!userInfo || userInfo.role === "student") {
      logoutHandler();
    }
  }, []);
  const toast = ToastServive.new({
    place: "topRight",
    duration: 2,
    maxCount: 8,
  });
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
  // const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

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
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to add a new Class Credit?")) {
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
    }
  };

  const handleEditRow = async ({ values, table }) => {
    if (window.confirm("Are you sure you want to edit this Class credit?")) {
      try {
        const response = await editClassCredit(values);
        toast.success("Class credit Edited");
        window.confirm("class credit Edited SUCCESS");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        window.confirm("Class credit Edited FAILED");
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

  const { data, isLoading, error, refetch } = useGetClassCreditsQuery({
    searchRequest,
  });
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

  return (
    <>
      <div className="table-container">
        <Row className="align-items-center">
          <Col>
            <h1 style={{ color: "black" }}>Lớp tín chỉ</h1>
          </Col>
          {/* <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col> */}
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ||
        isLoadingSubjects ||
        isLoadingRooms ||
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
                enableEditing
                onEditingRowCancel={() => setValidationErrors({})}
                onEditingRowSave={handleEditRow}
                renderRowActionMenuItems={({ row }) => (
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    {/* <Tooltip title="Edit">
                      <IconButton onClick={() => console.log(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip> */}
                    <Tooltip title="Delete">
                      <IconButton
                        variant="danger"
                        color="error"
                        onClick={() => deleteHandler(row.original)}
                      >
                        <DeleteIcon />
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
              Thêm lớp tín chỉ
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
                  <form onSubmit={handleSubmit}>
                    {console.log(lecturers)}
                    <Box>
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
                        sx={{ mb: 4 }}
                      >
                        {subjects?.map((subject) => (
                          <MenuItem value={subject.subjectId}>
                            {subject.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    {/* <TextField
                      select
                      variant="outlined"
                      color="secondary"
                      label="Phòng học"
                      onChange={(e) => setRoomId(e.target.value)}
                      value={roomId}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    >
                      {rooms?.map((room) => (
                        <MenuItem value={room.classroomId}>
                          {room.name} - {room.roomType} - {room.maxSize} SV
                        </MenuItem>
                      ))}
                    </TextField> */}
                    {/* <TextField
                      select
                      variant="outlined"
                      color="secondary"
                      label="Giảng viên"
                      onChange={(e) => setLecturerId(e.target.value)}
                      value={lecturerId}
                      fullWidth
                      sx={{ mb: 4 }}
                    >
                      {lecturers?.map((lecturer) => (
                        <MenuItem value={lecturer.lecturerId}>
                          {lecturer.profile?.fullName}
                        </MenuItem>
                      ))}
                    </TextField> */}
                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                      <TextField
                        type="date"
                        variant="outlined"
                        color="secondary"
                        label="NGÀY MỞ ĐĂNG KÝ"
                        onChange={(e) => setRegisOpening(e.target.value)}
                        value={regisOpening}
                        fullWidth
                        required
                      />
                      <TextField
                        type="date"
                        variant="outlined"
                        color="secondary"
                        label="HẠN ĐĂNG KÝ"
                        onChange={(e) => setRegisClosing(e.target.value)}
                        value={regisClosing}
                        fullWidth
                        required
                      />
                    </Stack>
                    <Stack spacing={3} direction="row" sx={{}}>
                      <TextField
                        type="number"
                        variant="outlined"
                        color="secondary"
                        label="Số lượng tối thiểu"
                        onChange={(e) => setMinSize(e.target.value)}
                        value={minSize}
                        required
                        fullWidth
                        sx={{ mb: 4 }}
                      />
                      <TextField
                        type="number"
                        variant="outlined"
                        color="secondary"
                        label="NĂM HỌC"
                        onChange={(e) => setYear(e.target.value)}
                        value={year}
                        required
                        fullWidth
                        sx={{ mb: 4 }}
                      />
                      <TextField
                        type="number"
                        variant="outlined"
                        color="secondary"
                        label="HỌC KỲ"
                        onChange={(e) => setSemesterNo(e.target.value)}
                        value={semesterNo}
                        fullWidth
                        sx={{ mb: 4 }}
                      />
                    </Stack>
                    <Button variant="outlined" color="secondary" type="submit">
                      Thêm
                    </Button>
                  </form>
                  {/* <small>
                      Already have an account?{" "}
                      <Link to="/login">Login Here</Link>
                    </small> */}
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
