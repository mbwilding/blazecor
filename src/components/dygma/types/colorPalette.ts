import { PaletteType } from "./layout";

export interface ColorPaletteProps {
  colors: PaletteType[];
  selected: number;
  onColorSelect?: (idx: number) => void;
  className?: string;
}
