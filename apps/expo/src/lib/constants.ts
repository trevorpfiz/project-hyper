import colors from "tailwindcss/colors";

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  let hex = hexCode.replace("#", "");

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return `rgba(${r},${g},${b},${opacity})`;
};

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
    disabled: "rgba(0, 0, 0, .3)",
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
    disabled: "rgba(255, 255, 255, .3)",
  },
};

export const CALENDAR_THEME = {
  light: {
    background: colors.white,
    text: colors.gray[900],
    primary: colors.gray[900],
    disabled: "rgba(0, 0, 0, .3)",
    active: "rgba(0, 0, 0, .1)",
    highlight: "rgba(0, 0, 0, .1)",
    good: {
      background: convertHexToRGBA(colors.green[500], 0.2),
      text: colors.green[500],
    },
    ok: {
      background: convertHexToRGBA(colors.yellow[500], 0.2),
      text: colors.yellow[500],
    },
    bad: {
      background: convertHexToRGBA(colors.red[500], 0.2),
      text: colors.red[500],
    },
  },
  dark: {
    background: colors.gray[900],
    primary: colors.white,
    text: colors.gray[100],
    disabled: "rgba(255, 255, 255, .3)",
    active: "rgba(255, 255, 255, .1)",
    highlight: "rgba(255, 255, 255, .1)",
    good: {
      background: convertHexToRGBA(colors.green[400], 0.2),
      text: colors.green[400],
    },
    ok: {
      background: convertHexToRGBA(colors.yellow[400], 0.2),
      text: colors.yellow[400],
    },
    bad: {
      background: convertHexToRGBA(colors.red[500], 0.2),
      text: colors.red[500],
    },
  },
};

export const INTRO_CONTENT = [
  {
    title: "scribeHC",
    bg: colors.lime[100],
    fontColor: colors.pink[500],
  },
  {
    title: "scribeHC",
    bg: colors.stone[900],
    fontColor: colors.sky[200],
  },
  {
    title: "scribeHC",
    bg: colors.orange[500],
    fontColor: colors.blue[700],
  },
  {
    title: "scribeHC",
    bg: colors.teal[700],
    fontColor: colors.yellow[400],
  },
  {
    title: "scribeHC",
    bg: colors.green[800],
    fontColor: colors.pink[500],
  },
];
