import useSWR from "swr";

import fetcher from "@/libs/fetcher";

// used to get the current user from the server
const usePost = (postId: string) => {
    // const url = postId ? `/api/posts=${postId}` : null;
    const url = postId ? `/api/posts/${postId}` : null
    
    const { 
        data, 
        error, 
        isLoading, 
        mutate 
    } = useSWR(url, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    }
}

export default usePost;