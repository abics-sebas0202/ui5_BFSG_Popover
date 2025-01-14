const JSONModel = require("sap/ui/model/json/JSONModel");

function initModel(view) {
  const configModel = new JSONModel({
    font: {
      fontSize: 16,
      contrastMode: false,
    },
    contrast: {
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
      blueFilterActive: false,
      blueFilterIntensity: 32,
      blaufilterExpanded: true,
    },
    readWebsite: {
      speed: 1.0,
      volume: 40,
      isPlaying: false,
      isPaused: false,
      currentText: "",
      mouseReadingActive: false,
      lastReadElement: null,
    },
  });

  view.setModel(configModel, "configModel");
  return configModel;
}

module.exports = {
  initModel,
};
