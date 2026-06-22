import { useEffect, useState } from "react";
import { Box, List, ListItem } from "@mui/material";
import { getListCards } from "@/content/storage";
import Snackbar, { SnackbarProps } from "@/components/Snackbar";
import { Button } from "./StyledComponents";
import { Cards } from "@/types";
import { LOCAL_STORAGE_CARDS } from "@/constants";

export default function ListCards() {
    const [cards, setCards] = useState<Cards>({});

    const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
        message: "List copied to clipboard.",
        open: false,
        severity: "success",
    });

    const loadCards = async () => {
        const data = await getListCards();
        setCards(data);
    };

    useEffect(() => {
        loadCards();

        const handleChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string,
        ) => {
            if (areaName === "local" && changes[LOCAL_STORAGE_CARDS]) {
                loadCards();
            }
        };

        chrome.storage.onChanged.addListener(handleChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleChange);
        };
    }, []);

    const handleCopy = () => {
        const text = Object.entries(cards)
            .map(([name]) => name)
            .join("\n");
        navigator.clipboard.writeText(text);

        setSnackbarProps((prev) => ({ ...prev, open: true }));
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Button onClick={handleCopy}>Copy list</Button>
                <List dense disablePadding>
                    {Object.entries(cards).map(([name]) => (
                        <ListItem disableGutters key={name}>
                            {name}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Snackbar
                {...snackbarProps}
                onClose={() =>
                    setSnackbarProps((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}
