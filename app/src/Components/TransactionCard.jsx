const TransactionCard = ({ transaction }) => {
  return (
    <div className="relative flex justify-between p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d]">
      <img
        src={`/images/${transaction.type}.png`}
        className="absolute right-2 bottom-1 h-14 w-auto"
        alt=""
        srcset=""
      />
      {/* <img
        src={
          transaction.type === "receive"
            ? "/images/receive.png"
            : "/images/sent.png"
        }
        className="absolute right-2 bottom-1 h-14 w-auto"
        alt=""
        srcset=""
      /> */}
      <div className="flex flex-row gap-2">
        <div className="space-y-1">
          <p className="text-sm text-[#CEC6BD]">
            {transaction.amount} <span className="text-xs">USD</span>
          </p>
          <p className="text-xs text-[#C4A383]">
            {transaction.date} . {transaction.merchant}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
