import { FileUpload } from "@mui/icons-material";
import { Box, Link } from "@mui/material";
import { useState } from "react";

import { LOCAL_STORAGE_CARDS, LOCAL_STORAGE_ORIGINAL_CSV } from "@/constants";
import Snackbar, { SnackbarProps } from "@/components/Snackbar";
import { parseCSV } from "@/popup/utils";
import {
    Button,
    ButtonContainer,
    Caption,
} from "@/popup/components/StyledComponents";

export default function ImportButton() {
    const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
        message: "",
        open: false,
        severity: "success",
    });

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = parseCSV(text);

            if (!Object.keys(parsed).length) {
                throw new Error("Empty or invalid CSV");
            }

            await chrome.storage.local.set({
                [LOCAL_STORAGE_CARDS]: parsed,
                [LOCAL_STORAGE_ORIGINAL_CSV]: text,
            });

            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (tab?.id) {
                chrome.tabs.sendMessage(tab.id, { type: "REFRESH_OWNED" });
            }

            setSnackbarProps({
                message: `Imported ${Object.keys(parsed).length.toLocaleString()} cards`,
                open: true,
                severity: "success",
            });
        } catch (error) {
            console.error("Import error:", error);
            setSnackbarProps({
                message: "Import failed",
                severity: "error",
                open: true,
            });
        }
    };

    return (
        <>
            <ButtonContainer>
                <Button component="label" startIcon={<FileUpload />}>
                    Import
                    <Box
                        accept=".csv"
                        component="input"
                        type="file"
                        onChange={handleImport}
                        sx={{ display: "none" }}
                    />
                </Button>
                <Caption>
                    Upload a CSV file exported from ManaBox.
                    <br />
                    <Link
                        href="https://www.manabox.app/guides/collection/import-export/#csv-file"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Learn how to export it here
                    </Link>
                    .
                </Caption>
            </ButtonContainer>
            <Snackbar
                {...snackbarProps}
                onClose={() =>
                    setSnackbarProps((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}
