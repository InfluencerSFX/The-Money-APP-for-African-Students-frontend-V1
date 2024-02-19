import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  UserPlusIcon,
  BookOpenIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleOvalLeftIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import RecoveryModal from "../Components/RecoveryModal";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosType, getMethod } from "../api/axios";

const Settings = () => {
  const [backedUp, setBackedUp] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();
  const location = useLocation();

  const [userDetails, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      const user = await getMethod(
        "/auth/me",
        AxiosType.Main,
        token,
        refreshToken
      );
      setUser(user);
    })();
  }, []);

  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/auth");
  };

  return (
    <main className=" relative mobile-screen px-0 bg-[#161817] text-white">
      <div className="border-b border-[#D4B998] pt-5 bg-black">
        <button
          onClick={() =>
            navigate("/account", {
              state: { from: location },
            })
          }
          className="bg-transparent inline-flex text-[#55BB6C] gap-3 hover:border-black"
        >
          <ArrowLeftIcon className="h-6 text-[#D4B998] my-auto" />
          <p className="my-auto">Settings</p>
        </button>
      </div>
      <section className="p-6 space-y-2 py-12 bg-black">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div className="relative">
              <img
                src={
                  userDetails?.picture ||
                  "https://images.pexels.com/photos/19414563/pexels-photo-19414563/free-photo-of-a-woman-in-a-leather-jacket-sitting-on-the-ground.jpeg"
                }
                alt="user image"
                srcSet=""
                className="rounded-full h-14 w-14 my-auto"
              />
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAABI1BMVEX////qQzU0qFNChfT7vAWFr/g7gfSQs/gnefPqQTP7ugDpOCgwp1DpPC0npUrqPzHzmpT7vwD7393pNSP85eP97+7+9vb50M3rT0LrSDrvc2r4w8D3vLjub2X62df0o53sWlDwfnbxh3/+7b/8zmP+8tf92oP7wi393Zf8yDr//ff+8Mj94JP81HZMi/Tr8v7/+uv94KS1yvpPs2nd8OJ3pPeUzqKHyphbtnLp9eztY1j1sKvpLRj3qjHsUCv5rwzvaCrxfSb3nhTuXSzpNjj0jB31kwDzmIWev/na5/3C1fvN3vy+sxaesjJsrUTB4smstC6LsDdblfXcuRhVrEqt2rhrrME7n4s3oXdBit88krxzwYc7maM/jdQ+l7A4pW8vi8MS574kAAAERUlEQVRoge2W63faNhjGjeLSIssy1CQ2UIIhSbsmG2y1uSZbt16zJCu9sW5jt///r5hsIJZlyZYvPfuwPR84hyP7x8Oj930lRflfhXTQbN4najb3S+Za54N217HtVqVlO4v2oGeV9AtWb2Gamq4bRi2QYei6Zl449c5BQfJh3alpRq0Sl6Hp9sAqwO/0NT45UM3QzHYnH/mgY5u6kLzl62brQQ72YVczksnbePSuldV2PdU15b6eKXqrpUmiA7xmH8qze4ZUIlQ2lXPZSPpmBttb8+ZAit1caFnRAb0vEXw+NoHXJdgVPRdbk2EvcrJ76Wyl+/kyUfpiNhmHeiAyHHP5PjdFaEMzbKfbHwz6bceuaZHsaqYM24p52pEvFj2ruXts3zrvXoSDRy6TA5vbl6S56/fZZ/frznZAyGWi9LiB65U690jbrwdFK5eJcshretJ4TdELzbZZk6pvojanwo1W4kDqGXKZKB3O/Na1lHPggZxv5dvv4mxHGEk2HcGn37OZ2LEiyalj2FB/eBHdy7LYJypR4xnNNvIc61w9hAH96fNbuCZ3tMjoUQBXw2gMu7T75pm6U+PltqlLC0X5Aob0Z35NGk5pbOVxCFcbkNSklvMOyNEpxfb10liUd8M/Y+CNV69LYytfMnAVngieHN+R0iX1ylcMHDZENu5VpTSkXjlm4cdC+J6UhqPbN75+zMK/KQjf+zGEP2LhR0Xh17dvnDTYDT0rCK9eUXCGrYqKpQQ4LA5/8u/AS4iFhpe+oSG8/FKkNvQzNFEIL7/9qSbKMrjk2MOw/TOMXP5UjMPDwRU7LODNRAC/c5encQxOvRI95qD6E5rNRcHwdMl4r47pVbpcYOMNAHiZBT5m4XfpVepqAW8QAAC5GdgjNpXqNb18eymC8K3Pzmb9SWxHR5H1bY/CxjuwURbr71nj4+j65iIKP3wEO+FpbuPVy+gDJ2HcOyHJYEas8b1718wjxxCq7wAthD0pOFsqROwjR/DDGxAVcmXo8d1kUyG6+QhYITe9la5itul7xU5LFIMDhNK8s73JqZVAax4drJLQIw6b6aCtPByHk11di6PxfuZMYK5xRZnw6ACDCR/vTTD+NIxvJ884EeAE45t3OXhvSn4W4F9+TRyIlHh7usHj9WoZ/oC3nLgYo83/+i1KH44EcGXFDWbDB667nhKtZy75hsKF3+loqDtFTGsh3a9LRP6C/8lsChW8MJRAswS6SBj8saVX3wtDCeJ0BbknCYE/hb0Z0ZxfMil0/GmvypmGcXqeZAD+i0RzlcbOS0fg74RCCXWaVDNCuPShu2LLLVV4Jney+FqCTOYTxxtHEyxvHicPZo68mSQegWkm2xst3XQ8GQgZ0o7i1ziRT8bZNCfalzdxkYBPyDPBOZLB/mqG8WYcos1sRMH39aqAaVreyp/jrm/YdWfr6aQs8E6nc8/XfF40iv+8/gE55IDuidhvOwAAAABJRU5ErkJggg=="
                alt="goole logo "
                srcSet=""
                className="absolute left-10 bottom-2 rounded-full h-4 w-4 my-auto"
              />
            </div>
            <div className="">
              <p className="text-sm text-[#55BB6C]">
                {userDetails?.firstName} {userDetails?.lastName},
              </p>
              <p className="text-xs text-[#D4B998]">{userDetails?.email}</p>
              {backedUp && (
                <button
                  className="inline-flex space-x-1 p-0.5 px-1 rounded-xl mt-1 bg-[#161817]"
                  onClick={() => {
                    setOpenModal(!openModal);
                  }}
                >
                  <CheckCircleIcon className="h-4 text-[#55BB6C]" />
                  <p className="text-xs">Backed up</p>
                  <ChevronRightIcon className="h-4 text-[#55BB6C]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black">
        <div className="rounded-t-lg bg-[#161817] flex flex-col pt-9 px-4 space-y-4">
          <button className="inline-flex space-x-2 bg-transparent">
            <UserPlusIcon className="h-6" />
            <p className="font-normal">Invite friends</p>
          </button>
          <button className="inline-flex space-x-2 bg-transparent">
            <BookOpenIcon className="h-6" />
            <p className="font-normal">Frequently asked questions</p>
          </button>
          <button className="inline-flex space-x-2 bg-transparent">
            <ArrowTopRightOnSquareIcon className="h-6" />
            <p className="font-normal">Add App to home screen</p>
          </button>
          <button className="inline-flex space-x-2 bg-transparent">
            <ChatBubbleOvalLeftIcon className="h-6" />
            <p className="font-normal">Send feedback</p>
          </button>
          <button className="inline-flex space-x-2 bg-transparent">
            <QuestionMarkCircleIcon className="h-6" />
            <p className="font-normal">About</p>
          </button>
          <button
            className="inline-flex space-x-2 bg-transparent"
            onClick={signout}
          >
            <ArrowRightOnRectangleIcon className="h-6" />
            <p className="font-normal">Sign out</p>
          </button>
        </div>
      </section>
      <RecoveryModal
        isOpen={openModal}
        setIsOpen={setOpenModal}
        email={userDetails?.email}
      />
    </main>
  );
};

export default Settings;
