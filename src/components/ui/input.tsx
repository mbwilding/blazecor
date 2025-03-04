import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    const changeValue = (delta: number) => {
        if (props.onChange) {
            const value = Number(props.value) || 0;
            const step = Number(props.step) || 1;
            const min = props.min !== undefined ? Number(props.min) : undefined;
            const max = props.max !== undefined ? Number(props.max) : undefined;
            let newValue = value + delta * step;
            if (min !== undefined && newValue < min) {
                newValue = min;
            }
            if (max !== undefined && newValue > max) {
                newValue = max;
            }
            props.onChange({ target: { value: newValue } } as any);
        }
    };

    return (
        <div className={cn("inline-flex w-full", className)}>
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    type === "number"
                        ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-r-none"
                        : ""
                )}
                {...props}
            />
            {type === "number" && (
                <div className="flex flex-col h-9">
                    <button
                        type="button"
                        className="flex justify-center items-center h-1/2 w-8 border-t border-r border-b border-l-0 rounded-tr-md border-input bg-background text-foreground hover:bg-muted"
                        onClick={() => changeValue(1)}
                    >
                        ▲
                    </button>
                    <button
                        type="button"
                        className="flex justify-center items-center h-1/2 w-8 border-r border-b border-l-0 rounded-br-md border-input bg-background text-foreground hover:bg-muted"
                        onClick={() => changeValue(-1)}
                    >
                        ▼
                    </button>
                </div>
            )}
        </div>
    );
}

export { Input };

