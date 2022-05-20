import { Group, ActionIcon, NumberInput, NumberInputHandlers, InputWrapper } from '@mantine/core';
import { Dispatch, SetStateAction, useRef } from 'react';

type Props = {
  label?: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  min?: number;
  max?: number;
};

export const IncrementedNumberInput = ({ value, setValue, min, max, label }: Props) => {
  const handlers = useRef<NumberInputHandlers>();

  const handleOnChange = (newValue?: number) => {
    if (newValue) setValue(newValue);
  };

  return (
    <InputWrapper label={label}>
      <Group spacing={5}>
        <ActionIcon size={36} variant='default' onClick={() => handlers.current?.decrement()}>
          –
        </ActionIcon>

        <NumberInput
          variant='unstyled'
          hideControls
          value={value}
          onChange={handleOnChange}
          handlersRef={handlers}
          max={max}
          min={min}
          step={1}
          styles={{ input: { width: 36, textAlign: 'center' } }}
        />

        <ActionIcon size={36} variant='default' onClick={() => handlers.current?.increment()}>
          +
        </ActionIcon>
      </Group>
    </InputWrapper>
  );
};
