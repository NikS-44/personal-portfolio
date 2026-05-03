import type { CardTemplate, ColorTheme, CardState } from "../_data/types";
import { CATEGORIES } from "../_data/categories";
import { CenteredStackLayout } from "./_layouts/CenteredStackLayout";
import { FramedLayout } from "./_layouts/FramedLayout";
import { BannerTopLayout } from "./_layouts/BannerTopLayout";
import { PolaroidLayout } from "./_layouts/PolaroidLayout";
import { RibbonLayout } from "./_layouts/RibbonLayout";
import { StarburstLayout } from "./_layouts/StarburstLayout";
import { MinimalSerifLayout } from "./_layouts/MinimalSerifLayout";
import { EnvelopeLayout } from "./_layouts/EnvelopeLayout";
import { ScatteredLayout } from "./_layouts/ScatteredLayout";
import { GarlandLayout } from "./_layouts/GarlandLayout";

interface TemplateRendererProps {
  template: CardTemplate;
  theme: ColorTheme;
  state: Partial<CardState>;
}

export function TemplateRenderer({ template, theme, state }: TemplateRendererProps) {
  const category = CATEGORIES.find((c) => c.id === template.categoryId);
  const greeting = category?.greeting ?? template.name;
  const props = { template, theme, state, greeting };
  switch (template.layout) {
    case "centered-stack":
      return <CenteredStackLayout {...props} />;
    case "framed":
      return <FramedLayout {...props} />;
    case "banner-top":
      return <BannerTopLayout {...props} />;
    case "polaroid":
      return <PolaroidLayout {...props} />;
    case "ribbon":
      return <RibbonLayout {...props} />;
    case "starburst":
      return <StarburstLayout {...props} />;
    case "minimal-serif":
      return <MinimalSerifLayout {...props} />;
    case "envelope":
      return <EnvelopeLayout {...props} />;
    case "scattered":
      return <ScatteredLayout {...props} />;
    case "garland":
      return <GarlandLayout {...props} />;
    default:
      return <CenteredStackLayout {...props} />;
  }
}
