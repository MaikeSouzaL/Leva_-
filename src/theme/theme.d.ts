import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    COLORS: {
      WHITE: string;
      BRAND_LIGHT: string;
      BRAND_MID: string;
      BRAND_DARK: string;
      BRAND_YELLOW: string;
      GREEN_LIGHT: string;
      GREEN_MID: string;
      GREEN_DARK: string;
      BLUE_STATUS: string;
      GRAY_100: string;
      GRAY_200: string;
      GRAY_300: string;
      GRAY_400: string;
      GRAY_500: string;
      GRAY_550: string;
      GRAY_600: string;
      GRAY_700: string;
      GRAY_800: string;
      BACKGROUND: string;
    };
    FONT_FAMILY: {
      REGULAR: string;
      BOLD: string;
    };
    FONT_SIZE: {
      XS: number;
      SM: number;
      MD: number;
      LG: number;
      XL: number;
      XXL: number;
      XXXL: number;
      EXTRA_LARGE: number;
    };
  }
}
