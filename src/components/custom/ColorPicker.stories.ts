import type { Meta, StoryObj } from "@storybook/react";

import { ColorPicker } from "./ColorPicker";

const meta = {
    title: "Custom/ColorPalette",
    component: ColorPicker,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
    args: { onChange: undefined },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Red: Story = {
    args: {
        defaultColor: { r: 255, g: 0, b: 0 }
    },
};
