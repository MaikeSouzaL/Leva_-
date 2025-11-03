import { View, Text } from "react-native";
import React from "react";
import { Container, LoadingIndicator } from "./styles";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export default function Loading() {
  return (
    <Container>
      <LoadingIndicator />
    </Container>
  );
}

