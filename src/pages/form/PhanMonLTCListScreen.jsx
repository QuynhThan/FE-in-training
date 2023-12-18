import { LinkContainer } from "react-router-bootstrap";
import { Table, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Old/Message";
import Loader from "../../components/Old/Loader";
import {
  useGetSubjectsQuery,
  useDeleteSubjectMutation,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useUploadProductImageMutation,
} from "../../slices/subjectsApiSlice";
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
import "../../App.css";
import { MultiSelectComponent } from "@syncfusion/ej2-react-dropdowns";
import {
  TextField,
  Button,
  Stack,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import ToastServive from "react-material-toast";
import {
  useCreateClassCreditsMutation,
  useGetClassCreditsQuery,
  usePhanCongMutation,
} from "../../slices/classCreditApiSlice";
import { useGetSemesterQuery } from "../../slices/semesterApiSlice";
import { AiOutlineSearch } from "react-icons/ai";

const ProductListScreen = () => {
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
    if (!userInfo || userInfo.role !== "employee") {
      logoutHandler();
    }
  }, []);
  //
  const [ltcCode, setltcCode] = useState(" ");
  // const subject = null;
  const [name, setName] = useState("");
  const [creditNum, setCreditNum] = useState(0);
  const [theoryNum, setTheoryNum] = useState(0);
  const [practicalNum, setPracticalNum] = useState(0);
  const [academicYear, setAcademicYear] = useState(0);
  const [prerequisiteCode, setPrerequisite] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [listGV, setListGV] = useState([]);
  const [allGV, setAllGV] = useState([]);
  const [semesterNo, setSemesterNo] = useState(0);
  const [subject, setSubject] = useState({});
  const [data, setData] = useState([]);
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();
  const formData = new FormData();

  const resetState = () => {
    setltcCode("");
    setName("");
    setCreditNum(0);
    setTheoryNum(0);
    setPracticalNum(0);
    setAcademicYear(0);
    setPrerequisite("");
    setListGV([]);
    setSemesterNo(0);
    setData([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      try {
        const response = await phanCong({
          classCreditId: ltcCode,
          listGV,
          phanMon: true,
        }).unwrap();
        toast.success("Phan Mon thanh cong");
        // resetState();
        handleSearch(e);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      refetch();
      navigate("/phan-mon-ltc");
    }
  };

  const handleEditRow = async ({ values, table }) => {
    if (window.confirm("Are you sure you want to edit this subject?")) {
      try {
        const response = await editSubject(values);
        toast.success("Subject Edited");
        window.confirm("Subject Edited SUCCESS");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        window.confirm("Subject Edited FAILED");
      }
      refetch();
      navigate("/subjects");
    }
    table.setEditingRow(null);
  };

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
  // const { data, isLoading: loadingCC, error: errorCC, refetch: refetchCC } = useGetClassCreditsQuery({
  //   se
  // });

  const {
    data: semesterData,
    isLoading,
    error,
    refetch,
  } = useGetSemesterQuery({
    searchRequest,
  });
  const {
    data: gvData,
    isLoading: gvIsLoading,
    error: gvError,
    refetch: gvRefetch,
  } = useGetLecturersQuery({
    searchRequest,
  });
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteSubjectMutation();

  const deleteHandler = async (subject) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(subject);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const editHandler = async (subject) => {
    try {
      setltcCode(subject?.classCreditId);
      setName(subject?.showDetails);
      setListGV(subject?.listGV);
      // setListGV(["GV 1"]);
      setAllGV(["GV 1", "GV 2", "GV 3"]);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const [phanCong, { isLoading: loadingCreate }] = usePhanCongMutation();

  const [editSubject, { isLoading: loadingEdit }] = useUpdateSubjectMutation();
  const listData = ["GV01", "GV02"];
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
      accessorKey: "className", //normal accessorKey
      header: "Lớp",
    },
    {
      accessorKey: "groupNumber", //normal accessorKey
      header: "Nhóm",
    },
    // {
    //   accessorKey: "regisOpening", //normal accessorKey
    //   header: "NGÀY MỞ ĐĂNG KÝ",
    // },
    // {
    //   accessorKey: "regisClosing", //normal accessorKey
    //   header: "HẠN ĐĂNG KÝ",
    // },
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
  const handleSelectSubject = (key) => {
    data.map((s) => {
      if (s.classCreditId === key) {
        editHandler(s);
      }
    });
  };
  // const [searchLTC, { isLoading: loadingLTC }] = useGetClassCreditsQuery();
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("1231231231");
    try {
      postData(
        "http://localhost:8080/in-training/v1/admin/class-credit-maintenance/retrieve",
        { semesterId: semesterNo }
      ).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        setData(data);
      });
      // const response = await useGetClassCreditsQuery({
      //   semesterId: semesterNo,
      // });
      // // toast.success("Class Credit Created");
      // // resetState();
      // console.log(response);
      // setData(response.getAll());
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    // refetch();
    navigate("/phan-mon-ltc");
  };

  return (
    <>
      <div className="table-container">
        <Row className="align-items-center">
          <Col>
            <h1 style={{ color: "black" }}>Phân môn</h1>
          </Col>
          {/* <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col> */}
        </Row>
        <form onSubmit={handleSearch}>
          <Stack spacing={3} direction="row" sx={{}}>
            <TextField
              select
              variant="outlined"
              color="secondary"
              label="Học kỳ"
              onChange={(e) => {
                setSemesterNo(e.target.value);
              }}
              value={semesterNo}
              fullWidth
              required
            >
              {semesterData?.map((s) => (
                <MenuItem value={s.semesterId}>{s.name}</MenuItem>
              ))}
            </TextField>
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
        {isLoading && data ? (
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
                    <Tooltip title="edit">
                      <IconButton
                        variant="danger"
                        // color="error"
                        onClick={() => editHandler(row.original)}
                      >
                        <Edit />
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
              Phân môn học
            </h1>
            {loadingCreate && <Loader />}
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error.data.message}</Message>
            ) : (
              <>
                <>
                  <form onSubmit={handleSubmit} action={<Link to="/login" />}>
                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="MÃ LTC"
                      onChange={(e) => setltcCode(e.target.value)}
                      value={ltcCode}
                      fullWidth
                      disabled
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      select
                      variant="outlined"
                      color="secondary"
                      label="TÊN"
                      // disabled
                      onChange={(e) => {
                        handleSelectSubject(e.target.value);
                      }}
                      value={ltcCode}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    >
                      {data?.map((s) => (
                        <MenuItem value={s.classCreditId}>
                          {s.showDetails}
                        </MenuItem>
                      ))}
                    </TextField>
                    <MultiSelectComponent
                      {...listGV}
                      value={listGV}
                      placeholder="Chọn Giảng Viên"
                      dataSource={gvData}
                      onChange={(e) => setListGV(e.value)}
                      fields={{ value: "lecturerId", text: "profile.fullName" }}
                      popupHeight="200"
                    ></MultiSelectComponent>
                    <Button
                      variant="outlined"
                      color="secondary"
                      type="submit"
                      style={{ marginTop: "20px" }}
                    >
                      Tạo
                    </Button>
                  </form>
                </>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductListScreen;
