const JSONModel = require("sap/ui/model/json/JSONModel");

function initModel(view) {
  const configModel = new JSONModel({
    font: {
      fontSize: 16,
      contrastMode: false,
      isExpanded: false,

    },
    contrast: {
      buttonsVisible: false,
      contrastValue:1,
      isActive: false,
      isExpanded: false,
      backgroundColor: "white",
      textColor: "black",
      previewBackgroundColor: "white",
      previewTextColor: "black",
      originalState: {
        backgroundColor: "white",
        textColor: "black"
      }
    },
    blueFilter: {
      isActive: false,
      blueFilterIntensity: 32,
      blaufilterExpanded: false,
    },
    readWebsite: {
      isExpanded: false,
      speed: 1.0,
      volume: 40,
      isPlaying: false,
      isPaused: false,
      currentText: "",
      isPointerReadEnabled: false,
      lastReadElement: null,
    },
  });

  view.setModel(configModel, "configModel");
  return configModel;
}

module.exports = {
  initModel,
};
