import { NavigationContainer } from "@react-navigation/native";
// import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "styled-components/native";
import CustomToast from "./src/components/CustomToast/CustomToast";
import theme from "@theme/index";
import Routes from "@routes/index";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { StatusBar } from "react-native";

export default function App() {
  const { COLORS } = theme;
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    // return <Loading />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.GRAY_800 }}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <StatusBar
              translucent={false}
              backgroundColor={COLORS.GRAY_800}
              barStyle="dark-content"
              animated={true}
            />
            <Routes />
            <Toast
              config={{
                success: (props) => <CustomToast {...props} type="success" />,
                error: (props) => <CustomToast {...props} type="error" />,
                info: (props) => <CustomToast {...props} type="info" />,
              }}
            />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
