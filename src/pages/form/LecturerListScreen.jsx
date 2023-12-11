import { LinkContainer } from "react-router-bootstrap";
import { Table, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Old/Message";
import Loader from "../../components/Old/Loader";
import {
  useGetLecturersQuery,
  useDeleteLecturersMutation,
  useCreateLecturersMutation,
  useUpdateLecturersMutation,
  useUploadLecturersImageMutation,
} from "../../slices/lecturerApiSlice";
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
} from "@mui/material";

import { facultyData } from "../../data";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import ToastServive from "react-material-toast";

const LecturerListScreen = () => {
  const toast = ToastServive.new({
    place: "topRight",
    duration: 2,
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
    if (!userInfo || userInfo.role === "student") {
      logoutHandler();
    }
  }, []);
  //
  const [profileCode, setProfileCode] = useState("");
  const subject = null;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(0);
  const [DOB, setDOB] = useState(0);
  const [phone, setPhone] = useState(0);
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const formData = new FormData();

  const resetState = () => {
    setProfileCode("");
    setFullName("");
    setEmail("");
    setGender(0);
    setDOB(0);
    setPhone(0);
    setAddress("");
    setUsername("");
    setPassword("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to add a new lecturer?")) {
      try {
        const response = await createLecturer({
          faculty: {
            facultyId: 1,
            name: "KHOA CONG NGHE THONG TIN",
            facultyCode: "CNTT",
          },
          profile: {
            profileCode,
            fullName,
            DOB,
            gender,
            email,
            phone,
            address,
          },
          account: {
            username,
            password,
          },
        }).unwrap();
        toast.success("Lecturer Created");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      refetch();
      navigate("/lecturers");
    }
  };

  const handleEditRow = async ({ values, table }) => {
    if (window.confirm("Are you sure you want to edit this lecturer?")) {
      try {
        const response = await editLecturer(values);
        toast.success("Lecturer Edited");
        window.confirm("Lecturer Edited SUCCESS");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        window.confirm("Lecturer Edited FAILED");
      }
      refetch();
      navigate("/lecturers");
    }
    table.setEditingRow(null);
  };

  useEffect(() => {
    if (subject) {
      setProfileCode(subject.productCode);
      setFullName(subject.name);
      setEmail(subject.price);
      setImage(subject.image);
      setStatus(subject.status);
      setType(subject.type);
      setSize(subject.size);
      setCountInStock(subject.countInStock);
      setDescription(subject.description);
    }
  }, [subject]);

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

  const { data, isLoading, error, refetch } = useGetLecturersQuery({
    searchRequest,
  });

  const [deleteLecturer, { isLoading: loadingDelete }] =
    useDeleteLecturersMutation();

  const deleteHandler = async (subject) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteLecturer(subject);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createLecturer, { isLoading: loadingCreate }] =
    useCreateLecturersMutation();

  const [editLecturer, { isLoading: loadingEdit }] =
    useUpdateLecturersMutation();

  const columns = useMemo(() => [
    {
      accessorKey: "lecturerId",
      header: "ID",
      enableEditing: false,
      size: 1,
    },
    {
      accessorKey: "faculty.name",
      header: "KHOA",
    },
    {
      accessorKey: "profile.profileCode",
      header: "MA GV",
    },
    {
      accessorKey: "profile.fullName",
      header: "TÊN",
    },
    {
      accessorKey: "profile.phone", //normal accessorKey
      header: "SDT",
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
            <h1 style={{ color: "black" }}>Giảng viên</h1>
          </Col>
          {/* <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col> */}
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
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
              Thêm giảng viên
            </h1>
            {loadingCreate && <Loader />}
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error.data.message}</Message>
            ) : (
              <>
                <>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="MÃ GV"
                      onChange={(e) => setProfileCode(e.target.value)}
                      value={profileCode}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="HỌ VÀ TÊN"
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      type="email"
                      variant="outlined"
                      color="secondary"
                      label="EMAIL"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    />
                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                      <TextField
                        type="gender"
                        variant="outlined"
                        color="secondary"
                        label="GIỚI TÍNH"
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        fullWidth
                        required
                      />
                      <TextField
                        type="date"
                        variant="outlined"
                        color="secondary"
                        label="NGÀY SINH"
                        onChange={(e) => setDOB(e.target.value)}
                        value={DOB}
                        fullWidth
                        required
                      />
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{}}>
                      <TextField
                        type="number"
                        variant="outlined"
                        color="secondary"
                        label="SDT"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        required
                        fullWidth
                        sx={{ mb: 4 }}
                      />
                      <TextField
                        type="text"
                        variant="outlined"
                        color="secondary"
                        label="CẤP ĐỘ"
                        onChange={(e) => setQualification(e.target.value)}
                        value={qualification}
                        fullWidth
                        sx={{ mb: 4 }}
                      />
                    </Stack>

                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="ĐỊA CHỈ"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                      fullWidth
                      sx={{ mb: 4 }}
                    />
                    <Stack spacing={2} direction="row" sx={{}}>
                      <TextField
                        type="text"
                        variant="outlined"
                        color="secondary"
                        label="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        fullWidth
                        required
                        sx={{ mb: 4 }}
                      />
                      <TextField
                        type="password"
                        variant="outlined"
                        color="secondary"
                        label="PASSWORD"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        fullWidth
                        required
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
