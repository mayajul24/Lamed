// utils.ts
import AWS from 'aws-sdk';

export function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
  const s3 = new AWS.S3();

    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        // Assuming these are set outside, pass them as arguments if needed
        const previewUrl = URL.createObjectURL(file);
        console.log("Image preview URL:", previewUrl);
      }
    }
  }
  
  export async function uploadImageToS3(file: File) {
    const s3 = new AWS.S3();

    try {
      const params = {
        Bucket: 'julius.maya.lamed.images',
        Key: file.name,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read',
      };
  
      const uploadResult = await s3.upload(params).promise();
      console.log('Upload successful:', uploadResult);
  
      return uploadResult.Location;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }
  