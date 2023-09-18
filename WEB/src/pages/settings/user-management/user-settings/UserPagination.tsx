import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import { getUserRequest } from "../../../../redux/slice/user-management-slice/GetUserSlice";

const RolePagination = ({ totalUsers }: { totalUsers: any }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [total, setTotal] = useState();
  //   const [totalPage,setTotalPage]=useState();

  const { currentPage, totalPages } = useSelector(
    (state: any) => state.getUser
  );


  const startIndex = (currentPage - 1) * 10 + 1;
  const endIndex = Math.min(startIndex + 9, 50); // Assuming 50 as dataLength
  const dataLength = 50; // Example value
  const rowsPerPage = 10; // Example value

  useEffect(() => {
    dispatch(getUserRequest());
   setTotal(totalUsers)
  }, [dispatch]);

  const handleNextPage = () => {
    if (currentPage < totalUsers) {
      dispatch(getUserRequest(String(currentPage + 1)));
      navigate(`/?page=${currentPage + 1}`);
    }
  };

  const handleBackPage = () => {
    // if (currentPage > 1) {
      dispatch(getUserRequest(String(currentPage - 1)));
      navigate(`/?page=${currentPage - 1}`);
    // }
  };


  return (
    <div
      className="pagination-header"
      style={{
        background: "rgba(32, 41, 56, 1)",
        display: "flex",
        height: "9%",
        justifyContent: "space-between",
        position: "absolute",
        width: "81%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1%",
          fontFamily: "Inter !important",
          fontSize: "14px",
          color: "white",
        }}
      >
        {startIndex} - {endIndex} of {totalUsers} items
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton
            onClick={handleBackPage}
            disabled={currentPage === 1}
            style={{
              fontFamily: "Inter !important",
              fontSize: "14px",
              color: "white",
            }}
          >
            <ChevronLeftIcon />
            <div>Previous</div>
          </IconButton>
          <div>
            {Array.from(
              Array(Math.ceil(totalUsers / rowsPerPage) || 0).keys()
            ).map((index) => (
              <IconButton
                key={index}
                onClick={() => dispatch(getUserRequest(String(index + 1)))}
                disabled={currentPage === index + 1}
                style={{
                  fontFamily: "Inter !important",
                  fontSize: "14px",
                  color: "white",
                }}
              >
                <div
                  style={{
                    background:
                      currentPage === index + 1 ? "#F46662" : "#161C23",
                    padding: "30%",
                    borderRadius: "1%",
                  }}
                  onClick={() => dispatch(getUserRequest(currentPage))}
                >
                  {index + 1}
                </div>
              </IconButton>
            ))}
          </div>

          <IconButton
            onClick={handleNextPage}
            disabled={endIndex >= totalUsers}
            style={{
              fontFamily: "Inter !important",
              fontSize: "14px",
              color: "white",
            }}
          >
            Next
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default RolePagination;
