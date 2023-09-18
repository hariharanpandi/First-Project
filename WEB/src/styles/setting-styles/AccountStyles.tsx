import styled from "styled-components";
import { Typography } from "@material-ui/core";
import Tata from "../../assets/icons/Tata";
import { Button } from "@mui/material";
import CreateProject from "../../assets/icons/CreateProject";
export const CardLayout = styled.div`
background-color: #161C23 !important;
border-radius:8px !important; 
padding:2% !important;

// width:95 !important;
// display:flex !important;
//justify-content:space-between !important;
margin-bottom: 1%; !important;
margin-right:2% !important;
`;

export const ProfileBlock = styled.div`
  display: flex !important;
  justify-content: space-between !important;
  //  gap:65% !important;
  // margin-top:-3% !important;
`;
export const IconBlock = styled.div`
  padding-top: -3% !important;
  padding-bottom: 1% !important;
  @media (max-width: 480px) {
    padding: 2%  0% 5% 0%!important;
  }

`;

export const DetailsBlock = styled.div`
  display: flex !important;
  padding-top: 1% !important;
justify-content:space-between !important;
gap:2% !important;
`;

export const ProfileIcon = styled(Tata)({
  paddingTop: "3% !important",
});
export const Typo = styled(Typography)`
  font-family: "Inter" !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  align-items: center !important;
  color: #FFFFFF !important;
  width: 100% !important;

  @media (max-width: 480px) {
    font-size: 12px  !important;
  }
`;
export const TypoName = styled(Typography)`
  font-family: "Inter" !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  font-size: 0.875rem !important;
  align-items: center !important;
  color: #FFFFFF !important;
  width: 40px !important;
  cursor: pointer !important;

  @media (max-width: 480px) {
    font-size: 12px  !important;
    background:#31363E !important;
    width:40px !important;
    border-radius:25px  !important;
    padding: 0.1875rem 0rem 0.1875rem 0.5375rem !important;
  }
`;
// export const TypoEdit = styled(Typography)({
//   fontFamily: "Inter",
//   fontWeight: 500,
//   fontSize: "16px",
//   alignItems: "center",
//   backgroundColor: "#20262D !important",
//   borderRadius: "8px !important",
//   padding: "1% !important",
//   marginTop: "1% !important",
//   width:"100% !important"
// });
// export const PwdEdit = styled(Typography)({
//   fontFamily: "Inter",
//   fontWeight: 500,
//   fontSize: "16px",
//   alignItems: "center",
//   backgroundColor: "#20262D !important",
//   borderRadius: "8px !important",
//    padding: "1% !important",
//   marginTop: "1% !important",
//   width:"100% !important"
// });
export const PwdEdit = styled.div`
  font-family: Inter !important;
  font-weight: 400 !important;
  font-size: 13px !important;
  align-items: center !important;
  backgroud-color:#20262D !important
  padding: 1% !important;
  margin-top:1% !important;
  width:100% !important;

`;

export const TypoEdit = styled.div`
  font-family: Inter !important;
  font-weight: 400 !important;
  font-size: 13px !important;
  align-items: center !important;
  backgroud-color:#20262D !important
  padding: 1% !important;
  margin-top:0.2% !important;
  width:100% !important;
    @media (max-width: 480px) {
      margin-top:5% !important;
  }
`;
export const Typocast = styled.div`
  font-family: Inter !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  align-items: center !important;
  cursor:pointer !important;
`;
export const SettingTypo = styled.div`
  font-family: Inter !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  align-items: center !important;
  color: #b2b8bd !important;
  padding-right: 6.5rem;
`;

export const DialogButton = styled(Button)({
  backgroundColor: "#20262D !important",
  borderRadius: "8px !important",
});

export const ProfileTypo = styled(Typography)`
  font-family: "Inter" !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  align-items: center;
  width: 100% !important;
  color: #B2B8BD !important;
  padding-bottom: 1% !important; 
  @media (max-width: 480px) {
    margin-bottom: 1.5% !important;
  } 
`;
export const ProfileTypoName = styled(Typography)`
  font-family: "Inter" !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  align-items: center;
  width: 100% !important;
  color: #B2B8BD !important;
  // margin-bottom: -5px !important;

  @media (max-width: 480px) {
    font-size: 12px !important;
    margin-bottom: 0.5% !important;
  }
`;

export const InBlock = styled.div`
  display: flex !important;
 justify-content:space-around !important;
 gap:2% !important;

@media (max-width:480px){
   flex-direction:column !important;
}
`;
export const Flex = styled.div`
  display: flex !important;
  padding-top: 1% !important;
  align-items: center;
  gap: 0.5rem;
  @media(max-width:480px){
    align-items: center !important;
  }

`;
export const Delete = styled(Button)`
  background-color: #161C23 !important;
  border-radius: 24px !important;
  border-color: #F46662 !important;
  text-transform: none !important;
  padding: 7px 12px !important;
  color: #F46662 !important;
  font-family: "Inter" !important;
  font-style: normal !important;
  font-weight: 600 !important;
  font-size: 13px !important;

  @media (max-width: 480px) {
    font-size: 12px !important;
    padding:2px 8px 2px 8px !important;
    width:54px !important;
    height:28px !important;
    margin:1.8% 0.5% !important;
  }
`;


export const Upgrade = styled(Button)`
  background-color: #F46662 !important;
  border-radius: 24px !important;
  border-color: #F46662 !important;
  text-transform: none !important;
  padding: 7px 12px !important;
  color: #161C23 !important;
  font-family: "Inter" !important;
  font-style: normal !important;
  font-weight: 600 !important;
  font-size: 13px !important;

  @media (max-width: 480px) {
    font-size: 12px;
    width:67px !important;
    padding:2px 8px 2px 8px !important;
    height:28px !important;
    margin:1.8% 0.5% !important;
  }
`;

export const DelNeg = styled(Button)({
  backgroundColor: "#f46662 !important",
  borderRadius: "16px !important",
  borderColor: "#F46662 !important",
  textTransform: "none",
  padding: "9px 16px !important",
  color: "black !important",
  fontFamily: "Inter !important",
  fontStyle: "normal !important",
  fontWeight: "500 !important",
  fontSize: "13px !important",
});

export const FlexBox = styled.div`
  fontFamily: "Inter",
  fontWeight: 500,
  fontSize: "13px",
  alignItems: "center",
  
  `;

export const FlexView = styled.div`
  display: flex !important;
  justify-content: space-between;
  @media (max-width:480px){
   flex-direction:column !important;
}
`;
export const LayoutTypo = styled(Typography)({
    color: "#FFF !important",
    fontSize: "0.75rem !important",
    fontStyle: "normal !important",
    fontWeight: "600 !important",
    lineHeight: "normal !important",
});
export const Wrappers = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  // margin-top:185% !important;
    padding: 0.75rem 1rem;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: #161C23;
    gap: 5px;
    color: #B2B8BD;
    height: 3.5rem;
    justify-content: space-around;
  /* You can also set other styles like padding, margin, etc. here */
`;
export const FlexEnd = styled.div`
  margin-bottom: "2% !important";
  /* You can also set other styles like padding, margin, etc. here */
`;


export const DrawerFlex = styled.div`
display:flex !important;
// justify-content:center !immportant;
padding:5% !important;
// height:10% !important;
`


export const SearchFlex = styled.div`
display:flex !important;
justify-content:center !immportant;
padding:6% !important;
height:6% !important;
margin-top:-7% !important;
`
export const ContentFlex = styled.div`
display:flex !important;
justify-content:center !immportant;
height:72% !important;
`
export const ProfileFlex = styled.div`
display:flex !important;
justify-content:center !immportant;
height:10% !important;

margin-bottom:0% !important;
background-color: rgb(32, 38, 45) !important;
`


export const SettingButton = styled(Button)({
  backgroundColor: "#202938 !important",
  borderRadius: "16px !important",
  borderColor: "#F46662 !important",
  textTransform: "none",
  padding: "9px 16px !important",
  color: "white !important",
  fontFamily: "Inter !important",
  fontStyle: "normal !important",
  fontWeight: "500 !important",
  fontSize: "13px !important",
});

export const Project  = styled(CreateProject)({
position:"absolute",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
});
 export const ProjectTypo = styled(Typography)({
  display:"flex !important",
  justifyContent:"center !important",
 
  color: "white !important",
  fontFamily: "Inter !important",
  fontStyle: "normal !important",
  fontWeight: "500 !important",
  fontSize: "13px !important",
  alignItems:"center !important",
 });
 export const ProjectDesc= styled(Typography)({
  display:"flex !important",
  justifyContent:"center !important",
 
  color: "white !important",
  fontFamily: "Inter !important",
  fontStyle: "normal !important",
  fontWeight: "400 !important",
  fontSize: "13px !important",
  alignItems:"center !important",
 });