import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import Avatar from "../Avatar";

interface CommentItemProps {
  data: Record<string, any>;
}

const CommentItem: React.FC<CommentItemProps> = ({ data }) => {
  const router = useRouter();

  const goToUser = useCallback(
    (event: any) => {
      event.stopPropagation();

      router.push(`/users/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  return (
    <div
      className="
        bg-white
        rounded-xl
        mt-5
        p-5
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
          <div className="flex flex-row items-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
