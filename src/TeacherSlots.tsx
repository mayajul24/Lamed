import React, { useState } from 'react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    Typography, 
    Checkbox, 
    FormControlLabel, 
    Grid, 
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper
} from '@mui/material';
import { useLocation } from 'react-router-dom';

interface TeacherSlotsProps {
  teacherUsername: string;
}

function TeacherSlots({ teacherUsername}:TeacherSlotsProps) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmSubmission, setConfirmSubmission] = useState(false);

  // Days of the week in Hebrew
  const days = [
    'יום ראשון',
    'יום שני', 
    'יום שלישי', 
    'יום רביעי', 
    'יום חמישי', 
    'יום שישי', 
    'יום שבת', 
    
  ];
  // Types for availability
  interface TimeSlot {
      id: string;
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }
  interface SubmittedAvailability {
    teacherUsername: string;
    availableSlots: TimeSlot[];
    }
 
  // Generate time slots (every hour from 6 AM to 8 PM)
  const timeSlots = Array.from({length: 15}, (_, i) => {
    const hour = 6 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // State to manage availability
  const [availability, setAvailability] = useState<TimeSlot[]>(
    days.flatMap(day => 
      timeSlots.map(time => ({
        id: `${day}-${time}`,
        day,
        startTime: time,
        endTime: `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
        isAvailable: false
      }))
    )
  );
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };
  async function handleConfirmSubmission () {
    setConfirmSubmission(true);
    handleCloseConfirmDialog(); // Close the dialog after confirmation
    const availableSlots = availability.filter(slot => slot.isAvailable);
    const submissionData: SubmittedAvailability = {
      teacherUsername: teacherUsername,
      availableSlots: availableSlots
    };

    console.log('Submitting availability:', submissionData);
    const apiUrl = process.env.REACT_APP_ADD_SLOTS!;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
        
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log('Response from Lambda:', data);
      if(data.succeeded) {
        alert("הטופס נשלח בהצלחה");
      } else {
        alert("שגיאה בשליחת הטופס");
      }            

    } catch (error) {
      console.error('Error sending data to Lambda:', error);
      alert("שגיאה בשליחת הטופס");
    }
  };
  // Reset all availability
  const handleReset = () => {
    setAvailability(prev => 
      prev.map(slot => ({...slot, isAvailable: false}))
    );
  };
  // Toggle availability for a specific slot
  const toggleAvailability = (id: string) => {
    setAvailability(prev => 
      prev.map(slot => 
        slot.id === id 
          ? {...slot, isAvailable: !slot.isAvailable}
          : slot
      )
    );
  };

  // Get available slots for a specific day
  const getAvailableSlots = (day: string) => {
    return availability
      .filter(slot => slot.day === day && slot.isAvailable)
      .map(slot => `${slot.startTime} - ${slot.endTime}`);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 800, 
        margin: 'auto', 
        height: '90vh', 
        display: 'flex', 
        flexDirection: 'column',
        direction: 'rtl' 
      }}
    >
      <CardHeader 
        title={
          <Typography variant="h5" component="h1">
            הגדרת זמינות שיעורי נהיגה
          </Typography>
        } 
      />
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          paddingRight: '10px'
        }}
      >
        {days.map(day => (
          <Paper 
            key={day} 
            elevation={3} 
            sx={{ 
              mb: 2, 
              p: 2, 
              backgroundColor: 'background.default' 
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {day}
            </Typography>
            <Grid container spacing={2}>
              {timeSlots.map(time => {
                const slot = availability.find(
                  s => s.day === day && s.startTime === time
                );
                return (
                  <Grid item xs={3} key={`${day}-${time}`}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={slot?.isAvailable || false}
                          onChange={() => {
                            if (slot) {
                              toggleAvailability(slot.id);
                            }
                          }}
                        />
                      }
                      label={time}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        ))}
        
        {/* Available Slots Summary */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            השעות הזמינות שלך
          </Typography>
          {days.map(day => {
            const availableSlots = getAvailableSlots(day);
            return availableSlots.length > 0 ? (
              <Typography key={day}>
                <strong>{day}:</strong> {availableSlots.join(', ')}
              </Typography>
            ) : null;
          })}
        </Box>
      </CardContent>
       {/* Action Buttons */}
       <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(0,0,0,0.12)'
      }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleReset}
        >
          אתחל
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenConfirmDialog}
        >
          הגש זמינות
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>אשר זמינות</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ?האם אתה בטוח שאתה רוצה לשלוח את הזמנים האלה
          </DialogContentText>
          {days.map(day => {
            const availableSlots = getAvailableSlots(day);
            return availableSlots.length > 0 ? (
              <Typography key={day} sx={{ mt: 1 }}>
                <strong>{day}:</strong> {availableSlots.join(', ')}
              </Typography>
            ) : null;
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            בטל
          </Button>
          <Button 
            onClick={handleConfirmSubmission} 
            color="primary" 
            disabled={confirmSubmission} // Button becomes disabled after the first click
          >
            אשר
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TeacherSlots;