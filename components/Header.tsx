import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

import SidebarLogo from "./layout/SidebarLogo";

interface HeaderProps {
  label: string;
  showBackArrow?: boolean;
}

const Header: React.FC<HeaderProps> = ({ label, showBackArrow }) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <div className="bg-white p-5 rounded-2xl my-5">
      <div className="flex flex-row items-center gap-2">
        <div className="flex md:hidden">
          <SidebarLogo />
        </div>
        {showBackArrow && (
          <BiArrowBack
            onClick={handleBack}
            color="#475885"
            size={20}
            className="
                cursor-pointer
                hover:opacity-70
                transition
                "
          />
        )}
        <h1 className="text-[#475885] text-xl font-bold">{label}</h1>
      </div>
    </div>
  );
};

export default Header;
