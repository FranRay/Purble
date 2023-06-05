import useSWR from "swr";

import fetcher from "@/libs/fetcher";

// used to get the current user from the server
const useUsers = () => {
    const { 
        data, 
        error, 
        isLoading, 
        mutate 
    } = useSWR("/api/users", fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    }
}

export default useUsers;