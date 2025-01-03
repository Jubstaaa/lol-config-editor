import React from "react";
import {
  Input as NextUIInput,
  Select,
  SelectItem,
  Slider,
  Switch,
} from "@nextui-org/react";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { FieldType, InputProps } from "../types";

function Input({
  name,
  placeholder,
  label,
  isRequired,
  type,
  scale = 1,
  options = [],
  step = 1,
  className,
  reverse = false,
}: InputProps) {
  const { values, setFieldValue } = useFormikContext<any>();

  if (type === FieldType.Slider) {
    return (
      <Slider
        value={get(values, name) * scale}
        name={name}
        onChange={(value: number) => setFieldValue(name, value / scale)}
        label={placeholder || label}
        step={step}
        className={className}
      />
    );
  } else if (type === FieldType.Boolean) {
    return (
      <Switch
        name={name}
        isSelected={
          reverse ? get(values, name) === "0" : get(values, name) === "1"
        }
        onValueChange={(value) =>
          setFieldValue(name, reverse ? (value ? "0" : "1") : value ? "1" : "0")
        }
        className={className}
      >
        {placeholder || label}
      </Switch>
    );
  } else if (type === FieldType.Select) {
    return (
      <>
        <Select
          selectionMode="single"
          label={placeholder || label}
          onChange={(e) => setFieldValue(name, e.target.value)}
          selectedKeys={[get(values, name)]}
        >
          {options.map((item) => (
            <SelectItem key={item.value}>{item.label}</SelectItem>
          ))}
        </Select>
      </>
    );
  }

  return (
    <NextUIInput
      value={get(values, name)}
      onChange={(value) => setFieldValue(name, value)}
      isRequired={isRequired}
      label={placeholder || label}
      name={name}
      type={type || "text"}
    />
  );
}

export default Input;
