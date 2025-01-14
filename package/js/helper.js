const JSONModel = require("sap/ui/model/json/JSONModel");

function genConfigModel(view) {
  const configModel = new JSONModel({
    fontConfig: {
      fontSize: 16,
      contrastMode: false,
    },
    contrastConfig: {
      backgroundColor: "white",
      textColor: "black",
      previewBackgroundColor: "white",
      previewTextColor: "black",
    },
    blueFilterConfig: {
      blueFilterActive: false,
      blueFilterIntensity: 32,
      blaufilterExpanded: true,
    },
    readWebsiteConfig: {
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

function fetchStyle() {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "resources/ui5_bfsg_popover/css/bfsg_style.css";
  document.head.appendChild(link);
  console.log("Custom CSS loaded.");
}

module.exports = {
  genConfigModel,
  fetchStyle,
};
