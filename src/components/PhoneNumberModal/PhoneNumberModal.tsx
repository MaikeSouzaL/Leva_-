import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PhoneNumberModal({
  visible,
  onConfirm,
  onCancel,
  error,
}: any) {
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = React.useState("");
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  function handleConfirm() {
    if (phone.length < 8) {
      return;
    }
    onConfirm(phone);
  }

  return (
    <Modal
      animationType="none"
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        {/* ADICIONADO: KeyboardAvoidingView */}
        <KeyboardAvoidingView
          style={styles.kbAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={insets.top + 16}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
                paddingBottom: insets.bottom + 8, 
              },
            ]}
          >
            <Text style={styles.title}>Insira seu telefone</Text>

            <Text style={styles.subtitle}>
              Antes de criar sua conta, precisamos do seu número de telefone
              para verificação.
            </Text>
            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.inputRow}>
              <Text style={styles.ddd}>+55</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="DDD + número"
                placeholderTextColor="#AAA"
                value={phone}
                onChangeText={setPhone}
                maxLength={11}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                phone.length >= 10
                  ? styles.confirmButtonEnabled
                  : styles.confirmButtonDisabled,
              ]}
              disabled={phone.length < 10}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    minHeight: 270,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    color: "#475569",
    marginBottom: 24,
    fontSize: 15,
  },
  error: {
    color: "#ef4444",
    marginBottom: 12,
    fontSize: 13,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
    backgroundColor: "#f8fafc",
  },
  ddd: {
    color: "#64748b",
    fontSize: 16,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#1e293b",
    paddingVertical: 0,
  },
  confirmButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  confirmButtonEnabled: {
    backgroundColor: "#2563eb",
  },
  confirmButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 15,
  },
  kbAvoid: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
