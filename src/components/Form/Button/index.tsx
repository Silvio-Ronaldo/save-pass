import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
  Container,
  ButtonText
} from './styles';

interface Props extends RectButtonProps {
  title: string;
  onPress: () => void;
}

export function Button({
  title,
  ...rest
}: Props) {
  return (
    <Container {...rest}>
      <ButtonText>
        {title}
      </ButtonText>
    </Container>
  );
}