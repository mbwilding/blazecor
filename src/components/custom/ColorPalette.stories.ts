import type { Meta, StoryObj } from "@storybook/react";

import { ColorPalette } from "./ColorPalette";

const meta = {
    title: "Custom/ColorPalette",
    component: ColorPalette,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {},
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        colors: [
            { r: 255, g: 0, b: 0 }, // Red
            { r: 0, g: 255, b: 0 }, // Green
            { r: 0, g: 0, b: 255 }, // Blue
            { r: 255, g: 255, b: 0 }, // Yellow
            { r: 0, g: 255, b: 255 }, // Cyan
            { r: 255, g: 0, b: 255 }, // Magenta
        ],
    },
};
