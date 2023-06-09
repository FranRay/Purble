import { useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import useUser from "@/hooks/useUser";

interface AvatarProps {
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
  useDefaultClick?: boolean;
}

// profile image template
const Avatar: React.FC<AvatarProps> = ({
  userId,
  isLarge,
  hasBorder,
  useDefaultClick = true,
}) => {
  const { data: fetchedUser } = useUser(userId);
  const router = useRouter();

  const onClick = useCallback(
    (event: any) => {
      if (!useDefaultClick) return;

      event.stopPropagation();

      const url = `/users/${userId}`;

      router.push(url);
    },
    [router, userId, useDefaultClick]
  );

  // render profile image
  return (
    <div
      className={`
        ${hasBorder ? "border-4 border-[#FFFFFF]" : "border-2 border-[#A4B6E1]"}
        ${isLarge ? "h-32" : "h-12"}
        ${isLarge ? "w-32" : "w-12"}
        rounded-full
        hover:opacity-90
        transition
        cursor-pointer
        relative
      `}
    >
      <Image
        fill
        style={{
          objectFit: "cover",
          borderRadius: "100%",
        }}
        alt="Avatar"
        onClick={onClick}
        src={fetchedUser?.profileImage || "/images/placeholder.png"}
      />
    </div>
  );
};

export default Avatar;
