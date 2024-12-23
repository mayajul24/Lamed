import * as React from 'react';
import {Avatar,Button,TextField,Link,Grid,Box,Typography,Container} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CustomTextField from './CustomTextField';
import CustomButton from "./CustomButton";
import AWS from 'aws-sdk';

export default function SignUp() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_REGION
  });
  const s3 = new AWS.S3();
  
  function handleImageChange (event:React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setSelectedImage(file);
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    }
  }
  const uploadImageToS3 = async (file:File) => {
    try {
      const params = {
        Bucket: process.env.REACT_APP_BUCKET!,
        Key: file.name, 
        Body: file,
        ContentType: file.type,
        ACL: 'public-read', 
      };

      const uploadResult = await s3.upload(params).promise();
      console.log('Upload successful:', uploadResult);

      // Return the public URL of the uploaded image
      return uploadResult.Location;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let profilePicture = null;

      if (selectedImage) {
        profilePicture = await uploadImageToS3(selectedImage);
        console.log("image url "+profilePicture);
        if (!profilePicture) {
          throw new Error('Failed to upload profile image');
        }
      }
    const teacherData = {
      username: data.get('username'),
      password: data.get('password'),
      city: data.get('city'),
      cost: data.get('cost'),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      userType: 'teacher',
      profilePicture 
    };
    console.log("data "+teacherData.firstName);

    const apiUrl = process.env.REACT_APP_CREATE_TEACHER!
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Response from Lambda:', data);
        if(data.succeeded)
        {
            const teacher = teacherData;
            navigate('/home-teacher',{state: {teacher}});              
        } 
    } catch (error) {
        console.error('Error sending data to Lambda:', error);
    }
  };

  return (
    <>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          הרשמה
        </Typography>
        <Box component="form" dir="rtl" sx={{
          maxHeight: '400px',  // Set your desired max height
          overflowY: 'auto',   // Enable vertical scrolling if content overflows
          display: 'flex',
          flexDirection: 'column',  // Ensure content is arranged vertically
        }}

 onSubmit={handleSubmit}>
          <CustomTextField
            id="firstName"
            label="שם פרטי"
            name="firstName"            
          />
          <CustomTextField
            id="lastName"
            label="שם משפחה"
            name="lastName"
          />
          <CustomTextField
            id="username"
            label="שם משתמש"
            name="username"
          />
          <CustomTextField
            name="password"
            label="סיסמה"
            type="password"
            id="password"
          />
          <CustomTextField
            name="city"
            label="עיר בה אתה מלמד"
            id="city"
          />
          <CustomTextField
            name="cost"
            label="מחיר לשעה"
            id="cost"
            type="number"
          />
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {imagePreview ? (
                <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 2 }} />
              ) : (
                <Avatar sx={{ width: 100, height: 100, mb: 2 }} />
              )}
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                העלאת תמונה
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            הרשמה
          </Button>
        </Box>
    </>
  );
}