import useSWR from "swr";

import fetcher from "@/libs/fetcher";

// used to get the current user from the server
const useCurrentUser = () => {
    const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    }
}

export default useCurrentUser;