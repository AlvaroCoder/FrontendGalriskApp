'use client';
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

export default function StyleInputMaterialUi({
    handleChange=()=>{},
    value,
    nameInput=""
}) {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword=()=>{
      setShowPassword(!showPassword);
    }
  return (
    <div>
        <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        onChange={handleChange}
        value={value}
        name={nameInput}
        fullWidth
        required
        InputProps={{
            endAdornment : (
            <InputAdornment position="end">
                <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOffIcon /> : <Visibility />}
                </IconButton>
            </InputAdornment>
            )
        }}
        />
  </div>
  )
};
