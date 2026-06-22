import {
    Box,
    BoxProps,
    Button as ButtonMUI,
    ButtonProps,
    GlobalStyles,
    styled,
    Typography,
    TypographyProps,
} from "@mui/material";

export const PopupContainer = (props: BoxProps) => (
    <>
        <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: (theme) => theme.breakpoints.values.md,
                p: 2,
                width: "100%",
            }}
            {...props}
        />
    </>
);

export const Heading = () => (
    <Box
        sx={{
            alignItems: "center",
            display: "flex",
            gap: 1,
        }}
    >
        <Typography fontSize="24px" lineHeight="24px">
            💅
        </Typography>
        <Typography component="h1" whiteSpace="nowrap" variant="h5">
            Enhanced Scryfall
        </Typography>
    </Box>
);

type SettingContainerProps = {
    children: React.ReactNode;
    title: string;
};

export const SettingContainer = ({
    children,
    title,
}: SettingContainerProps) => (
    <Box
        sx={{
            alignItems: "center",
            display: "flex",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            flexDirection: "column",
            gap: 2,
            p: 2,
            width: "fit-content",
        }}
    >
        <Typography>{title}</Typography>
        {children}
    </Box>
);

export const ButtonContainer = styled(Box)(({ theme }) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
    width: "100%",
}));

export const Button = (props: ButtonProps) => (
    <ButtonMUI fullWidth variant="outlined" {...props} />
);

export const Caption = (props: TypographyProps) => (
    <Typography textAlign="center" variant="caption" {...props} />
);
