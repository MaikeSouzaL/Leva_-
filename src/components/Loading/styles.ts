import styled from "styled-components/native";
import type { DefaultTheme } from "styled-components/native";
import LottieView from "lottie-react-native";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.COLORS.GRAY_800};
`;

export const LoadingIndicator = styled(LottieView).attrs({
  source: require("@assets/animations/loading.json"),
  autoPlay: true,
  loop: true,
})`
  width: 100px;
  height: 100px;
`;
