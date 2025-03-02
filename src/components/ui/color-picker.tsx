import type * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Color } from "@/types/ffi/settings"

interface ColorPickerProps {
    defaultColor: Color,
    onChange?: (color: Color) => void
}

interface HSL {
    h: number
    s: number
    l: number
}

export function ColorPicker({ defaultColor, onChange }: ColorPickerProps) {
    const [hsl, setHsl] = useState<HSL>({ h: 0, s: 0, l: 0 })
    const [rgb, setRgb] = useState<Color>(defaultColor)
    const [hex, setHex] = useState(rgbToHex(defaultColor.r, defaultColor.g, defaultColor.b))
    const [copied, setCopied] = useState(false)
    const colorPlaneRef = useRef<HTMLDivElement>(null)
    const isDraggingRef = useRef(false)

    // Initialize color values from default color
    useEffect(() => {
        const hsl = rgbToHsl(defaultColor.r, defaultColor.g, defaultColor.b)
        setRgb(defaultColor)
        setHsl(hsl)
    }, [defaultColor])

    // Convert HSL to RGB and HEX when HSL changes
    useEffect(() => {
        const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l)
        const newRgb = { r, g, b }
        setRgb(newRgb)
        setHex(rgbToHex(r, g, b))
        onChange?.(newRgb)
    }, [hsl, onChange])

    // Handle color plane mouse events
    const handleColorPlaneMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!colorPlaneRef.current) return
        isDraggingRef.current = true
        updateColorFromPlane(e)

        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingRef.current) {
                updateColorFromPlane(e)
            }
        }

        const handleMouseUp = () => {
            isDraggingRef.current = false
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    // Update color based on position in the color plane
    const updateColorFromPlane = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!colorPlaneRef.current) return

        const rect = colorPlaneRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

        setHsl((prev) => ({
            ...prev,
            s: x * 100,
            l: 100 - y * 100,
        }))
    }, [])

    // Handle hue slider change
    const handleHueChange = (value: number[]) => {
        setHsl((prev) => ({ ...prev, h: value[0] }))
    }

    // Handle RGB input changes
    const handleRgbChange = (channel: keyof Color, value: string) => {
        const numValue = Math.max(0, Math.min(255, Number.parseInt(value) || 0))
        const newRgb = { ...rgb, [channel]: numValue }
        setRgb(newRgb)

        const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
        setHsl(newHsl)
    }

    // Handle HSL input changes
    const handleHslChange = (channel: keyof HSL, value: string) => {
        const maxValues = { h: 360, s: 100, l: 100 }
        const numValue = Math.max(0, Math.min(maxValues[channel], Number.parseInt(value) || 0))
        setHsl((prev) => ({ ...prev, [channel]: numValue }))
    }

    // Handle hex input change
    const handleHexChange = (value: string) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            setHex(value)
            const newRgb = hexToRgb(value)
            setRgb(newRgb)
            const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
            setHsl(newHsl)
        } else if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
            setHex(value)
        }
    }

    // Copy color value to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    // Calculate cursor position in color plane
    const cursorPosition = {
        left: `${hsl.s}%`,
        top: `${100 - hsl.l}%`,
    }

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="relative">
                {/* Color plane */}
                <div
                    ref={colorPlaneRef}
                    className="relative w-full h-48 rounded-md cursor-crosshair"
                    style={{
                        background: `linear-gradient(to right, #fff, hsl(${hsl.h}, 100%, 50%))`,
                        backgroundImage: `
              linear-gradient(to top, #000, transparent),
              linear-gradient(to right, #fff, hsl(${hsl.h}, 100%, 50%))
            `,
                    }}
                    onMouseDown={handleColorPlaneMouseDown}
                >
                    {/* Color selection cursor */}
                    <div
                        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-md pointer-events-none"
                        style={{
                            left: cursorPosition.left,
                            top: cursorPosition.top,
                            backgroundColor: hex,
                        }}
                    />
                </div>

                {/* Hue slider */}
                <div className="mt-4 mb-6">
                    <Slider
                        value={[hsl.h]}
                        max={360}
                        step={1}
                        onValueChange={handleHueChange}
                        className="[&_.bg-primary]:bg-transparent [&_.bg-secondary]:bg-transparent"
                        style={{
                            background: `linear-gradient(to right,
                hsl(0, 100%, 50%), hsl(60, 100%, 50%),
                hsl(120, 100%, 50%), hsl(180, 100%, 50%),
                hsl(240, 100%, 50%), hsl(300, 100%, 50%),
                hsl(360, 100%, 50%))`,
                        }}
                    />
                </div>
            </div>

            {/* Color format tabs */}
            <Tabs defaultValue="hex" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="hex">HEX</TabsTrigger>
                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                </TabsList>

                {/* HEX input */}
                <TabsContent value="hex" className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Input value={hex} onChange={(e) => handleHexChange(e.target.value)} className="font-mono" />
                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(hex)} className="shrink-0">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </TabsContent>

                {/* RGB inputs */}
                <TabsContent value="rgb" className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="r-value" className="text-xs">
                                R
                            </Label>
                            <Input
                                id="r-value"
                                type="number"
                                min={0}
                                max={255}
                                value={rgb.r}
                                onChange={(e) => handleRgbChange("r", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="g-value" className="text-xs">
                                G
                            </Label>
                            <Input
                                id="g-value"
                                type="number"
                                min={0}
                                max={255}
                                value={rgb.g}
                                onChange={(e) => handleRgbChange("g", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="b-value" className="text-xs">
                                B
                            </Label>
                            <Input
                                id="b-value"
                                type="number"
                                min={0}
                                max={255}
                                value={rgb.b}
                                onChange={(e) => handleRgbChange("b", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="font-mono" />
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                            className="shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </TabsContent>

                {/* HSL inputs */}
                <TabsContent value="hsl" className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="h-value" className="text-xs">
                                H
                            </Label>
                            <Input
                                id="h-value"
                                type="number"
                                min={0}
                                max={360}
                                value={hsl.h}
                                onChange={(e) => handleHslChange("h", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="s-value" className="text-xs">
                                S
                            </Label>
                            <Input
                                id="s-value"
                                type="number"
                                min={0}
                                max={100}
                                value={Math.round(hsl.s)}
                                onChange={(e) => handleHslChange("s", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="l-value" className="text-xs">
                                L
                            </Label>
                            <Input
                                id="l-value"
                                type="number"
                                min={0}
                                max={100}
                                value={Math.round(hsl.l)}
                                onChange={(e) => handleHslChange("l", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            value={`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`}
                            readOnly
                            className="font-mono"
                        />
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`)}
                            className="shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Color preview */}
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-md border border-border shadow-sm" style={{ backgroundColor: hex }} />
                <div className="text-sm font-medium">Current Color</div>
            </div>
        </div>
    )
}

// Update color conversion utilities to work with Color type
function hexToRgb(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
        }
        : { r: 0, g: 0, b: 0 }
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

function rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }

        h /= 6
    }

    return { h: Math.round(h * 360), s: s * 100, l: l * 100 }
}

function hslToRgb(h: number, s: number, l: number): Color {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q

        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    }
}
