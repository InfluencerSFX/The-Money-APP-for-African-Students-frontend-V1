import AssetCard from "./AssetCard";
import TransactionCard from "./TransactionCard";

const CardReturner = ({ transaction, obj }) => {
  return transaction ? (
    <TransactionCard transaction={obj} type={obj.type} />
  ) : (
    <AssetCard asset={obj} />
  );
};

export default CardReturner;
