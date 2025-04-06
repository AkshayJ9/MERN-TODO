import React from "react";

const PageNotFound = () => {
  return (
    <>
      <div className="flex h-screen items-center justify-center space-x-1 flex-col">
        <span className="text-2xl">404</span>
        <div className="text-xl font-semibold text-green-900">
          Page Not Found{" "}
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
