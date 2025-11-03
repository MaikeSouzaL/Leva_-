import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import type { DefaultTheme } from "styled-components/native";

type ToastType = "success" | "error" | "info";

export const Container = styled.View<{ $type: ToastType }>`
  flex-direction: row;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.GRAY_800};
  border-left-width: 5px;
  border-left-color: ${({ theme, $type }: { theme: DefaultTheme; $type: ToastType }) =>
    ({
      success: theme.COLORS.GREEN_LIGHT,
      error: theme.COLORS.BRAND_MID,
      info: theme.COLORS.BLUE_STATUS,
    }[$type])};
  border-radius: 8px;
  padding: 12px;
  margin-left: 12px;
  margin-right: 12px;
  align-items: center;
`;

export const Icon = styled(Ionicons).attrs<{ $type: ToastType }>(
  ({ theme, $type }: { theme: DefaultTheme; $type: ToastType }) => ({
    name: {
      success: "checkmark-circle-outline",
      error: "close-circle-outline",
      info: "information-circle-outline",
    }[$type],
    size: 24,
    color: {
      success: theme.COLORS.GREEN_LIGHT,
      error: theme.COLORS.BRAND_MID,
      info: theme.COLORS.BLUE_STATUS,
    }[$type],
  })
)`
  margin-right: 10px;
`;

export const TextContainer = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.WHITE};
  font-weight: 600;
  font-size: 16px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.COLORS.GRAY_300};
  font-size: 13px;
  margin-top: 2px;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-left: 8px;
  padding: 4px;
`;

export const CloseIcon = styled(Ionicons).attrs(
  ({ theme }: { theme: DefaultTheme }) => ({
    name: "close",
    size: 20,
    color: theme.COLORS.GRAY_300,
  })
)``;
