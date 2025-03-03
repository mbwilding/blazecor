import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayerSelectorProps {
    defaultLayer: number;
    layers: number;
    onChange?: (layer: number) => void;
}

export function LayerSelector({ defaultLayer, layers, onChange }: LayerSelectorProps) {
    const [selectedLayer, setSelectedLayer] = useState(defaultLayer);

    const handleLayerChange = (layer: number) => {
        setSelectedLayer(layer);
        onChange?.(layer);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: layers }, (_, i) => i + 1).map(layer => (
                <Button
                    key={layer}
                    variant={selectedLayer === layer ? "default" : "outline"}
                    className={cn(
                        "h-9 w-9 p-0 font-medium",
                        selectedLayer === layer
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                    )}
                    onClick={() => handleLayerChange(layer)}
                    aria-pressed={selectedLayer === layer}
                >
                    {layer}
                </Button>
            ))}
        </div>
    );
}
