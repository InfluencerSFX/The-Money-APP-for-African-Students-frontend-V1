import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const TransactionCompleteModal = ({
  transactionComplete,
  setTransactionComplete,
}) => {
  function closeModal() {
    setTransactionComplete(false);
  }

  return (
    <Transition appear show={transactionComplete} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 " />
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
              <Dialog.Panel className="w-full transform overflow-hidden  rounded-t-2xl bg-[#161817] text-white self-end text-left align-middle shadow-xl transition-all mx-auto max-w-md">
                <div className="w-1/3 mx-auto">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="bg-[#3c3f3d] p-0 h-1.5 w-full"
                  ></button>
                </div>
                <Dialog.Title
                  as="h3"
                  className=" text-[#55BB6C] border-[#e9ebd94d] border-b px-4 py-2 self-end"
                >
                  Payment successful
                </Dialog.Title>
                <div className="mt-2 p-4 space-y-2">
                  <img
                    src="/images/check.png"
                    className=" p-4 mx-auto"
                    alt=""
                    srcSet=""
                  />
                  <button
                    onClick={() => {
                      closeModal();
                    }}
                    className="inline-flex bg-[#336D21] rounded-md w-full justify-center place-content-center"
                  >
                    CLOSE
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionCompleteModal;
