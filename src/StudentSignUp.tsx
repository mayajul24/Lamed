import * as React from 'react';
import AWS from 'aws-sdk';
import {Avatar,Box,Button,Container,TextField,Link,Grid,Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CustomButton from "./CustomButton";
import mylogo from './pictures/mylogo.png';
import CustomTextField from './CustomTextField';
export default function StudentSignUp() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_REGION,
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

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    try {
      let profilePicture = null;

      if (selectedImage) {
        profilePicture = await uploadImageToS3(selectedImage);
        console.log("image url "+profilePicture);
        if (!profilePicture) {
          throw new Error('Failed to upload profile image');
        }
      }

      const student = {
        username: formData.get('username'),
        password: formData.get('password'),
        city: formData.get('city'),
        age: formData.get('age'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        userType: 'student',
        profilePicture,
      };

      const response = await fetch(
        process.env.REACT_APP_CREATE_STUDENT!,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(student),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const responseData = await response.json();
      if (responseData.succeeded) {
        navigate('/find_teacher', { state: { student } });
      }
    } catch (error) {
      console.error('Error in signup process:', error);
    }
  };

  return (
        <>
        <Typography sx={{fontSize:"30px"}}component="h1" variant="h5" align="center" gutterBottom>
          הרשמה
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate 
              sx={{ mt: 1,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column' 
              }}
        >
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
            label="עיר בה אתה רוצה ללמוד"
            id="city"
          />
          <CustomTextField
            name="age"
            label="גיל"
            id="age"
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