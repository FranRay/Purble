import { useRouter } from "next/router";
import { useCallback } from "react";
import { FaFeather } from "react-icons/fa";

import useLoginModal from "@/hooks/useLoginModal";
import useCurrentUser from "@/hooks/useCurrentUser";

const SidebarTweetIcon = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const { data: currentUser } = useCurrentUser();

  const onClick = useCallback(() => {
    if (!currentUser) {
      loginModal.onOpen();
    } else {
      router.push("/");
    }
  }, [loginModal, router, currentUser]);

  return (
    <div onClick={onClick}>
      <div
        className="
            my-1
            md:mt-6
            lg:hidden
            rounded-full
            h-14
            w-14
            p-4
            flex
            items-center
            justify-center
            bg-[#7680E5]
            hover:bg-opacity-80
            transition
            cursor-pointer
            "
      >
        <FaFeather size={20} color="#EEF5FF" />
      </div>
      <div
        className="
            mt-6
            hidden
            lg:block
            px-4
            py-2
            rounded-full
            bg-[#7680E5]
            hover:bg-opacity-90
            cursor-pointer
            transition
            "
      >
        <p
          className="
            hidden
            lg:block
            text-center
            font-semibold
            text-white
            text-[20px]
            "
        >
          Post
        </p>
      </div>
    </div>
  );
};

export default SidebarTweetIcon;
