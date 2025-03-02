import type { Meta, StoryObj } from "@storybook/react";

import { LayerSelector } from "./layer-selector";

const meta = {
    title: "Custom/LayerSelector",
    component: LayerSelector,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {
        onChange: undefined,
    },
} satisfies Meta<typeof LayerSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        defaultLayer: 0,
        layers: 5,
    },
};
