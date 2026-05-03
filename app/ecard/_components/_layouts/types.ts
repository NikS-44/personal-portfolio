import type { CardTemplate, ColorTheme, CardState } from "../../_data/types";

export interface LayoutProps {
  template: CardTemplate;
  theme: ColorTheme;
  state: Partial<CardState>;
  /** Proper category-level greeting, e.g. "Happy Mother's Day!" */
  greeting: string;
}
