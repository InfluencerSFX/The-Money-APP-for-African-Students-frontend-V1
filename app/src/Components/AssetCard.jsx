import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { filterMarker, show } from "../utils/utilityFunctions";
import Snackbar from "./Snackbar";

const CardBody = ({ asset, dropdown }) => {
  const copyText = () => {
    console.log("copying...");
    const text = asset.contract_address;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        show("Copied to clipboard");
        console.log("Text copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  useEffect(() => {
    (async () => {
      const copyButton = document.getElementById(`${asset.marker}-copyBtn`);
      if (copyButton) {
        copyButton.addEventListener("click", copyText);
      }
    })();
  }, []);

  const networkDisplay = {
    TRON: "TRC20",
    BSC: "BEP20",
    POLYGON: "POLYGON",
  };

  return (
    <>
      <Snackbar />
      <div
        className={`${
          dropdown ? "flex flex-row gap-3" : "flex flex-row gap-2"
        }`}
      >
        <img
          className={dropdown ? "basis-1/5 h-7 my-auto" : "basis-1/5 my-auto"}
          src={`/images/${asset.marker.toLowerCase()}.png`}
          alt=""
        />
        <div className="space-y-1">
          <p className="text-lg text-start text-[#fbf7f4]">{asset.marker}</p>
          <p className="text-xs text-start text-[#C4A383]">
            {networkDisplay[asset.network]}
          </p>
        </div>
      </div>
      {/* <div>
        <p className="text-sm text-[#CFC7CE] space-x-2">
          <span id={`${asset.marker}-textToCopy`}>
            {`${asset.contract_address.slice(
              0,
              5
            )}...${asset.contract_address.slice(
              asset.contract_address.length - 4
            )}`}
          </span>
          <FontAwesomeIcon id={`${asset.marker}-copyBtn`} icon={faCopy} />
        </p>
      </div> */}
      {!dropdown ? (
        <div className="space-y-1 justify-end">
          <p className="text-lg text-[#CEC6BD]">{asset.value}</p>
          <p className="text-xs text-end text-[#C4A383]">USD</p>
        </div>
      ) : (
        <div className="flex-none justify-end ms-2 my-auto">
          <ChevronDownIcon className="h-5 w-5 text-[#55BB6C]" />
        </div>
      )}
    </>
  );
};

const AssetCard = ({ asset, dropdown, setSelected, asInput }) => {
  const handleClick = () => {
    if (asInput) {
      setSelected(asset);
    }
  };
  return (
    <>
      {!dropdown ? (
        <button
          className="flex justify-between w-full p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d]"
          onClick={handleClick}
        >
          <CardBody asset={asset} dropdown={dropdown} />
        </button>
      ) : (
        <div className="flex justify-between w-full px-4 py-2 bg-[#161817] rounded-lg border border-[#e9ebd94d]">
          <CardBody asset={asset} dropdown={dropdown} />
        </div>
      )}
    </>
  );
};

export default AssetCard;
