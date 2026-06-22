import { FileDownload } from "@mui/icons-material";

import { LOCAL_STORAGE_ORIGINAL_CSV } from "@/constants";
import { getTimestamp } from "@/utils";
import useHasExtensionData from "@/popup/hooks/useHasExtensionData";
import {
    Button,
    ButtonContainer,
    Caption,
} from "@/popup/components/StyledComponents";

export default function ExportButton() {
    const hasData = useHasExtensionData();

    const handleExport = async () => {
        const data = await chrome.storage.local.get([
            LOCAL_STORAGE_ORIGINAL_CSV,
        ]);
        const csvText = data[LOCAL_STORAGE_ORIGINAL_CSV] as string | undefined;

        if (!csvText) return;

        const blob = new Blob([csvText], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `ManaBox_Collection_ES_${getTimestamp()}.csv`;
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <ButtonContainer>
            <Button
                disabled={!hasData}
                onClick={handleExport}
                startIcon={<FileDownload />}
            >
                Export
            </Button>
            <Caption color={hasData ? "textPrimary" : "textSecondary"}>
                {hasData
                    ? "Export your original imported CSV."
                    : "No extension data to export."}
            </Caption>
        </ButtonContainer>
    );
}
