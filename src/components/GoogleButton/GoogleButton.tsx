import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export default function GoogleButton({ onPress, loading }: GoogleButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={!!loading}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: "https://www.google.com/favicon.ico" }}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {loading ? "Conectando..." : "Continuar com Google"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56, // h-14
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // rounded-xl
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0", // slate-200
    // shadow-sm
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  icon: {
    width: 24, // w-6
    height: 24, // h-6
    marginRight: 12, // mr-3
    resizeMode: "contain",
  },
  text: {
    color: "#1f2937", // slate-800
    fontWeight: "600",
    fontSize: 16, // text-base
  },
});
