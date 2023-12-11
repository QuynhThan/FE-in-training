import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Calendar.css";
import useCalendar from "../../store/Calendar";
import { createEventId } from "../../data";
import {
  useGetTimetablesDetailsQuery,
  useGetTimetablesQuery,
  useSubmitTimetableMutation,
} from "../../slices/timeTableApiSlice";
import Loader from "../../components/Old/Loader";
import { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
const Calendar = () => {
  const body = {};
  const classCredit = {};
  const searchRequest = {};
  const { currentEvents, setCurrentEvents } = useCalendar();
  const [details, setDetails] = useState({});
  const [detailsArr, setDetailsArr] = useState([]);
  //
  const [open, openchange] = useState(false);
  const functionopenpopup = async (events) => {
    setDetails(events.event);
    openchange(true);
    setDetailsArr(events.event.title?.split("\r\n"));
    console.log(events.event);
  };
  const closepopup = () => {
    openchange(false);
  };
  // popup
  const {
    data,
    isLoading,
    error: tter,
    refetch: ttref,
  } = useGetTimetablesDetailsQuery({
    searchRequest,
  });
  const handleEvents = async (events) => {
    await Promise.resolve(setCurrentEvents(events));
  };

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
    console.log(userInfo);
    if (!userInfo) {
      console.log("in side logout");
      logoutHandler();
    }
    if (classCredit) {
      // setSubjectId(classCredit.name);
      // setRoomId(classCredit.price);
      // setStatus(classCredit.status);
      // setType(classCredit.type);
      // setSize(classCredit.size);
      // setCountInStock(classCredit.countInStock);
      // setDescription(classCredit.description);
    }
  }, [classCredit]);
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

  const handleEventClick = (clickInfo) => {
    if (confirm("Are you sure you want to delete this event?")) {
      clickInfo.event.remove();
    }
  };
  const handleLog = (e) => {
    console.log(e);
  };

  return (
    <div className="calendar-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            slotMinTime={"07:00:00"}
            slotMaxTime={"17:00:00"}
            eventTextColor="black"
            allDaySlot={false}
            initialView="timeGridWeek"
            slotDuration={"00:30:00"}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            initialEvents={data}
            eventsSet={handleEvents}
            select={handleDateSelect}
            eventClick={functionopenpopup}
            contentHeight={700}
            eventBackgroundColor="black"
            eventDidMount={function (info, element) {
              // If a description exists add as second line to title
              if (
                info.event.extendedProps.description != "" &&
                typeof info.event.extendedProps.description !== "undefined" &&
                info.el.innerText != ""
              ) {
                console.log(info);
                // var str = info.el.innerText;
                // info.el.innerHTML += "222\n222";
                // (".fc-event-title")
                // .append(
                //   "<br/><b>" + info.event.extendedProps.description + "</b>"
                // );
              }
            }}
          />
        </div>
      )}
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
            <IconButton onClick={closepopup} style={{ float: "right" }}>
              <CloseIcon color="primary"></CloseIcon>
            </IconButton>{" "}
          </DialogTitle>
          <DialogContent>
            {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
            <Stack spacing={2} margin={2}>
              {detailsArr && details ? (
                <Stack margin={2} spacing={2}>
                  <TextField
                    value={details.extendedProps?.classCredit?.subject?.name}
                    label="Môn học"
                    editable="false"
                  ></TextField>
                  <TextField
                    value={details.extendedProps?.classroom?.name}
                    label="Phòng"
                    editable="false"
                  ></TextField>
                  <TextField
                    value={
                      details.extendedProps?.classCredit?.lecturer?.profile
                        ?.fullName
                    }
                    label="Giảng viên"
                    editable="false"
                  ></TextField>
                  <TextField
                    value={dayjs(details.start).format(
                      "dddd - DD/MM/YYYY HH:mm"
                    )}
                    label="Thời gian bắt đầu"
                    editable="false"
                  ></TextField>
                  <TextField
                    value={dayjs(details.end).format("dddd - DD/MM/YYYY HH:mm")}
                    label="Thời gian kết thúc"
                    editable="false"
                  ></TextField>
                </Stack>
              ) : (
                <Loader />
              )}
              {/* {detailsArr.map((x) => {
                <Text>
                  aaaaa
                  {x} <br />
                </Text>;
              })} */}
              {/* <TextField variant="outlined" label="Username">
                {details?.title}
              </TextField>
              <TextField variant="outlined" label="Password">
                {details?.title}
              </TextField>
              <TextField variant="outlined" label="Email">
                {details?.title}
              </TextField>
              <TextField variant="outlined" label="Phone">
                {details?.title}
              </TextField> */}
              {/* <FormControlLabel
                control={<Checkbox defaultChecked color="primary"></Checkbox>}
                label="Agree terms & conditions"
              ></FormControlLabel>
              <Button color="primary" variant="contained">
                Submit
              </Button> */}
            </Stack>
          </DialogContent>
          <DialogActions>
            {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Calendar;
