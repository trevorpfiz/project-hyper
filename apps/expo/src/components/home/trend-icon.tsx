import type { LucideProps } from "lucide-react-native";
import type { z } from "zod";

import type { TrendEnum } from "@hyper/validators/dexcom";

import { ChevronsDown } from "~/lib/icons/chevrons-down";
import { ChevronsUp } from "~/lib/icons/chevrons-up";
import { HelpCircle } from "~/lib/icons/help-circle";
import { MoveDown } from "~/lib/icons/move-down";
import { MoveDownRight } from "~/lib/icons/move-down-right";
import { MoveRight } from "~/lib/icons/move-right";
import { MoveUp } from "~/lib/icons/move-up";
import { MoveUpRight } from "~/lib/icons/move-up-right";

type TrendIconProps = LucideProps & {
  trend: z.infer<typeof TrendEnum>;
};

export const TrendIcon: React.FC<TrendIconProps> = ({ trend, ...props }) => {
  const iconProps = {
    ...props,
    size: props.size ?? 24,
    strokeWidth: props.strokeWidth ?? 1.25,
  };

  switch (trend) {
    case "doubleUp":
      return <ChevronsUp {...iconProps} />;
    case "singleUp":
      return <MoveUp {...iconProps} />;
    case "fortyFiveUp":
      return <MoveUpRight {...iconProps} />;
    case "flat":
      return <MoveRight {...iconProps} />;
    case "fortyFiveDown":
      return <MoveDownRight {...iconProps} />;
    case "singleDown":
      return <MoveDown {...iconProps} />;
    case "doubleDown":
      return <ChevronsDown {...iconProps} />;
    case "none":
      return null;
    case "notComputable":
      return <HelpCircle {...iconProps} />;
    case "rateOutOfRange":
      return <HelpCircle {...iconProps} />;
    case "unknown":
      return <HelpCircle {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
    // data is now narrowed to never. This will error if a case is missing.
    // const _exhaustiveCheck: never = data;
  }
};
