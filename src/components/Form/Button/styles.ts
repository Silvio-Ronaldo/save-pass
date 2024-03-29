import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  background-color: #FFCC00;

  height: ${RFValue(56)}px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;
export const ButtonText = styled.Text`
  font-family: 'Rubik_500Medium';
  font-size: ${RFValue(15)}px;
  color: #3D434D;
`;