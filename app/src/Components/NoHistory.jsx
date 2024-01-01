const NoHistory = () => {
  return (
    <div className="rounded-lg w-full  bg-[#161817] ">
      <p className="border-b border-[#e9ebd94d] text-[#55BB6C] p-4">
        Transaction History
      </p>
      <div className="flex flex-col place-items-center ">
        <div className="">
          <img
            className="m-2 md:m-5 lg:m-10"
            src="/images/Empty-folder.png"
            alt="empty transaction history"
            srcset=""
          />
        </div>
        <div className="mb-5">
          <p className="text-sm text-center text-[#D4B998]">
            No history records. <br /> Make a transaction to view{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoHistory;
