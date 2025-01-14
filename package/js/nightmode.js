function onNightModeButtonPress(oCore) {
    const currentTheme = oCore.getConfiguration().getTheme();
    const themeMapping = {
        "sap_horizon": "sap_horizon_dark",
        "sap_horizon_dark": "sap_horizon",
        "sap_fiori_3": "sap_fiori_3_dark",
        "sap_fiori_3_dark": "sap_fiori_3",
        "sap_fiori_3_hcb": "sap_fiori_3_hcw",
        "sap_fiori_3_hcw": "sap_fiori_3_hcb"
    };
    const newTheme = themeMapping[currentTheme] || "sap_horizon_dark";
    oCore.applyTheme(newTheme);
    console.log(`Theme switched from ${currentTheme} to ${newTheme}`);
}

module.exports = {
    onNightModeButtonPress,
};