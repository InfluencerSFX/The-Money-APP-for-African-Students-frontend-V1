const AssetCard = ({ asset }) => {
  return (
    <div className="flex justify-between p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d]">
      <div className="flex flex-row gap-2">
        <img className="basis-1/5" src={asset.image} alt="" srcset="" />
        <div className="space-y-1">
          <p className="text-sm text-[#CEC6BD]">{asset.marker}</p>
          <p className="text-xs text-[#C4A383]">{asset.network}</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[#CEC6BD]">{asset.value}</p>
        <p className="text-xs text-[#C4A383]">USD</p>
      </div>
    </div>
  );
};

export default AssetCard;
