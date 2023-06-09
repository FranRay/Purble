import { useRouter } from "next/router";
import { useCallback } from "react";
import { IconType } from "react-icons";
import { BsDot } from "react-icons/bs";

import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
  auth?: boolean;
  alert?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
  auth,
  alert,
}) => {
  const loginModal = useLoginModal();
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }

    if (auth && !currentUser) {
      loginModal.onOpen();
    } else if (href) {
      router.push(href);
    }
  }, [onClick, router, href, currentUser, auth, loginModal]);

  return (
    <div onClick={handleClick} className="flex flex-row items-center">
      <div
        className="
            relative
            rounded-full
            h-14
            w-14
            flex
            items-center
            justify-center
            p-4
            hover:bg-slate-300
            hover:bg-opacity-10
            cursor-pointer
            lg:hidden
            "
      >
        <Icon size={28} color="#A4B6E1" />
        {alert ? (
          <BsDot className="text-[#7680E5] absolute -top-4 left-0" size={70} />
        ) : null}
      </div>
      <div
        className="
          relative
          hidden
          lg:flex
          items-center
          gap-4
          p-4
          rounded-full
          hover:bg-slate-300
          hover:bg-opacity-10
          cursor-pointer
          "
      >
        <Icon size={20} color="#A4B6E1" />
        <p className="hidden lg:block text-[#475885] text-md">{label}</p>
        {alert ? (
          <BsDot className="text-[#7680E5] absolute -top-4 left-0" size={70} />
        ) : null}
      </div>
    </div>
  );
};

export default SidebarItem;
