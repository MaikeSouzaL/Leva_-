import React from "react";
import Toast from "react-native-toast-message";
import {
  Container,
  Icon,
  TextContainer,
  Title,
  Subtitle,
  CloseButton,
  CloseIcon,
} from "./styles";

interface Props {
  text1?: string;
  text2?: string;
  type?: "success" | "error" | "info";
}

export default function CustomToast({ text1, text2, type = "info" }: Props) {
  return (
    <Container $type={type}>
      <Icon $type={type} />
      <TextContainer>
        <Title>{text1 ?? "Mensagem"}</Title>
        {text2 ? <Subtitle>{text2}</Subtitle> : null}
      </TextContainer>
      <CloseButton onPress={() => Toast.hide()}>
        <CloseIcon />
      </CloseButton>
    </Container>
  );
}
