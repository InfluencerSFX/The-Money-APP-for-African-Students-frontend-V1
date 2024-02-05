import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { AxiosType, postMethod } from "../api/axios";

const CardBody = ({ partner }) => {
  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <>
      <div className={`flex flex-row gap-3`}>
        <img
          className={"basis-1/5 h-7 my-auto"}
          src={
            "https://res.cloudinary.com/dow1kghsa/image/upload/v1707139648/paychant_tywdri.png"
          }
          alt=""
        />
        <div className="space-y-1">
          <p className="text-md text-start text-[#C4A383]">{partner}</p>
        </div>
      </div>
    </>
  );
};

const PartnerCard = ({ partner }) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  async function paychantFund() {
    const url = await postMethod(
      "/wallet/paychant-fund?assetAmount=10",
      {},
      AxiosType.Main,
      token,
      refreshToken
    );

    console.log(url.split(" ").join(""));
    const win = window.open(url.split(" ").join(""), "_blank");
    if (win != null) {
      win.focus();
    }
  }

  return (
    <div
      onClick={paychantFund}
      className="flex justify-between w-full p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d] cursor-pointer"
    >
      <CardBody partner={partner} />
    </div>
  );
};

export default PartnerCard;
