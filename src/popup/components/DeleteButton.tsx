import { Delete } from "@mui/icons-material";
import { useState } from "react";

import Snackbar, { SnackbarProps } from "@/components/Snackbar";
import { LOCAL_STORAGE_CARDS, LOCAL_STORAGE_ORIGINAL_CSV } from "@/constants";
import useHasExtensionData from "@/popup/hooks/useHasExtensionData";
import {
    Button,
    ButtonContainer,
    Caption,
} from "@/popup/components/StyledComponents";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

export default function DeleteButton() {
    const hasData = useHasExtensionData();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
        message: "All extension data has been deleted.",
        open: false,
        severity: "success",
    });

    const handleDelete = async () => {
        await chrome.storage.local.remove([
            LOCAL_STORAGE_CARDS,
            LOCAL_STORAGE_ORIGINAL_CSV,
        ]);

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { type: "REFRESH_OWNED" });
        }

        setIsDialogOpen(false);

        setSnackbarProps((prev) => ({
            ...prev,
            open: true,
        }));
    };

    return (
        <>
            <ButtonContainer>
                <Button
                    color="error"
                    disabled={!hasData}
                    onClick={() => setIsDialogOpen(true)}
                    startIcon={<Delete />}
                >
                    Delete
                </Button>
                <Caption color={hasData ? "error" : "textSecondary"}>
                    {hasData
                        ? "This will delete all extension data."
                        : "No extension data to delete."}
                </Caption>
            </ButtonContainer>
            <Dialog onClose={() => setIsDialogOpen(false)} open={isDialogOpen}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete all extension data? This
                        cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        onClick={handleDelete}
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                {...snackbarProps}
                onClose={() =>
                    setSnackbarProps((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}
