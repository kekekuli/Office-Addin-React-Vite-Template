import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface BubbleArrowProps {
    position?: 'left' | 'right';
}

export default function BubbleArrow({ position="left" }: BubbleArrowProps) {
    const transform = position === 'right' ? 'scaleX(1)' : 'scaleX(-1)';

    return (
        <SvgIcon viewBox="0 0 20 20" sx={{
            width: "12px",
            height: "12px",
            transform: transform,
            position: "relative",
            top: "0",
            [position]: '1px',
            fill: "#e5e7eb",
            stroke: "#e5e7eb",
        }}>
            <path d="M0 0 L20 0 L0 20"/>
        </SvgIcon>
    );
}