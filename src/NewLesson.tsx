import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@mui/material";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
interface Teacher {
  firstName: string;
  lastName: string;
  username: string;
  city: string;
  profilePicture?: string;
  cost: number;
}
interface Student {
  firstName: string;
  lastName: string;
  username: string;
  teacher: Teacher;
  profilePicture: string;
}

export default function NewLesson() {
  const [teacherSlots, setTeacherSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const location = useLocation();
  const [confirmSubmission, setConfirmSubmission] = useState(false);
  const { student } = location.state;
  const apiUrlAddLesson = process.env.REACT_APP_ADD_LESSON;
  const apiUrl = process.env.REACT_APP_GET_TEACHER_SLOTS!;
  const days = [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "יום שבת",
  ];

  useEffect(() => {
    async function fetchTeacherSlots() {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherUsername: student.teacher.username.username,
          }), // Adjust the structure as needed
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Response from Lambda:", data);
        if (data.succeeded) {
          console.log("async func finiished and worked great");

          setTeacherSlots(data.availableSlots || []); // Update slots from the response
        } else {
          console.error("Failed to fetch slots:", data.message);
        }
      } catch (error) {
        console.error("Error fetching teacher slots:", error);
      }
    }

    fetchTeacherSlots();
  }, []);

  async function handleConfirmSubmission(selectedSlot: TimeSlot) {
    setConfirmSubmission(true);
    handleCloseConfirmDialog();
    const { day, startTime, endTime } = selectedSlot;

    const submissionData = {
      teacherUsername: student.teacher.username.username,
      studentUsername: student.username,
      slot: { day, startTime, endTime },
    };
    const apiUrlAddLesson = process.env.REACT_APP_ADD_LESSON!;
    try {
      const response = await fetch(apiUrlAddLesson, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log("Response from Lambda:", data);
      if (data.succeeded) {
        alert("השיעור נקבע בהצלחה");
        console.log("slots: " + data.slots);
        setTeacherSlots(
          data.slots.filter((slot: TimeSlot) => !slot.hasOwnProperty("student"))
        );
      } else {
        alert("שגיאה בקביעת השיעור");
      }
    } catch (error) {
      console.error("Error sending data to Lambda:", error);
      alert("שגיאה בשליחת הטופס");
    }
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
  }
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        backgroundColor: "white",
        padding: 4,
        borderRadius: 4,
        boxShadow: 3,
        zIndex: 1,
        position: "relative",
      }}
    >
      <Typography variant="h5" component="div" >
        קביעת שיעור עם {student.teacher.username}
      </Typography>

      <Box>
        {days.map((day) => {
          const daySlots = teacherSlots.filter((slot) => slot.day === day);

          return daySlots.length > 0 ? (
            <Paper
              key={day}
              elevation={3}
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontSize: "20px" }}>
                {day}
              </Typography>
              <Grid container spacing={2}>
                {daySlots.map((slot) => (
                  <Grid item xs={4} key={slot.id}>
                    <Button
                      variant={
                        selectedSlot?.id === slot.id ? "contained" : "outlined"
                      }
                      sx={{ backgroundColor: "#009688", width: "120px" }}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {`${slot.endTime} - ${slot.startTime}`}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ) : null;
        })}
      </Box>

      {/* <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid rgba(0,0,0,0.12)",
        }}
      > */}
      <br/>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenConfirmDialog(true)}
          sx={{ backgroundColor: "#009688" }}
        >
          קבע שיעור
        </Button>
      {/* </Box> */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>אישור שיעור</DialogTitle>
        <DialogContent>
          <DialogContentText>
            אישור שיעור עם {student.teacher.username}
          </DialogContentText>
          {selectedSlot && (
            <Typography sx={{ mt: 2 }}>
              <strong>יום:</strong> {selectedSlot.day}
              <br />
              <strong>שעה:</strong>{" "}
              {`${selectedSlot.startTime} - ${selectedSlot.endTime}`}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            בטל
          </Button>
          <Button
            onClick={() => handleConfirmSubmission(selectedSlot!)} // Pass selected slot data
            color="primary"
            autoFocus
          >
            אשר
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
