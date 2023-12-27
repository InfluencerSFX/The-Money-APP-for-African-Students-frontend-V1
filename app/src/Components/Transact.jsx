import { useState } from "react";
import { Tab } from "@headlessui/react";
import CardReturner from "./CardReturner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Transact() {
  let [categories] = useState({
    wallets: [
      {
        id: 1,
        network: "POLYGON",
        marker: "USDC",
        value: 290,
        image: "/images/usdc.png",
      },

      {
        id: 2,
        network: "BSC",
        marker: "USDT",
        value: 900,
        image: "/images/usdt.png",
      },

      {
        id: 3,
        network: "CELO",
        marker: "CUSD",
        value: 2000,
        image: "/images/cusd.png",
      },
    ],
    transactions: [
      {
        id: 1,
        merchant: "PayPass",
        date: "1:12pm 23/05/2023",
        amount: 1500,
        type: "sent",
      },
      {
        id: 2,
        merchant: "Payant",
        date: "12:22pm 3/04/2023",
        amount: 400,
        type: "received",
      },
      {
        id: 3,
        merchant: "Payee",
        date: "2:20am 13/07/2022",
        amount: 5400,
        type: "sent",
      },
      {
        id: 1,
        merchant: "PayPass",
        date: "1:12pm 23/05/2023",
        amount: 1500,
        type: "sent",
      },
      {
        id: 2,
        merchant: "Payant",
        date: "12:22pm 3/04/2023",
        amount: 400,
        type: "received",
      },
      {
        id: 3,
        merchant: "Payee",
        date: "2:20am 13/07/2022",
        amount: 5400,
        type: "sent",
      },
      {
        id: 1,
        merchant: "PayPass",
        date: "1:12pm 23/05/2023",
        amount: 1500,
        type: "sent",
      },
      {
        id: 2,
        merchant: "Payant",
        date: "12:22pm 3/04/2023",
        amount: 400,
        type: "received",
      },
      {
        id: 3,
        merchant: "Payee",
        date: "2:20am 13/07/2022",
        amount: 5400,
        type: "sent",
      },
      {
        id: 1,
        merchant: "PayPass",
        date: "1:12pm 23/05/2023",
        amount: 1500,
        type: "sent",
      },
      {
        id: 2,
        merchant: "Payant",
        date: "12:22pm 3/04/2023",
        amount: 400,
        type: "received",
      },
      {
        id: 3,
        merchant: "Payee",
        date: "2:20am 13/07/2022",
        amount: 5400,
        type: "sent",
      },
    ],
  });

  return (
    <div className="w-full sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-[#161817] p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 hover:ring-none",
                  selected
                    ? "bg-black text-[#55BB6C]"
                    : "text-[#D4B998] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 space-y-2">
          {Object.values(categories).map((obj, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul className=" space-y-2 container overflow-auto max-h-48 no-scrollbar focus:none">
                {obj.map((obj, index) => (
                  <li key={index}>
                    <CardReturner transaction={obj.merchant} obj={obj} />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
