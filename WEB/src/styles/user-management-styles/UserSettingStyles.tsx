import TableCell from "@material-ui/core/TableCell/TableCell";
import styled from "styled-components";
import { Button, Typography } from "@material-ui/core";

export const TableCelling = styled(TableCell)`
  alignself: center !important;
  background: rgba(32, 41, 56, 1) !important;
  border-bottom: 1px solid #202938 !important;
  color: rgba(178, 184, 189, 1) !important;
  width: 20% !important;
  font-weight: 700 !important;
  font-style: normal !important;
`;

export const StyledTableCelling = styled(TableCell)`
  box-sizing: border-box !important;
  background: #161c23;
  border-bottom: 1px solid #202938 !important;
  font-family: "Inter" !important;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 87.5% !important;
  line-height: 106.25% !important;
  color: #ffffff !important;
  text-align: left !important;
  width: 20%;
`;

export const Typographying = styled(Typography)`
  display: flex !important;
  align-items: center !important;
  font-size: 75% !important;
  font-weight: 700 !important;
`;
