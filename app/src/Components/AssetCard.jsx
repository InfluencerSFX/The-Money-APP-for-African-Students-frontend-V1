import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CardBody = ({ asset, dropdown }) => {
  return (
    <>
      <div className={dropdown ? "flex flex-row gap-3" : "flex flex-row gap-2"}>
        <img
          className={dropdown ? "basis-1/5 h-7 my-auto" : "basis-1/5 my-auto"}
          src={asset.image}
          alt=""
        />
        <div className="space-y-1">
          <p className="text-sm text-start text-[#CEC6BD]">{asset.marker}</p>
          <p className="text-xs text-start text-[#C4A383]">{asset.network}</p>
        </div>
      </div>
      {!dropdown ? (
        <div className="space-y-1 justify-end">
          <p className="text-sm text-[#CEC6BD]">{asset.value}</p>
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
