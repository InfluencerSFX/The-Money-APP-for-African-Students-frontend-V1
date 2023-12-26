const TransactionCard = ({ transaction, type }) => {
  return (
    <div className="relative flex justify-between p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d]">
      <img
        src="/images/send.png"
        className="absolute right-2 bottom-1 h-14 w-auto"
        alt=""
        srcset=""
      />
      <div className="flex flex-row gap-2">
        <div className="space-y-1">
          <p className="text-sm text-[#CEC6BD]">
            144 <span className="text-xs">USD</span>
          </p>
          <p className="text-xs text-[#C4A383]">12:22pm 23/05/2023 . Payant</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
