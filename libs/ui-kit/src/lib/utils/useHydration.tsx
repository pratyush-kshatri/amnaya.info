import { useEffect, useState } from "react";

function useHydration() {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => { setHydrated(true); }, []);

    return hydrated;
}

export { useHydration };