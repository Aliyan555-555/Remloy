import React from "react";
import Button from "./Button";

const AccessDeniedComponent = ({ message }) => {
  return (
    <div
      style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
      className="flex flex-col items-center justify-center p-10   rounded-lg  max-w-md mx-auto my-8 shadow"
    >
      <div className="text-3xl font-semibold text-[#2F6A50] !mb-4">
        Access Denied
      </div>
      <div className="text-gray-700 !mb-8 text-center">
        {message || "You do not have permission to access this content."}
      </div>
      <div className="flex gap-4">
        <Button
          to="/pricing"
          variant="contained"
          color="brand"
          size="medium"
          className="mt-2 !text-nowrap"
        >
          Upgrade your plan
        </Button>
        <Button
          to="/dashboard"
          variant="contained"
          size="medium"
          className="mt-2 !bg-white border-2 border-[#2F6A50] text-[#2F6A50] !text-nowrap"
        >
          Go To Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedComponent;
