import React, { useState } from "react";
import {
  Checkbox,
  cn,
  Input as NextUIInput,
  Select,
  SelectItem,
  Slider,
  Switch,
} from "@nextui-org/react";
import { useFormikContext } from "formik";
import { FieldType, InputProps } from "../types";
import KeybindingInput from "./KeybindingInput";
import { JSONPath } from "jsonpath-plus";
import { get } from "lodash";

function convertJSONPathToDotNotation(jsonPath: string) {
  return jsonPath
    .replace(/\$\['/g, "") // Başlangıçtaki $[' ifadesini kaldır
    .replace(/\['/g, ".") // Köşeli parantez ve tek tırnakları kaldır
    .replace(/'\]/g, "") // Kapalı köşeli parantezi kaldır
    .replace(/\]\['/g, "][") // Aradaki köşeli parantezleri noktaya çevir
    .replace(/\['/g, "[") // Açık köşeli parantezi noktaya çevir
    .replace(/\]/g, "]") // Kapalı köşeli parantezi kaldır
    .replace(/\.([^\d\[\]]+)\]/g, ".$1") // Sayı olmayanları nokta ile ayır
    .replace(/\]\./g, "]."); // Sayı olanları olduğu gibi bırak
}

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
  classNames,
  reverse = false,
  ...props
}: InputProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const [dotNotation] = useState<any>(
    name
      ? convertJSONPathToDotNotation(
          JSONPath({
            path: name,
            json: values,
            resultType: "path",
          })[0]
        )
      : ""
  );

  if (type === FieldType.Slider) {
    return (
      <Slider
        classNames={{
          filler: "bg-transparent",
          track: "border-s-none rounded-none h-5 border-x-[10px]",
          thumb: "after:bg-primary after:shadow-none w-5 h-5",
          label: "text-sm",
          value: "text-sm",
        }}
        radius="none"
        size="lg"
        value={get(values, dotNotation) * scale}
        name={name}
        label={placeholder || label}
        step={step}
        onChange={(value: number) => setFieldValue(dotNotation, value / scale)}
        className={className}
      />
    );
  } else if (type === FieldType.Boolean) {
    return (
      <Checkbox
        radius="none"
        icon={<></>}
        name={name}
        isSelected={
          reverse
            ? get(values, dotNotation) === "0"
            : get(values, dotNotation) === "1"
        }
        onValueChange={(value) =>
          setFieldValue(
            dotNotation,
            reverse ? (value ? "0" : "1") : value ? "1" : "0"
          )
        }
        className={className}
        classNames={{
          ...classNames,
          label: "text-sm",
          wrapper: cn(
            "group-data-[selected=true]:after:scale-80 before:border-primary/50",
            classNames?.wrapper
          ),
        }}
      >
        {placeholder || label}
      </Checkbox>
    );
  } else if (type === FieldType.Select) {
    return (
      <>
        <Select
          classNames={{
            popoverContent: "rounded-none p-0",
            listbox: "p-0",
            value: "text-center",
          }}
          size="sm"
          radius="none"
          labelPlacement="outside"
          disallowEmptySelection
          disableAnimation
          selectionMode="single"
          label={placeholder || label}
          onChange={(e) => setFieldValue(dotNotation, e.target.value)}
          selectedKeys={[get(values, dotNotation)]}
        >
          {options.map((item) => (
            <SelectItem
              className="rounded-none"
              classNames={{ title: "text-center" }}
              key={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </>
    );
  } else if (type === FieldType.KeybindingInput) {
    return (
      <KeybindingInput
        value={get(values, dotNotation)}
        onChange={(value: string) => setFieldValue(dotNotation, value)}
        label={placeholder || label}
        className={className}
      />
    );
  }
  return (
    <NextUIInput
      radius="none"
      labelPlacement="outside"
      startContent={<></>}
      value={get(values, dotNotation)}
      onValueChange={(value) => setFieldValue(dotNotation, value)}
      isRequired={isRequired}
      label={placeholder || label}
      name={name}
      type={type || "text"}
      {...props}
    />
  );
}

export default Input;
