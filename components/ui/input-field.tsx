import React from "react";
import { Text, TextInput, TextInputProps, TextProps, View } from "react-native";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "decimal-pad";
  editable?: boolean;
  labelProps?: TextProps;
  inputProps?: TextInputProps;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  labelProps,
  inputProps,
}: Readonly<InputFieldProps>) {
  return (
    <View className="w-full gap-[10px]">
      <Text
        className="font-inter-semibold mb-2 text-[16px] leading-[18px] text-gray-700"
        {...labelProps}
      >
        {label}
      </Text>

      <TextInput
        className="font-mulish-medium mb-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900"
        placeholder={placeholder || label}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        {...inputProps}
      />
    </View>
  );
}
