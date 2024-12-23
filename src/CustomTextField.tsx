import React, { useState } from 'react';
import {TextField} from "@mui/material";

interface CustomTextFieldProps {
  id?:string;
  label?:string;
  name?:string;
  type?:string;
  placeholder?:string;
}
export default function CustomTextField(props:CustomTextFieldProps)
{
    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }
      };
    return (<TextField margin="normal"
        required
        fullWidth
        id= {props.label}
        label={props.label}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        autoFocus
        sx={textFieldStyle}></TextField>);
}
