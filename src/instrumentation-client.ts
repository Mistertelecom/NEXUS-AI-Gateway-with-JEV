const enableNexusReactDevTools =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS !== "1";

if (enableNexusReactDevTools) {
  void import("react-grab").then(({ init }) => init());
  void import("react-scan").then(({ scan }) =>
    scan({
      enabled: true,
      log: false,
      showToolbar: true,
    })
  );
}
