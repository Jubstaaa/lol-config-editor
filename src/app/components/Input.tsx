import React, { useState } from "react";
import {
  Checkbox,
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
}: InputProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const [dotNotation] = useState<any>(
    convertJSONPathToDotNotation(
      JSONPath({
        path: name,
        json: values,
        resultType: "path",
      })[0]
    )
  );

  if (type === FieldType.Slider) {
    return (
      <Slider
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
        classNames={classNames}
      >
        {placeholder || label}
      </Checkbox>
    );
  } else if (type === FieldType.Select) {
    return (
      <>
        <Select
          disallowEmptySelection
          disableAnimation
          selectionMode="single"
          label={placeholder || label}
          onChange={(e) => setFieldValue(dotNotation, e.target.value)}
          selectedKeys={[get(values, dotNotation)]}
        >
          {options.map((item) => (
            <SelectItem key={item.value}>{item.label}</SelectItem>
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
      value={get(values, dotNotation)}
      onChange={(value) => setFieldValue(dotNotation, value)}
      isRequired={isRequired}
      label={placeholder || label}
      name={name}
      type={type || "text"}
    />
  );
}

export default Input;
