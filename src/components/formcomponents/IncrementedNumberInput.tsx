import { Dispatch, SetStateAction } from 'react';
import { Input } from '../ui/input';

type Props = {
  label?: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  min?: number;
  max?: number;
};

export const IncrementedNumberInput = ({ value, setValue, min, max, label }: Props) => {
  const handleIncrement = () => {
    if (max !== undefined && value >= max) return;
    setValue(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (min !== undefined && value <= min) return;
    setValue(prev => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) return;

    if (min !== undefined && newValue < min) {
      setValue(min);
    } else if (max !== undefined && newValue > max) {
      setValue(max);
    } else {
      setValue(newValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-lg hover:bg-accent hover:text-accent-foreground"
          onClick={handleDecrement}
          disabled={min !== undefined && value <= min}
        >
          –
        </button>

        <Input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={1}
          className="w-12 text-center px-0"
        />

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-lg hover:bg-accent hover:text-accent-foreground"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};
