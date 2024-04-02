import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

const TransactionCard = ({ transaction }) => {
  const copyText = () => {
    navigator.clipboard
      .writeText(transaction.hash)
      .then(() => console.log(`${transaction.hash} copied to clipboard`))
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  useEffect(() => {
    (async () => {
      const copyButton = document.getElementById(`${transaction.hash}-copyBtn`);
      if (copyButton) {
        copyButton.addEventListener("click", copyText);
        return () => copyButton.removeEventListener("click", copyText);
      }
    })();
  }, []);
  return (
    <div className="relative flex justify-between p-4 bg-[#161817] rounded-lg border border-[#e9ebd94d]">
      <img
        src={`/images/${transaction.type.toLowerCase()}.png`}
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
      <div className="flex flex-row space-x-10 items-center">
        <div className="space-y-1">
          <p className="text-sm text-[#CEC6BD]">
            {transaction.type} {transaction.amount}{" "}
            <span className="text-xs">{transaction.asset}</span>
          </p>
          <p className="text-xs text-[#C4A383]">
            {new Date(transaction.date).toDateString()}{" "}
            {new Date(transaction.date).toLocaleTimeString()}
          </p>
        </div>
        <div>
          <p
            className={`text-md ${
              transaction.status === "Pending"
                ? "text-[#C4A383]"
                : transaction.status === "Successful"
                ? "text-[#5fe253]"
                : "text-[#ea4c4c]"
            }`}
          >
            {transaction.status}
          </p>
        </div>
        <div className="space-x-2">
          <span>
            {transaction.hash.slice(0, 5)}...
            {transaction.hash.slice(transaction.hash.length - 4)}
          </span>
          <FontAwesomeIcon id={`${transaction.hash}-copyBtn`} icon={faCopy} />
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
