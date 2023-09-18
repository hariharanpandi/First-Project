import React from "react";
import { Audio, Bars } from "react-loader-spinner";

export const Loaders = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Bars
        height={50}
        width={50}
        color="#cf6679"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
      />
    </div>
  );
};
