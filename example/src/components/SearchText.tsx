import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import React from 'react';

import { Colors, Fonts, Strings } from '../assets';
import { hScale, vScale } from '../utils';

interface SearchTextProps extends Omit<TextInputProps, 'placeholder'> {
  onChangeText: (text: string) => void;
}

export const SearchText = (props: SearchTextProps) => {
  const { onChangeText, style, ...restProps } = props;

  return (
    <TextInput
      {...restProps}
      style={[styles.input, style]}
      placeholder={Strings.input.search_placeholder}
      placeholderTextColor={Colors.placeholder}
      onChangeText={onChangeText}
      underlineColorAndroid={Colors.transparent}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: vScale(50),
    color: Colors.text,
    fontFamily: Fonts.Semibold,
    fontSize: hScale(20),
    borderRadius: hScale(12),
    borderColor: Colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: hScale(12),
  },
});
