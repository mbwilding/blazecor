import type { Meta, StoryObj } from "@storybook/react";

import ColorPicker from "./color-picker";
import { Button } from "../ui/button";

const meta = {
    title: "Custom/ColorPicker",
    component: ColorPicker,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {
        index: 0,
        onChange: undefined,
        children: <Button>Open</Button>,
    },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Red: Story = {
    args: {
        color: { r: 255, g: 0, b: 0, w: 100 },
    },
};
