import ExportButton from "@/popup/components/ExportButton";
import ImportButton from "@/popup/components/ImportButton";
import DeleteButton from "@/popup/components/DeleteButton";
import ListCards from "@/popup/components/ListCards";
import {
    Heading,
    PopupContainer,
    SettingContainer,
} from "@/popup/components/StyledComponents";
import { Box } from "@mui/material";

export default function App() {
    return (
        <PopupContainer>
            <Heading />
            <Box sx={{ display: "flex", gap: 2 }}>
                <SettingContainer title="Card Data">
                    <ImportButton />
                    <ExportButton />
                    <DeleteButton />
                </SettingContainer>
                <SettingContainer title="List Cards">
                    <ListCards />
                </SettingContainer>
            </Box>
        </PopupContainer>
    );
}
