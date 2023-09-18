import React from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";

export const SigninButton = styled(Button)`
  background-color: #f46662 !important;
  max-width: 23.875rem !important;
  height: 3.375rem !important;
  display: flex;
  justify-content: center;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 16px !important;
  font-family: Inter !important;
`;

export const SigninForm = styled.div`
  display: flex;
`;

export const Typo = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: 500,
  fontSize: "12px",
  alignItems: "center",
});

export const Label = styled.label({
  fontWeight: 300,
  fontSize: "14px",
});
