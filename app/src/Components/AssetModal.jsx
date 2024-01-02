import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import AssetCard from "./AssetCard";

const AssetModal = ({ isOpen, setIsOpen, assets, setSelected }) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full justify-bottom text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden pb-8 rounded-t-2xl bg-[#161817] text-white self-end text-left align-middle shadow-xl transition-all mx-auto max-w-md">
                <div className="w-1/3 mx-auto">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="bg-[#3c3f3d] p-0 h-1.5 w-full"
                  ></button>
                </div>

                <Dialog.Title
                  as="h3"
                  className=" text-[#55BB6C] border-b border-[#e9ebd94d] px-4 py-2 self-end"
                >
                  Select Token
                </Dialog.Title>
                <div className="mt-2 p-4 space-y-2">
                  {assets.map((asset, assetIdx) => (
                    <AssetCard
                      asset={asset}
                      dropdown={false}
                      key={assetIdx}
                      asInput={true}
                      setSelected={setSelected}
                    />
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AssetModal;
