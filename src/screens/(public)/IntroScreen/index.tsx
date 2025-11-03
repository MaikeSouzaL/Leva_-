import React, { useState } from "react";
import {
  Animated,
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import slides from "./dataSlide";
import { useNavigation } from "@react-navigation/native";

export default function IntroScreen() {
  const [slideAtual, setSlideAtual] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const navigation = useNavigation();

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      callback();
      fadeIn();
    });
  };

  const handleNext = () => {
    if (slideAtual === slides.length - 1) {
      navigation.navigate("SignIn", { animation: "fade_from_bottom" });
    } else {
      fadeOut(() => setSlideAtual(slideAtual + 1));
    }
  };

  const handlePrev = () => {
    if (slideAtual > 0) {
      fadeOut(() => setSlideAtual(slideAtual - 1));
    }
  };

  return (
    <ImageBackground
      source={slides[slideAtual].image}
      resizeMode="cover"
      style={styles.root}
    >
      <View style={styles.overlay}>
        <Animated.View style={[{ opacity: fadeAnim }, styles.content]}>
          <Text style={styles.title}>{slides[slideAtual].title}</Text>
          <Text style={styles.description}>
            {slides[slideAtual].description}
          </Text>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={
                  index === slideAtual ? styles.dotActive : styles.dotInactive
                }
              />
            ))}
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[
                styles.button,
                slideAtual === 0
                  ? styles.buttonBackDisabled
                  : styles.buttonBack,
              ]}
              onPress={handlePrev}
              disabled={slideAtual === 0}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonNext]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>
                {slideAtual === slides.length - 1 ? "Começar" : "Próximo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  description: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  footer: {
    paddingBottom: 40,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    minWidth: 120,
    alignItems: "center",
  },
  buttonBack: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  buttonBackDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonNext: {
    backgroundColor: "#3B82F6",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
