import { createAction } from "@reduxjs/toolkit";

export const setaccessLevels = createAction<any>("accessLevels/setAccessLevels");

export const resetaccessLevels = createAction<any>("accessLevels/resetAccessLevels");