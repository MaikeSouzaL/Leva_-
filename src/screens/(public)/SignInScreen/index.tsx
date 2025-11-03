import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
("@react-navigation/native-stack");
import api from "../../../services/apiConfig";
import { useAuthStore } from "../../../context/authStore";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GoogleButton from "@components/GoogleButton/GoogleButton";
import PhoneNumberModal from "@components/PhoneNumberModal/PhoneNumberModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAddressLocationReverse } from "../../../ultils/getAddressLocationReverse/getAddressLocation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RouteParams = {
  Email?: string;
};

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;
  const { Email } = (params as RouteParams) ?? {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(true);
  const [phoneError, setPhoneError] = useState<string>("");
  const passwordInputRef = React.useRef<TextInput>(null);

  function handleNavigateToSignUp() {
    // animações: "default" | "fade" | "slide_from_right" | "slide_from_left" | "slide_from_bottom" | "none"
    //   navigation.navigate("SignUp", {
    //     phone,
    //     city,
    //     animation: "slide_from_right",
    //   });
    // }
  }

  async function handleGoogleSignIn() {
    // if (!phone) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Número de telefone necessário",
    //     text2: "Informe seu telefone antes de continuar",
    //   });
    //   setShowPhoneModal(true);
    //   return;
    // }

    // setGoogleLoading(true);
    try {
      // 1. Autenticar com o Google
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!isSuccessResponse(userInfo)) {
        Toast.show({
          type: "error",
          text1: "Falha ao autenticar com Google",
        });
        return;
      }

      // 2. Extrair informações do usuário Google
      const { user, idToken, scopes, serverAuthCode } = userInfo.data;
      const { givenName, email, familyName, id, name, photo } = user;

      // 3. Enviar para API de login Google
      const response = await api.post("/login", {
        email: email.trim().toLowerCase(),
        password: `${email}-${id}`,
      });
      // console.log("Login com Google:", response.status);

      if (response.status === 200) {
        const { user } = response.data;
        const {
          token,
          _id,
          name,
          email,
          phone,
          userType,
          profilePhoto,
          googleId,
          acceptedTerms,
          expoToken,
        } = user;
        // console.log("Dados do usuário:", JSON.stringify(user, null, 2));

        await AsyncStorage.setItem("@auth_token", token);

        // useAuthStore.getState().login(
        //   userType,
        //   {
        //     id: _id,
        //     cidade: city,
        //     nome: name,
        //     email: email,
        //     telefone: phone,
        //     fotoPerfil: profilePhoto,
        //     googleId: googleId,
        //     aceitouTermos: acceptedTerms,
        //     expoPushToken: expoToken,
        //   },
        //   token
        // );
        Toast.show({
          type: "success",
          text1: "Login com Google realizado com sucesso!",
        });
      }
    } catch (error: any) {
      console.log("Erro no login com Google:", error);
      Toast.show({
        type: "error",
        text1:
          error.response?.data?.error ||
          "Erro ao fazer login com Google. Verifique sua conexão.",
      });
    }
  }

  async function handleManualLogin() {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Email obrigatório",
        text2: "Preencha seu email para continuar",
      });
      return;
    }
    if (!password || password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Senha inválida",
        text2: "A senha deve ter pelo menos 6 caracteres",
      });
      return;
    }
    setLoading(true);
    try {
      // 1. Fazer a requisição para a API
      const response = await api.post("/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.status === 200) {
        const { user } = response.data;
        const {
          token,
          _id,
          name,
          email,
          phone,
          userType,
          profilePhoto,
          googleId,
          acceptedTerms,
          expoToken,
        } = user;
        // console.log("Dados do usuário:", JSON.stringify(user, null, 2));

        await AsyncStorage.setItem("@auth_token", token);

        // useAuthStore.getState().login(
        //   userType,
        //   {
        //     id: _id,
        //     cidade: city,
        //     nome: name,
        //     email: email,
        //     telefone: phone,
        //     fotoPerfil: profilePhoto,
        //     googleId: googleId,
        //     aceitouTermos: acceptedTerms,
        //     expoPushToken: expoToken,
        //   },
        //   token
        // );
        Toast.show({
          type: "success",
          text1: "Login com Google realizado com sucesso!",
        });
      }
    } catch (error: any) {
      console.log("Erro no login:", error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.error || "Erro ao fazer login",
      });
    }
  }

  function handlePhoneConfirm(numero: string) {
    setPhone(numero);
    setShowPhoneModal(false);
    setPhoneError("");

    // Solicitar localização após confirmar o número de telefone
    getUserCity();
  }

  async function getUserCity() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permissão de localização negada");
        return;
      }

      Toast.show({
        type: "info",
        text1: "Detectando sua localização",
        text2: "Estamos identificando sua cidade",
      });

      const location = await Location.getCurrentPositionAsync({});
      const cidade = await getAddressLocationReverse(location.coords);

      console.log("Localização obtida:", cidade?.district);

      if (cidade) {
        setCity(cidade?.district);

        console.log(`Cidade detectada: ${cidade}`);

        Toast.show({
          type: "success",
          text1: "Localização detectada",
          text2: `Você está em ${cidade}`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Cidade não detectada",
          text2: "Não foi possível identificar sua cidade",
        });
      }
    } catch (error) {
      console.error("Erro ao obter cidade:", error);
      Toast.show({
        type: "error",
        text1: "Erro de localização",
        text2: "Não foi possível detectar sua cidade",
      });
    }
  }

  function handlePhoneCancel() {
    setPhoneError("O número de telefone é obrigatório para criar uma conta");
  }

  useEffect(() => {
    if (Email) {
      setEmail(Email);
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      Toast.show({
        type: "info",
        text1: "Email preenchido",
        text2: "Digite sua nova senha para entrar",
      });
    }
  }, [route.params]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : -80}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bem-vindo</Text>
          <Text style={styles.headerSubtitle}>Faça login para continuar</Text>
        </View>

        {phone ? (
          <View style={styles.phoneRow}>
            <MaterialCommunityIcons
              name="cellphone"
              size={24}
              color="#2563eb"
            />
            <Text style={styles.phoneText}>
              +55 {phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}
            </Text>
            <TouchableOpacity
              style={styles.changePhoneButton}
              onPress={() => setShowPhoneModal(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.changePhoneText}>Alterar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seu e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroupLarge}>
          <Text style={styles.label}>Sua senha</Text>
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          // onPress={() => navigation.navigate("EsqueciSenhaScreen")}
        >
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleManualLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        <GoogleButton onPress={handleGoogleSignIn} loading={googleLoading} />

        <TouchableOpacity
          style={styles.bottomLinkContainer}
          onPress={handleNavigateToSignUp}
        >
          <Text style={styles.bottomText}>
            Não tem uma conta?{" "}
            <Text style={styles.bottomTextHighlight}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
        {/* {showPhoneModal && (
          <PhoneNumberModal
            visible={showPhoneModal}
            onConfirm={handlePhoneConfirm}
            onCancel={handlePhoneCancel}
            error={phoneError}
          />
        )} */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24, // px-6
    paddingVertical: 32, // py-8
  },
  header: {
    marginBottom: 40, // mb-10
  },
  headerTitle: {
    fontSize: 30, // text-3xl
    fontWeight: "700",
    color: "#1f2937", // slate-800
  },
  headerSubtitle: {
    marginTop: 8, // mt-2
    fontSize: 16, // text-base
    color: "#6b7280", // slate-500
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff", // blue-50
    borderWidth: 1,
    borderColor: "#bfdbfe", // blue-200
    borderRadius: 16, // rounded-2xl
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
    marginBottom: 32, // mb-8
  },
  phoneText: {
    marginLeft: 12, // ml-3
    fontSize: 16,
    color: "#1d4ed8", // blue-700
    fontWeight: "600",
  },
  changePhoneButton: {
    marginLeft: "auto", // ml-auto
  },
  changePhoneText: {
    color: "#2563eb", // blue-600
    fontWeight: "700",
    fontSize: 14, // text-sm
  },

  inputGroup: {
    marginBottom: 16, // mb-4
  },
  inputGroupLarge: {
    marginBottom: 24, // mb-6
  },
  label: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    color: "#374151", // gray-700
    marginBottom: 4, // mb-1
  },
  input: {
    height: 56, // h-14
    backgroundColor: "#f3f4f6", // gray-100
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 16, // px-4
    color: "#111827", // gray-900
  },

  forgotPasswordButton: {
    marginBottom: 28, // mb-7
    alignItems: "flex-end", // items-end
  },
  forgotPasswordText: {
    color: "#2563eb", // blue-600
    fontWeight: "600",
    textAlign: "right",
  },

  primaryButton: {
    height: 56, // h-14
    backgroundColor: "#2563eb", // blue-600
    borderRadius: 16, // rounded-2xl
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8, // mt-2
    marginBottom: 16, // mb-4
    // shadow-lg shadow-blue-600/20
    shadowColor: "#2563eb",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18, // text-lg
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20, // my-5
  },
  dividerLine: {
    flex: 1,
    height: 1, // h-[1px]
    backgroundColor: "#e5e7eb", // slate-200
  },
  dividerText: {
    marginHorizontal: 12, // mx-3
    color: "#6b7280", // slate-500
    fontWeight: "500",
  },

  bottomLinkContainer: {
    marginTop: 32, // mt-8
    alignItems: "center",
  },
  bottomText: {
    fontSize: 16, // text-base
    color: "#475569", // slate-600
  },
  bottomTextHighlight: {
    color: "#2563eb", // blue-600
    fontWeight: "700",
  },
});
