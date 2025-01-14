function toggleContrastMode(oModel, contrastModel, oView) {
    const bContrastMode = oModel.getProperty("/contrastMode");
    const bNewContrastMode = !bContrastMode;
    oModel.setProperty("/contrastMode", bNewContrastMode);

    if (bNewContrastMode) {
        const backgroundColor = contrastModel.getProperty("/contrast/backgroundColor");
        const textColor = contrastModel.getProperty("/contrast/textColor");
        applyColorsToPage(oView, backgroundColor, textColor);
        sap.m.MessageToast.show("Contrast mode activated.");
    } else {
        resetContrast(oModel, oView);
        sap.m.MessageToast.show("Contrast mode deactivated. Changes reset to default.");
    }
}

function updateBackgroundColor(oView, color, textColor) {
    updatePreview(oView, color, textColor);
}

function updateTextColor(oView, color) {
    updatePreview(oView, getCurrentBackgroundColor(oView), color);
}

function saveContrastSettings(oView) {
    const oText = oView.byId("idCanYouReadThisText");
    const backgroundColor = oText.getDomRef().style.backgroundColor || "white";
    const textColor = oText.getDomRef().style.color || "black";

    applyColorsToPage(oView, backgroundColor, textColor);
    sap.m.MessageToast.show("Colors applied successfully!");
}

function resetContrast(oModel, oView) {
    const defaultBackgroundColor = "white";
    const defaultTextColor = "black";

    oView.findAggregatedObjects(true, (oControl) => {
        const oDomRef = oControl.getDomRef();
        if (oDomRef) {
            oDomRef.style.backgroundColor = "";
            oDomRef.style.color = "";

            const childNodes = oDomRef.querySelectorAll("*");
            childNodes.forEach((child) => {
                child.style.backgroundColor = "";
                child.style.color = "";
            });
        }
        return false;
    });

    oModel.setProperty("/contrast/backgroundColor", defaultBackgroundColor);
    oModel.setProperty("/contrast/textColor", defaultTextColor);
}

function applyColorsToPage(oView, backgroundColor, textColor) {
    const allElements = document.body.querySelectorAll("*");
    allElements.forEach((element) => {
      element.style.backgroundColor = backgroundColor;
      element.style.color = textColor;
    });
  }
  

function updatePreview(oView, backgroundColor, textColor) {
    const oText = oView.byId("idCanYouReadThisText");
    if (oText) {
        oText.getDomRef().style.backgroundColor = backgroundColor;
        oText.getDomRef().style.color = textColor;
    }
}

function getCurrentBackgroundColor(oView) {
    const oText = oView.byId("idCanYouReadThisText");
    return oText && oText.getDomRef() ? oText.getDomRef().style.backgroundColor || "white" : "white";
}

module.exports = {
    toggleContrastMode,
    updateBackgroundColor,
    updateTextColor,
    saveContrastSettings,
    resetContrast,
    applyColorsToPage,
};
