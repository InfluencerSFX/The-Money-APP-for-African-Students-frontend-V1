import { useState } from "react";
import { Tab } from "@headlessui/react";
import AssetCard from "./AssetCard";
import TransactionCard from "./TransactionCard";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Transact() {
  let [categories] = useState({
    Recent: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Popular: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
  });

  return (
    <div className="w-full max-w-md sm:px-0">
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
          {Object.values(categories).map((posts, idx) => (
            // <AssetCard key={idx} />
            <TransactionCard key={idx} />
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
