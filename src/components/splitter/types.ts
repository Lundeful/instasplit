import { SelectItem } from "@mantine/core";

export interface AspectRatio extends SelectItem {
  aspect?: number;
}

export const AspectRatios: AspectRatio[] = [
  {
    label: 'Free',
    value: 'free',
  },
  {
    label: 'Original image',
    value: 'original',
  },
  {
    label: '4 x 5 (Instagram-friendly)',
    value: '4x5',
    aspect: 4 / 5,
  },
  {
    label: '16 x 9 (Widescreen)',
    value: '16x9',
    aspect: 16 / 9,
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];
