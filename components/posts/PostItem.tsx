import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { formatDistanceToNowStrict } from "date-fns";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import useLike from "@/hooks/useLike";

import Avatar from "../Avatar";
import { toast } from "react-hot-toast";

interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
  onDelete?: () => void; // Add onDelete prop
  onEdit?: () => void; // Add onDelete prop
}

const PostItem: React.FC<PostItemProps> = ({ data, userId, onDelete, onEdit }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });

  const [editedBody, setEditedBody] = useState(""); // Add editedBody state
  const [isEditing, setIsEditing] = useState(false); // Add setIsEditing state

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

  // Add the delete logic
  const handleDelete = useCallback(async () => {
  if (!currentUser) {
    return loginModal.onOpen();
  }
  // Call the delete API endpoint or implement the delete logic here
  try {
    const response = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: data.id }),
    });
    if (response.ok) {
      // onDelete?.(); // Call the onDelete callback if provided
      toast.success("Delete successful");
      router.push("/");
    } else {
      console.log("Delete failed");
    }
  } catch (error) {
    console.log("Delete error:", error);
  }
}, [currentUser, data.id, loginModal, onDelete]);

// Add the edit logic
  const handleEdit = useCallback(
  async (event: any) => {
    event.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    // Call the edit API endpoint or implement the edit logic here
    try {
      const response = await fetch("/api/posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: data.id, editedBody }),
      });
      if (response.ok) {
        // onEdit?.(); // Call the onEdit callback if provided
        toast.success("Edit successful");
        router.push("/");
        setIsEditing(false); // Exit edit mode
      } else {
        console.log("Edit failed");
      }
    } catch (error) {
      console.log("Edit error:", error);
    }
  },
  [currentUser, data.id, editedBody, loginModal, onEdit]);

  const toggleEdit = useCallback(() => {
    setIsEditing((prevIsEditing) => !prevIsEditing); // Toggle isEditing value
  }, []);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedBody(event.target.value);
  }, []);

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
            <span className="text-[#475885] text-sm">{createdAt}</span>
          </div>
          {isEditing ? (
          <textarea
            value={editedBody}
            onChange={handleInputChange}
            placeholder="Click the edit button again to save your changes."
            className="w-full p-2 mt-2 text-[#475885] border border-gray-300 rounded-md focus:border-[#7680E5] focus:outline-none resize-none"
            />
          ) : (
            <div className="text-[#475885] mt-1">{data.body}</div>
          )}
            {data.imageUrl && (
              <img src={data.imageUrl} alt="Uploaded" className="mt-3 rounded-lg max-h-64 content-center" />
            )}
          <div className="flex flex-row items-center mt-3 gap-10">
            {/* comments */}
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
            {/* likes */}
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
            {/* edit */}
            {currentUser?.id === data.user.id && (
              <div
                onClick={isEditing ? handleEdit : toggleEdit} // Update onClick event handler
                className={`
                  flex
                  flex-row
                  items-center
                  text-[#475885]
                  gap-2
                  cursor-pointer
                  transition
                  hover:text-[#7680E5]
                `}
              >
                <AiOutlineEdit size={20} />
              </div>
            )}
            {/* delete */}
            {currentUser?.id === data.user.id && (
              <div
              onClick={handleDelete}
              className={`
                flex
                flex-row
                items-center
                text-[#475885]

                gap-2
                cursor-pointer
                transition
                hover:text-red-500
              `}
            >
              <AiOutlineDelete size={20}/>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
