import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { formatDistanceToNowStrict } from "date-fns";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";

import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import useLike from "@/hooks/useLike";

import Avatar from "../Avatar";

interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });

  const goToUser = useCallback(
    (event: any) => {
      event.stopPropagation();

      router.push(`/users/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const goToPost = useCallback(() => {
    router.push(`/posts/${data.id}`);
  }, [router, data.id]);

  const onLike = useCallback(
    async (event: any) => {
      event.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <div
      onClick={goToPost}
      className="
        p-5
        rounded-xl
        bg-white
        my-5
        cursor-pointer
        hover:bg-[#D2DBF2]
        transition
        "
    >
      <div className="flex flex-row items-start gap-3">
        <div>
          <Avatar userId={data.user.id} />
        </div>
        <div>
          <div
            className="
            flex
            flex-row
            items-center
            gap-2
            "
          >
            <p
              onClick={goToUser}
              className="
                text-[#475885]
                font-semibold
                cursor-pointer
                hover:underline
                "
            >
              {data.user.name}
            </p>
            <span
              onClick={goToUser}
              className="
                text-[#475885]

                cursor-pointer
                hover:underline
                hidden
                md:block
                "
            >
              @{data.user.username}
            </span>
            <span className="text-[#475885]
 text-sm">{createdAt}</span>
          </div>
          <div className="text-[#475885] mt-1">{data.body}</div>
            {data.imageUrl && (
              <img src={data.imageUrl} alt="Uploaded" className="mt-3 rounded-lg max-h-64 content-center" />
            )}
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className="
                flex
                flex-row
                items-center
                text-[#475885]

                gap-2
                cursor-pointer
                transition
                hover:text-[#7680E5]
                "
            >
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className={`
                flex
                flex-row
                items-center
                text-[#475885]

                gap-2
                cursor-pointer
                transition
                hover:text-red-500
                ${hasLiked ? "text-red-500" : ""}
                `}
            >
              <LikeIcon size={20} />
              <p>{data.likedIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
