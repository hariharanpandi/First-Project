import { Box, Grid, Typography } from "@mui/material";
import { Expiry } from "../../assets/icons/Expiry";
import PageError from "../../assets/icons/PageError.svg";
import LeftArrow from "../../assets/images/LeftArrow.png";


const PageNotFound = () => {

  const handleGoBack = () =>{
    window.location.href = '/overview';
  }
  return (
  
    <Grid container className='page-not-found' padding={20}>
    <Grid item md={6} sx={{ textAlign: 'center' }} paddingLeft={15}>
      <div className="reset-text1">Ooops, Page Not Found</div>
      <div className='reset-text2'>It looks like you're a step away from your destination. </div>
      <div className='reset-text3'>Return to the app,and continue your journey</div>
      <div  className='go-to-app'><button className="p-l-29 canvas-button-create" onClick={handleGoBack}>
      <img src={LeftArrow} alt="LeftArrow" />
               <span className="back-app">Go back to app</span>
                </button> </div>
    </Grid>
    <Grid item md={6} sx={{ textAlign: 'center' }}>
     <img src={PageError} alt="not-found"/>
    </Grid>
  </Grid>
  );
};

export default PageNotFound;
