import * as React from "react";
import { View, TextInput, TextStyle, ViewStyle } from "react-native";
import { color, spacing, typography } from "../../../theme";
import { translate } from "../../../i18n";
import { Text } from "../text";
import { TextFieldProps } from "./text-field.props";

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
};

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.textinput,
  minHeight: 44,
  fontSize: 18,
  backgroundColor: color.palette.white,
};

// currently we have no presets, but that changes quickly when you build your app.
export const PRESETS: { [name: string]: ViewStyle } = {
  default: {}, loginScreen: {width:"80%"}
};

/**
 * A component which has a label and an input together.
 */
export class TextField extends React.Component<TextFieldProps, {}> {
  render() {
    const {
      placeholderTx,
      placeholderTextColor,
      placeholder,
      labelTx,
      label,
      preset = "default",
      style: styleOverride,
      inputStyle: inputStyleOverride,
      ...rest
    } = this.props;
    const containerStyle: ViewStyle = { ...CONTAINER, ...PRESETS[preset], ...styleOverride };
    const inputStyle: TextStyle = { ...INPUT, ...inputStyleOverride };
    const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder;

    return (
      <View style={containerStyle}>
        <Text preset="fieldLabel" tx={labelTx} text={label} />
        <TextInput
          placeholder={actualPlaceholder}
          placeholderTextColor={placeholderTextColor}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyle}
        />
      </View>
    );
  }
}
