import { useState } from "react";
import { delay } from "../utils/utilityFunctions";
import Spinner from "../Components/Spinner";

const KYC = () => {
  const [loading, setLoading] = useState(false);
  const [kYCProcessing, setKYCProcessing] = useState(false);
  const [kYCComplete, setKYCComplete] = useState(false);

  const [T2loading, setT2Loading] = useState(false);
  const [T2kYCProcessing, setT2KYCProcessing] = useState(false);
  const [T2kYCComplete, setT2KYCComplete] = useState(false);

  const handleKYC = async () => {
    setLoading(true);
    await delay();
    setKYCProcessing(true);
    setLoading(false);
  };

  const handleT2KYC = async () => {
    setT2Loading(true);
    await delay();
    setT2KYCProcessing(true);
    setT2Loading(false);
  };

  return (
    <main className="pt-4 h-full space-y-8 flex flex-col justify-center">
      <div className="p-4 rounded-xl bg-[#045725] w-full space-y-2">
        <p className="text-sm">Complete your Tier 1 KYC to start transacting</p>
        <div className="text-sm">
          <p className="font-medium">Required:</p>
          <ul className="list-disc list-inside">
            <li>Government issued ID</li>
            <li>Facial recognition</li>
          </ul>
        </div>

        {kYCComplete ? (
          <button className="min-w-full bg-[#250335] mx-auto" disabled={true}>
            KYC Complete
          </button>
        ) : !kYCProcessing ? (
          loading ? (
            <button className="min-w-full bg-[#250335] mx-auto">
              <Spinner as="div" />
            </button>
          ) : (
            <button
              className="min-w-full bg-[#250335] mx-auto"
              onClick={handleKYC}
            >
              Verify
            </button>
          )
        ) : (
          <button className="min-w-full bg-[#250335] mx-auto" disabled={true}>
            KYC Processing
          </button>
        )}
      </div>

      <div className="p-4 rounded-xl bg-[#250335] w-full space-y-2">
        <p className="text-sm">
          Upgrade to Tier 2 to enable Turkish Lira withdrawals
        </p>
        <div className="text-sm">
          <p className="font-medium">Required:</p>
          <ul className="list-disc list-inside">
            <li>Mucharet</li>
            <li>Turkish Government issued ID</li>
          </ul>
        </div>
        {T2kYCComplete ? (
          <button className="min-w-full bg-[#045725] mx-auto" disabled={true}>
            Tier 2 Complete
          </button>
        ) : !T2kYCProcessing ? (
          T2loading ? (
            <button className="min-w-full bg-[#045725] mx-auto">
              <Spinner as="div" />
            </button>
          ) : (
            <button
              className="min-w-full bg-[#045725] mx-auto"
              onClick={handleT2KYC}
            >
              Upgrade
            </button>
          )
        ) : (
          <button className="min-w-full bg-[#045725] mx-auto" disabled={true}>
            Tier 2 KYC Processing
          </button>
        )}
      </div>
    </main>
  );
};

export default KYC;
