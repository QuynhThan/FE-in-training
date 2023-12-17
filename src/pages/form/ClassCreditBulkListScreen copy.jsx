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
  useRetrieveCCMutation,
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
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import css from "./MultiSelect.css?inline";
import { facultyData } from "../../data";
import { useGetSubjectsQuery } from "../../slices/subjectsApiSlice";
import { useGetClassroomsQuery } from "../../slices/classroomApiSlice";
import { useGetLecturersQuery } from "../../slices/lecturerApiSlice";
import { MultiSelectComponent } from "@syncfusion/ej2-react-dropdowns";
import CheckIcon from "@mui/icons-material/Check";
import { dataTool } from "echarts";
import "../../App.css";
import "../Calendar/Calendar.css";
import { useGetStudentClassQuery } from "../../slices/studentClassApiSlice";
import {
  useSaveMutation,
  useSubmitTimetableMutation,
} from "../../slices/timeTableApiSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import useCalendar from "../../store/Calendar";
import { createEventId } from "../../data";
import ToastServive from "react-material-toast";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import moment from "moment";
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
    if (!userInfo || userInfo.role !== "employee") {
      logoutHandler();
    }
  }, []);

  const toast = ToastServive.new({
    place: "topRight",
    duration: 5,
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
  const [startDate, setStartDate] = useState(0);
  const [year, setYear] = useState(0);
  const [semesterNo, setSemesterNo] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [listSubjects, setListSubjects] = useState([]);
  const [listRooms, setListRooms] = useState([]);
  const [listClass, setListClass] = useState([]);
  // const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [timetable, setTimetable] = useState({});
  const [isTimetable, setIsTimetable] = useState(true);
  const [isTimetableSave, setIsTimetableSave] = useState(false);
  const navigate = useNavigate();
  const formData = new FormData();
  const [details, setDetails] = useState({});
  const [detailsArr, setDetailsArr] = useState([]);
  const { currentEvents, setCurrentEvents } = useCalendar();
  const [startDates, setStartDates] = useState([]);
  const [endDates, setEndDates] = useState([]);
  const resetState = () => {
    setSubjectId("");
    setRoomId("");
    setLecturerId(0);
    setRegisOpening(0);
    setRegisClosing(0);
    setYear("");
    setMinSize(0);
    setListSubjects([]);
    setListRooms([]);
    setStartDate(0);
    setListClass([]);
    setTimetable({});
    setIsTimetable(true);
    setIsTimetableSave(false);
    setStartDates([]);
    setEndDates([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (window.confirm("Are you sure?")) {
    try {
      const response = await createTimeTable({
        listClass,
        listSubjects,
        listRooms,
        startDate,
      }).unwrap();
      toast.success("Thời khóa biểu được tạo!");
      // resetState();
      setTimetable(response);
      setIsTimetable(true);
      setIsTimetableSave(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    refetch();
    navigate("/class-credit-bulk");
    // }
  };
  const saveHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await saveTimeTable({
        timeTables: timetable,
        startDate,
        startDates,
        endDates,
      }).unwrap();
      toast.success("Thời khóa biểu được lưu!");
      // resetState();
      setTimetable(response);
      setIsTimetable(true);
      setIsTimetableSave(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    refetch();
    navigate("/class-credit-bulk");
    // resetState();
  };
  const cancelHandle = async (e) => {
    e.preventDefault();
    resetState();
    toast.success("Thời khóa biểu đã bị hủy!");
  };
  const retryHandle = async (e) => {
    e.preventDefault();
    resetState();
    toast.success("Thời khóa biểu được lưu!");
  };

  // const handleEditRow = async ({ values, table }) => {
  //   if (window.confirm("Are you sure you want to edit this ?")) {
  //     try {
  //       const response = await editClassCredit(values);
  //       toast.success(" Edited");
  //       resetState();
  //     } catch (err) {
  //       toast.error(err?.data?.message || err.error);
  //     }
  //     refetch();
  //     navigate("/class-credit");
  //   }
  //   table.setEditingRow(null);
  // };

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
  //
  const [open, openchange] = useState(false);
  const functionopenpopup = async (events) => {
    setDetails(events.event);
    openchange(true);
    setDetailsArr(events.event.title?.split("\r\n"));
    console.log(events.event.title?.split("\r\n"));
    lsRefetch();
  };
  const closepopup = () => {
    openchange(false);
  };
  // popup
  const { pageNumber } = useParams();

  const searchRequest = {};
  const ccSearch = {
    filters: [
      {
        key: "status",
        operator: "EQUAL",
        fieldType: "STRING",
        value: "INACTIVE",
        valueTo: {},
        values: [{}],
      },
    ],
  };

  // const { data, isLoading, error, refetch } = useRetrieveCCMutation();
  const { data, isLoading, error, refetch } = useGetClassCreditsQuery(ccSearch);

  const { data: rooms, isLoading: isLoadingRooms } = useGetClassroomsQuery({
    searchRequest,
  });
  const { data: lecturers, isLoadingLecturers } = useGetLecturersQuery({
    searchRequest,
  });
  const {
    data: lecturerSubjects,
    isLoadingLecturerSubjects,
    refetch: lsRefetch,
  } = useGetLecturersQuery({
    subjectId: details.extendedProps?.classCredit?.classCreditId,
  });
  const { data: studentClass, isLoadingStudentClass } = useGetStudentClassQuery(
    {
      searchRequest,
    }
  );
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

  const [createTimeTable, { isLoading: loadingCreate }] =
    useSubmitTimetableMutation();

  const [saveTimeTable, { isLoading: loadingSave }] = useSaveMutation();

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
      size: 20,
    },
    {
      accessorKey: "semesterNo", //normal accessorKey
      header: "HỌC KỲ",
      size: 20,
    },
    {
      accessorKey: "status", //normal accessorKey
      header: "Trạng thái",
    },
  ]);
  Object.defineProperties(timetable, [
    {
      end: {
        writable: true,
      },
    },
  ]);

  const handleEvents = async (events) => {
    console.log(events);
    // const clone = [];

    if (events) {
      for (let i = 0; i < events.length; i++) {
        const endD = moment(events[i]._instance.range.end).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        const startD = moment(events[i]._instance.range.start).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        startDates[i] = startD;
        endDates[i] = endD;
      }
      // setTimetable(clone);
    }

    console.log("1232132");
    console.log(startDates);

    // var index = timeTable.findIndex((obj => obj.timeTableId == events));
    // timeTable[index].end = events;
    // timeTable[index].start = events;

    // await Promise.resolve(setCurrentEvents(events));
  };
  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a title for the event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      });
    }
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: "light",
      },
    })
  );
  const names = [
    "Humaira Sims",
    "Santiago Solis",
    "Dawid Floyd",
    "Mateo Barlow",
    "Samia Navarro",
    "Kaden Fields",
    "Genevieve Watkins",
    "Mariah Hickman",
    "Rocco Richardson",
    "Harris Glenn",
  ];
  return (
    <>
      <div className="table-container">
        <Row className="align-items-center">
          <Col>
            <h1 style={{ color: "black" }}>Lịch</h1>
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
            {isTimetable ? (
              <div>
                <div className="calendar-container">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    slotMinTime={"07:30:00"}
                    slotMaxTime={"16:30:00"}
                    eventTextColor="black"
                    allDaySlot={false}
                    initialView="timeGridWeek"
                    slotDuration={"00:30:00"}
                    editable={true}
                    selectable={false}
                    selectMirror={false}
                    dayMaxEvents={true}
                    weekends={true}
                    nowIndicator={true}
                    initialEvents={timetable}
                    events={timetable}
                    eventsSet={handleEvents}
                    // select={handleDateSelect}
                    eventClick={functionopenpopup}
                    contentHeight={500}
                    eventBackgroundColor="black"
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  {/* <h1>MUI - DIALOG</h1>
        <Button onClick={functionopenpopup} color="primary" variant="contained">
          Open Popup
        </Button> */}
                  <Dialog
                    // fullScreen
                    open={open}
                    onClose={closepopup}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle>
                      Chi tiết{" "}
                      <IconButton
                        onClick={closepopup}
                        style={{ float: "right" }}
                      >
                        <CloseIcon color="primary"></CloseIcon>
                      </IconButton>{" "}
                    </DialogTitle>
                    <DialogContent>
                      {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                      <Stack spacing={2} margin={2}>
                        {detailsArr && details ? (
                          <Stack margin={2} spacing={2}>
                            <TextField
                              value={
                                details.extendedProps?.classCredit?.subject
                                  ?.name
                              }
                              label="Môn học"
                              editable="false"
                            ></TextField>
                            <TextField
                              value={details.extendedProps?.classroom?.name}
                              label="Phòng"
                              editable="false"
                            ></TextField>
                            <TextField
                              // select
                              value={
                                details.extendedProps?.classCredit?.lecturer
                                  ?.profile?.fullName
                              }
                              label="Giảng viên"
                              editable="false"
                            >
                              {/* {lecturerSubjects?.map((lecturerSubject) => (
                                <MenuItem value={lecturerSubject?.lecturerId}>
                                  {lecturerSubject?.profile?.fullName}
                                </MenuItem>
                              ))} */}
                            </TextField>
                            <TextField
                              value={dayjs(details.start).format(
                                "dddd - DD/MM/YYYY HH:mm"
                              )}
                              label="Thời gian bắt đầu"
                              editable="false"
                            ></TextField>
                            <TextField
                              value={dayjs(details.end).format(
                                "dddd - DD/MM/YYYY HH:mm"
                              )}
                              label="Thời gian kết thúc"
                              editable="false"
                            ></TextField>
                          </Stack>
                        ) : (
                          <Loader />
                        )}
                      </Stack>
                    </DialogContent>
                    <DialogActions></DialogActions>
                  </Dialog>
                </div>

                {isTimetableSave ? (
                  <Stack
                    spacing={2}
                    direction="row"
                    sx={{ marginBottom: 4, marginTop: 5 }}
                  >
                    <Button
                      disabled={!isTimetableSave}
                      variant="outlined"
                      type="submit"
                      style={{ backgroundColor: "#2EDEFA", color: "black" }}
                      onClick={saveHandle}
                    >
                      Lưu
                    </Button>
                    <Button
                      disabled={!isTimetableSave}
                      variant="outlined"
                      type="submit"
                      style={{ backgroundColor: "red", color: "black" }}
                      onClick={cancelHandle}
                    >
                      Hủy
                    </Button>
                    <Button
                      disabled={!isTimetableSave}
                      variant="outlined"
                      type="submit"
                      style={{ backgroundColor: "#2DFF33", color: "black" }}
                      onClick={handleSubmit}
                    >
                      Tạo lại
                    </Button>
                  </Stack>
                ) : (
                  <Loader />
                )}
              </div>
            ) : (
              <Loader />
            )}

            <h1
              style={{
                color: "black",
                paddingTop: "100px",
                paddingBottom: "20px",
              }}
            >
              Lên lịch cho lớp tín chỉ
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
                    <Box sx={{ mb: 4 }}>
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ marginBottom: 4 }}
                      >
                        <MultiSelectComponent
                          {...listSubjects}
                          value={listSubjects}
                          placeholder="Lớp tín chỉ"
                          dataSource={data}
                          onChange={(e) => setListSubjects(e.value)}
                          fields={{
                            value: "classCreditId",
                            text: "showDetails",
                          }}
                          popupHeight="200"
                        ></MultiSelectComponent>
                      </Stack>
                      <MultiSelectComponent
                        {...listRooms}
                        value={listRooms}
                        placeholder="Phòng học"
                        dataSource={rooms}
                        onChange={(e) => setListRooms(e.value)}
                        fields={{
                          value: "classroomId",
                          text: "name",
                        }}
                        popupHeight="200"
                      ></MultiSelectComponent>
                    </Box>

                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                      <TextField
                        type="date"
                        variant="outlined"
                        color="secondary"
                        label="NGÀY BẮT ĐẦU HỌC"
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
                        fullWidth
                        required
                      />
                    </Stack>
                    {/* <Stack spacing={3} direction="row" sx={{}}>
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
                    </Stack> */}
                    <Button variant="outlined" color="secondary" type="submit">
                      Thêm
                    </Button>
                  </form>
                  {/* <small>
                      Already have an account?{" "}
                      <Link to="/login">Login Here</Link>
                    </small> */}
                  <br />
                  <br />
                  <br />
                  <br />
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
