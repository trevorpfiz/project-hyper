import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { GlucoseRangeTypes } from "@hyper/db/schema";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useGlucoseStore } from "~/stores/glucose-store";

interface RangeOption {
  value: GlucoseRangeTypes;
  label: string;
}

function ChangeRangeSetting() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  };

  const { rangeView, setRangeView } = useGlucoseStore();

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const rangeOptions: RangeOption[] = [
    { value: "standard", label: capitalizeFirstLetter("standard") },
    { value: "tight", label: capitalizeFirstLetter("tight") },
    { value: "optimal", label: capitalizeFirstLetter("optimal") },
  ];

  const currentOption =
    rangeOptions.find((option) => option.value === rangeView) ??
    rangeOptions[0];

  return (
    <>
      <Label nativeID="range-view">Range View</Label>
      <Select
        defaultValue={currentOption}
        onValueChange={(option) =>
          setRangeView(option?.value as "standard" | "tight" | "optimal")
        }
      >
        <SelectTrigger className="w-[250px]" aria-labelledby="range-view">
          <SelectValue
            className="native:text-lg text-sm text-foreground"
            placeholder="Select a range view"
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-[250px]">
          <SelectGroup>
            {/* <SelectLabel>Range View</SelectLabel> */}
            <SelectItem label="Standard" value="standard" />
            <SelectItem label="Tight" value="tight" />
            <SelectItem label="Optimal" value="optimal" />
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export { ChangeRangeSetting };
