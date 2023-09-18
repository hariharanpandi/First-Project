
import React, { useState } from "react";
import PropTypes from "prop-types";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays, subDays } from "date-fns";

const WorkloadDatePicker = (onChange:any) => {
  const [state, setState] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const handleOnChange = (ranges:any) => {
    const { range } = ranges; // Fix the destructuring here
    onChange(range);
    setState([range]);
  };

  return (
    <DateRangePicker
      onChange={handleOnChange}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
    />
  );
};

WorkloadDatePicker.propTypes = {
  onChange: PropTypes.func,
};

export default WorkloadDatePicker;