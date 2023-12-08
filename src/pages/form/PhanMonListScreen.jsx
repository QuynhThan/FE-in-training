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
} from "@mui/material";
import { Edit } from "@mui/icons-material";

const ProductListScreen = () => {
  //
  const [subjectCode, setSubjectCode] = useState("");
  const subject = null;
  const [name, setName] = useState("");
  const [creditNum, setCreditNum] = useState(0);
  const [theoryNum, setTheoryNum] = useState(0);
  const [practicalNum, setPracticalNum] = useState(0);
  const [academicYear, setAcademicYear] = useState(0);
  const [prerequisiteCode, setPrerequisite] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [listGV, setListGV] = useState([]);
  const [allGV, setAllGV] = useState([]);
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();
  const formData = new FormData();

  const resetState = () => {
    setSubjectCode("");
    setName("");
    setCreditNum(0);
    setTheoryNum(0);
    setPracticalNum(0);
    setAcademicYear(0);
    setPrerequisite("");
    setListGV([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      try {
        const response = await createSubject({
          subjectCode,
          // name,
          // creditNum,
          // theoryNum,
          // practicalNum,
          // academicYear,
          // prerequisiteCode,
          listGV,
          phanMon: true,
        }).unwrap();
        toast.success("Subject Created");
        resetState();
        // if (file) {
        //   formData.append("files", file);
        //   formData.append("productCode", response.productCode);
        //   const res = await uploadProductImage(formData).unwrap();
        //   setImage(res.imageData);
        // }
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      // try {
      //   const res = await uploadProductImage(formData).unwrap();
      //   toast.success();
      //   setImage(res.imageData);
      // } catch (err) {
      //   toast.error(err?.data?.message || err.error);
      // }
      refetch();
      navigate("/phan-mon");
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

  useEffect(() => {
    if (subject) {
      setSubjectCode(subject.productCode);
      setName(subject.name);
      setCreditNum(subject.price);
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

  const { data, isLoading, error, refetch } = useGetSubjectsQuery({
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
      setSubjectCode(subject?.subjectCode);
      setName(subject?.name);
      setListGV(subject?.listGV);
      // setListGV(["GV 1"]);
      setAllGV(["GV 1", "GV 2", "GV 3"]);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const [createSubject, { isLoading: loadingCreate }] =
    useCreateSubjectMutation();

  const [editSubject, { isLoading: loadingEdit }] = useUpdateSubjectMutation();
  const listData = ["GV01", "GV02"];
  const columns = useMemo(() => [
    {
      accessorKey: "subjectId",
      header: "ID",
      enableEditing: false,
    },
    {
      accessorKey: "subjectCode",
      header: "MÃ MH",
      muiEditTextFieldProps: {
        type: "text",
        required: true,
        error: !!validationErrors?.subjectCode,
        helperText: validationErrors?.subjectCode,
        //remove any previous validation errors when user focuses on the input
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            subjectCode: undefined,
          }),
        //optionally add validation checking for onBlur or onChange
      },
    },
    {
      accessorKey: "name",
      header: "TÊN",
      muiEditTextFieldProps: {
        type: "text",
        required: true,
        error: !!validationErrors?.name,
        helperText: validationErrors?.name,
        //remove any previous validation errors when user focuses on the input
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            firstName: undefined,
          }),
      },
    },

    {
      accessorKey: "prerequisiteCode",
      header: "MHTQ",
    },
    {
      accessorKey: "listGVStr",
      header: "DS GV",
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
            <h1 style={{ color: "black" }}>Phân môn</h1>
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
                // enableEditing
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
                      label="MÃ MH"
                      onChange={(e) => setSubjectCode(e.target.value)}
                      value={subjectCode}
                      fullWidth
                      // disabled
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="TÊN"
                      disabled
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    />
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
