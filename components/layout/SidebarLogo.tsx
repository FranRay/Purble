import { useRouter } from "next/router";
import { Gi3DMeeple } from "react-icons/gi";

const SidebarLogo = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/")}
      className="
        rounded-full
        h-14
        w-14
        p-4
        flex
        items-center
        justify-center
        hover:bg-blue-300
        hover:bg-opacity-10
        cursor-pointer
        transition
        "
    >
      <Gi3DMeeple size={28} color="#7680E5" />
    </div>
  );
};

export default SidebarLogo;
