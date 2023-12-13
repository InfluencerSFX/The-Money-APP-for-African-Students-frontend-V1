const BackupFound = () => {
  return (
    <div className="flex flex-col place-items-center h-full">
      <div className="basis-2/6 w-10/12 flex place-items-end pb-4">
        <div className="h-fit p-3 bg-faded rounded-lg  mx-auto mt-11">
          <img
            src="/images/google-drive.png"
            alt=""
            srcSet=""
            className="rounded-md my-auto h-[10%]"
          />
        </div>
      </div>

      <div className="basis-2/6 text-center space-y-3 mb-3">
        <p className="text-3xl text-[#55BB6C] ">Backup found!</p>
        <div className=" space-y-2">
          <div className="">
            <p className="font-medium text-[#D4B998]">Date saved:</p>
            <p className="text-[#CEC6BD]">31 Oct, 2023</p>
          </div>
          <div className="">
            <p className="font-medium text-[#D4B998]">Phone number:</p>
            <p className="text-[#CEC6BD]">+2348024657588</p>
          </div>
        </div>
      </div>

      <div className="basis-1/6 place-items-center font-medium bg-faded rounded-md p-4 pt-6 space-y-5">
        <p className="text-2xl text-white opacity-100">Welcome back</p>
        <p className="text-sm text-[#CEC6BD]">
          Great news! We’ve found a SFX wallet backup in your Google account
          that we will help you restoring.
        </p>
      </div>

      <div className="basis-1/6 w-full space-y-3 py-4">
        <button className=" bg-[#336D21] rounded-md w-full text-center inline-flex justify-center">
          Restore
        </button>
      </div>
    </div>
  );
};

export default BackupFound;
