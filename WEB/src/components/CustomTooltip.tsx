import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import styled from "styled-components";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow placement={props.placement} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#202938'
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#202938",
        color: "#fff",
        maxWidth: 220,
        textAlign: 'center',
        padding: '5.5px 8.25px',
        fontFamily: 'Inter',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '18px',
        borderRadius: '6px',
        border: 'none'
    }
}));


export default CustomTooltip