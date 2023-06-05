import useSWR from "swr";

import fetcher from "@/libs/fetcher";

// used to get the current user from the server
const useUser = (userId: string) => {
    const { 
        data, 
        error, 
        isLoading, 
        mutate 
    } = useSWR(userId ? `/api/users/${userId}` : null, fetcher); // null is passed to useSWR to prevent it from making a request until the userId is available

    return {
        data,
        error,
        isLoading,
        mutate,
    }
}

export default useUser;