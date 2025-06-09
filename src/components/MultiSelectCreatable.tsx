"use client";

import { useState } from "react";
import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";

export function MultiSelectCreatable({
  options: initialOptions,
  value: initialValue,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialOptions);
  const [value, setValue] = useState<string[]>(initialValue);

  const exactOptionMatch = data.some((item: string) => item === search);

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      const newValues = search.split(",").map(v => v.trim()).filter(Boolean);
      const uniqueNewValues = newValues.filter(v => !data.includes(v));
      
      if (uniqueNewValues.length > 0) {
        setData((current: string[]) => [...current, ...uniqueNewValues]);
        setValue((current: string[]) => [...current, ...uniqueNewValues]);
        onChange([...value, ...uniqueNewValues]);
      }
    } else {
      const newValue = value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val];
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleValueRemove = (val: string) => {
    const newValue = value.filter((v) => v !== val);
    setValue(newValue);
    onChange(newValue);
  };

  const values = value.map((item: string) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const filteredOptions = data
    .filter((item: string) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item: string) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search values"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {filteredOptions}

          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}

          {exactOptionMatch &&
            search.trim().length > 0 &&
            filteredOptions.length === 0 && (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}

          {search.trim().length == 0 && filteredOptions.length === 0 && !exactOptionMatch && (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
