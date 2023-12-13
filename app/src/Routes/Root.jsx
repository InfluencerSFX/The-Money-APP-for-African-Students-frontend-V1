import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className=" bg-[#000000] max-w-sm mx-auto h-screen px-6">
      <Outlet />
    </div>
  );
};

export default Root;
