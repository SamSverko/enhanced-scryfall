import {
    Snackbar as SnackbarMUI,
    SnackbarProps as SnackbarPropsMUI,
    Alert,
    AlertProps,
} from "@mui/material";

export type SnackbarProps = {
    severity: AlertProps["severity"];
    onClose?: () => void;
} & Pick<SnackbarPropsMUI, "message" | "open">;

export default function Snackbar({
    message,
    onClose,
    open,
    severity,
}: SnackbarProps) {
    return (
        <SnackbarMUI
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={5000}
            onClose={(_, reason) => {
                if (reason === "clickaway") return;
                onClose?.();
            }}
            open={open}
        >
            <Alert severity={severity}>{message}</Alert>
        </SnackbarMUI>
    );
}
