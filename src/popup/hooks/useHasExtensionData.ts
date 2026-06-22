import { useState, useEffect } from "react";
import { LOCAL_STORAGE_CARDS, LOCAL_STORAGE_ORIGINAL_CSV } from "@/constants";

export default function useHasExtensionData() {
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const checkStorage = () => {
            chrome.storage.local.get(
                [LOCAL_STORAGE_CARDS, LOCAL_STORAGE_ORIGINAL_CSV],
                (data) => {
                    setHasData(
                        Boolean(
                            data[LOCAL_STORAGE_CARDS] ||
                            data[LOCAL_STORAGE_ORIGINAL_CSV],
                        ),
                    );
                },
            );
        };

        checkStorage();

        const listener = (
            changes: Record<string, chrome.storage.StorageChange>,
        ) => {
            if (
                changes[LOCAL_STORAGE_CARDS] ||
                changes[LOCAL_STORAGE_ORIGINAL_CSV]
            ) {
                checkStorage();
            }
        };

        chrome.storage.onChanged.addListener(listener);

        return () => {
            chrome.storage.onChanged.removeListener(listener);
        };
    }, []);

    return hasData;
}
