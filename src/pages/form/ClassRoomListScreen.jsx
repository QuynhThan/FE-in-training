import { LinkContainer } from "react-router-bootstrap";
import { Table, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Old/Message";
import Loader from "../../components/Old/Loader";
import {
  useGetClassroomsQuery,
  useDeleteClassroomsMutation,
  useCreateClassroomsMutation,
  useUpdateClassroomsMutation,
} from "../../slices/classroomApiSlice";
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

const LecturerListScreen = () => {
  //
  const classroom = null;
  const [classroomId, setClassroomId] = useState(0);
  const [name, setName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [maxSize, setMaxSize] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const formData = new FormData();

  const resetState = () => {
    setName("");
    setRoomType("");
    setMaxSize(0);
    setClassroomId(0);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to add a new Classroom?")) {
      try {
        const response = await createClassroom({
          name,
          roomType,
          maxSize,
        }).unwrap();
        toast.success("Classroom Created");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      refetch();
      navigate("/classrooms");
    }
  };

  const handleEditRow = async ({ values, table }) => {
    if (window.confirm("Are you sure you want to edit this Classroom?")) {
      try {
        const response = await editClassroom(values);
        toast.success("Classroom Edited");
        window.confirm("Classroom Edited SUCCESS");
        resetState();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        window.confirm("Classroom Edited FAILED");
      }
      refetch();
      navigate("/classrooms");
    }
    table.setEditingRow(null);
  };

  useEffect(() => {
    if (classroom) {
      setClassroomId(classroom.classroomId);
      setName(classroom.name);
      setRoomType(classroom.roomType);
      setMaxSize(classroom.maxSize);
    }
  }, [classroom]);

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

  const { data, isLoading, error, refetch } = useGetClassroomsQuery({
    searchRequest,
  });

  const [deleteClassroom, { isLoading: loadingDelete }] =
    useDeleteClassroomsMutation();

  const deleteHandler = async (classroom) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteClassroom(classroom);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createClassroom, { isLoading: loadingCreate }] =
    useCreateClassroomsMutation();

  const [editClassroom, { isLoading: loadingEdit }] =
    useUpdateClassroomsMutation();

  const columns = useMemo(() => [
    {
      accessorKey: "classroomId",
      header: "ID",
      enableEditing: false,
      size: 1,
    },
    {
      accessorKey: "name",
      header: "MÃ PHÒNG",
    },
    {
      accessorKey: "roomType",
      header: "LOẠI",
    },
    {
      accessorKey: "maxSize",
      header: "SỨC CHỨA",
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
            <h1 style={{ color: "black" }}>Phòng học</h1>
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
              Thêm phòng học
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
                      label="MÃ PHÒNG HỌC"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="LOẠI PHÒNG"
                      onChange={(e) => setRoomType(e.target.value)}
                      value={roomType}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      color="secondary"
                      label="SỨC CHỨA"
                      onChange={(e) => setMaxSize(e.target.value)}
                      value={maxSize}
                      fullWidth
                      required
                    />

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
