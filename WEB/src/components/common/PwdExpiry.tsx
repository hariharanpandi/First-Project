import React from 'react'
import { Grid } from '@mui/material'
import { Expiry } from '../../assets/icons/Expiry'
import "../../styles/auth-styles/PwdExpiry.css"

export const PwdExpiry = () => {
  return (
    <Grid container className='pwd-expiry' padding={20}>
      <Grid item md={6} sx={{ textAlign: 'center' }} paddingLeft={15}>
        <div className="reset-text1">Reset Password Link Expired</div>
        <div className='reset-text2'>Sorry, the link to reset your password has expired. Please</div>
        <div className='reset-text3'>request a new one to continue</div>
      </Grid>
      <Grid item md={6} sx={{ textAlign: 'center' }}>
        <Expiry />
      </Grid>
    </Grid>
  )
}
