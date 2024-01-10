import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const RecoveryModal = ({ isOpen, setIsOpen, email }) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
                  className=" text-[#55BB6C] border-b px-4 py-2 self-end border-[#D4B998]"
                >
                  Select Token
                </Dialog.Title>
                <div className=" p-4 space-y-2 border rounded-xl m-6 border-[#D4B998]">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <CheckCircleIcon className="h-14 w-14 text-[#55BB6C]" />
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAABI1BMVEX////qQzU0qFNChfT7vAWFr/g7gfSQs/gnefPqQTP7ugDpOCgwp1DpPC0npUrqPzHzmpT7vwD7393pNSP85eP97+7+9vb50M3rT0LrSDrvc2r4w8D3vLjub2X62df0o53sWlDwfnbxh3/+7b/8zmP+8tf92oP7wi393Zf8yDr//ff+8Mj94JP81HZMi/Tr8v7/+uv94KS1yvpPs2nd8OJ3pPeUzqKHyphbtnLp9eztY1j1sKvpLRj3qjHsUCv5rwzvaCrxfSb3nhTuXSzpNjj0jB31kwDzmIWev/na5/3C1fvN3vy+sxaesjJsrUTB4smstC6LsDdblfXcuRhVrEqt2rhrrME7n4s3oXdBit88krxzwYc7maM/jdQ+l7A4pW8vi8MS574kAAAERUlEQVRoge2W63faNhjGjeLSIssy1CQ2UIIhSbsmG2y1uSZbt16zJCu9sW5jt///r5hsIJZlyZYvPfuwPR84hyP7x8Oj930lRflfhXTQbN4najb3S+Za54N217HtVqVlO4v2oGeV9AtWb2Gamq4bRi2QYei6Zl449c5BQfJh3alpRq0Sl6Hp9sAqwO/0NT45UM3QzHYnH/mgY5u6kLzl62brQQ72YVczksnbePSuldV2PdU15b6eKXqrpUmiA7xmH8qze4ZUIlQ2lXPZSPpmBttb8+ZAit1caFnRAb0vEXw+NoHXJdgVPRdbk2EvcrJ76Wyl+/kyUfpiNhmHeiAyHHP5PjdFaEMzbKfbHwz6bceuaZHsaqYM24p52pEvFj2ruXts3zrvXoSDRy6TA5vbl6S56/fZZ/frznZAyGWi9LiB65U690jbrwdFK5eJcshretJ4TdELzbZZk6pvojanwo1W4kDqGXKZKB3O/Na1lHPggZxv5dvv4mxHGEk2HcGn37OZ2LEiyalj2FB/eBHdy7LYJypR4xnNNvIc61w9hAH96fNbuCZ3tMjoUQBXw2gMu7T75pm6U+PltqlLC0X5Aob0Z35NGk5pbOVxCFcbkNSklvMOyNEpxfb10liUd8M/Y+CNV69LYytfMnAVngieHN+R0iX1ylcMHDZENu5VpTSkXjlm4cdC+J6UhqPbN75+zMK/KQjf+zGEP2LhR0Xh17dvnDTYDT0rCK9eUXCGrYqKpQQ4LA5/8u/AS4iFhpe+oSG8/FKkNvQzNFEIL7/9qSbKMrjk2MOw/TOMXP5UjMPDwRU7LODNRAC/c5encQxOvRI95qD6E5rNRcHwdMl4r47pVbpcYOMNAHiZBT5m4XfpVepqAW8QAAC5GdgjNpXqNb18eymC8K3Pzmb9SWxHR5H1bY/CxjuwURbr71nj4+j65iIKP3wEO+FpbuPVy+gDJ2HcOyHJYEas8b1718wjxxCq7wAthD0pOFsqROwjR/DDGxAVcmXo8d1kUyG6+QhYITe9la5itul7xU5LFIMDhNK8s73JqZVAax4drJLQIw6b6aCtPByHk11di6PxfuZMYK5xRZnw6ACDCR/vTTD+NIxvJ884EeAE45t3OXhvSn4W4F9+TRyIlHh7usHj9WoZ/oC3nLgYo83/+i1KH44EcGXFDWbDB667nhKtZy75hsKF3+loqDtFTGsh3a9LRP6C/8lsChW8MJRAswS6SBj8saVX3wtDCeJ0BbknCYE/hb0Z0ZxfMil0/GmvypmGcXqeZAD+i0RzlcbOS0fg74RCCXWaVDNCuPShu2LLLVV4Jney+FqCTOYTxxtHEyxvHicPZo68mSQegWkm2xst3XQ8GQgZ0o7i1ziRT8bZNCfalzdxkYBPyDPBOZLB/mqG8WYcos1sRMH39aqAaVreyp/jrm/YdWfr6aQs8E6nc8/XfF40iv+8/gE55IDuidhvOwAAAABJRU5ErkJggg=="
                        alt="goole logo "
                        srcSet=""
                        className="absolute left-10 bottom-2 rounded-full h-4 w-4 my-auto"
                      />
                    </div>
                    <div className="my-auto">
                      <p className="text-sm text-[#55BB6C]">
                        Your wallet is backed up
                      </p>
                      <p className="text-xs text-[#D4B998]">{email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 font-normal p-6 pt-4">
                  <p className="font-bold">
                    SFX is a non-custodial wallet. This means you, and only you
                    have access to your money.
                  </p>

                  <p className="">
                    Your wallet is secured by a standard 12-word
                    <span className="font-bold mx-1">
                      Secret Recovery Phrase,
                    </span>
                    accessible in the About page.
                  </p>

                  <p className="">
                    To prevent accidental loss, your secret recovery phrase is
                    automatically backed-up to your Google account
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RecoveryModal;
