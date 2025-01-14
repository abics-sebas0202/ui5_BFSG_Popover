const JSONModel = require("sap/ui/model/json/JSONModel");
const { fetchStyle } = require("./js/helper");
const {
  onTabNavigationButtonPress,
  onMoreFeaturesButtonPress,
} = require("./js/popover");
const { buildPopover, open, onClose } = require("./js/builder");
const { updateFontSize } = require("./js/fontsize");
const { initModel } = require("./js/config");
const keyboardShortcutsData = require("./model/keyboardShortcuts.json");
const {
  startOrPauseReading,
  stopReading,
  onSwitchPointerReadChange,
  increaseSpeed,
  decreaseSpeed,
  increaseVolume,
  decreaseVolume,
  getVisibleTextFromPage,
} = require("./js/readWebsite");
const {
  onContrastModeButtonPress,
  contrastPreviewBgColorPress,
  contrastPreviewTextColorPress,
  onButtonContrastResetPress,
  onSaveButtonPress,
} = require("./js/contrast");
const { onButtonBlueFilterPress, onBlueFilterIntensitySliderLiveChange } = require("./js/bluefilter");
const { onNightModeButtonPress } = require("./js/nightmode");
const { onHideImagesButtonPress } = require("./js/hideimages");

class npm_popover {
  constructor(view, control) {
    this.view = view;
    this.control = control;
    this.popover = null;
    this.speechSynth = window.speechSynthesis;
    fetchStyle();

    initModel(this.view);
    this.configModel = this.view.getModel("configModel");
    const keyboardShortcutsModel = new JSONModel(keyboardShortcutsData);
    this.view.setModel(keyboardShortcutsModel, "keyboardShortcutsModel");
  }

  // Popover build, open, close functions begin

  async buildPopover() {
    await buildPopover(this);
  }

  open(oButton, oData) {
    open(oButton, oData, this);
  }

  onClose() {
    onClose(this);
  }

  // Popover build, open, close functions end

  // Sub Popover Open Handler Begin

  onTabNavigationButtonPress(oEvent) {
    onTabNavigationButtonPress(oEvent, { view: this.view });
  }
  onMoreFeaturesButtonPress(oEvent) {
    onMoreFeaturesButtonPress(oEvent, { view: this.view });
  }

  // Sub Popover Open Handler End

  // Font Size Feature Handlers Begin

  onFontSizePress() {
    const isExpanded = this.configModel.getProperty("/font/isExpanded");
    this.configModel.setProperty("/font/isExpanded", !isExpanded);
  }

  onButtonFontSizeChangePress(action) {
    updateFontSize(this.configModel, this.view, action);
  }

  // Font Size Feature Handlers End

  // Read Website Feature Handlers Begin

  onReadWebsitePress() {
    const isExpanded = this.configModel.getProperty("/readWebsite/isExpanded");
    this.configModel.setProperty("/readWebsite/isExpanded", !isExpanded);

  }

  onIconStartReadPress() {
    const getVisibleText = getVisibleTextFromPage;
    startOrPauseReading(this.configModel, this.speechSynth, getVisibleText);
  }

  onIconStopReadPress() {
    stopReading(this.configModel, this.speechSynth);
  }

  onSwitchPointerReadChange(oEvent) {
    onSwitchPointerReadChange(oEvent, this.configModel, this.speechSynth);
  }
  

  onButtonIncreaseSpeedPress() {
    increaseSpeed(this.configModel, null, this.speechSynth);
  }

  onButtonDecreaseSpeedPress() {
    decreaseSpeed(this.configModel, null, this.speechSynth);
  }

  onButtonIncreaseVolumePress() {
    increaseVolume(this.configModel);
  }

  onButtonDecreaseVolumePress() {
    decreaseVolume(this.configModel);
  }

  // Read Website Feature Handlers End

  // Contrast Mode Begin

  onContrastModeButtonPress() {
    onContrastModeButtonPress(this.configModel, document.body);
  }

  contrastPreviewBgColorPress(oEvent) {
    contrastPreviewBgColorPress(oEvent, this.view, this.configModel);
  }

  contrastPreviewTextColorPress(oEvent) {
    contrastPreviewTextColorPress(oEvent, this.view, this.configModel);
  }

  onButtonContrastResetPress() {
    onButtonContrastResetPress(this.view, this.configModel);
  }

  onSaveButtonPress() {
    onSaveButtonPress(this.view, this.configModel);
  }

  // Contrast Mode End

  // Hide Images Begin

  onHideImagesButtonPress() {
    this.imagesHidden = onHideImagesButtonPress(this.view, this.imagesHidden);
  }


  // Hide Images End

  // Night Mode Begin

  onNightModeButtonPress() {
    onNightModeButtonPress(sap.ui.getCore());
  }
  // Night Mode End

  // Blue Filter Begin

  onButtonBlueFilterPress() {
    onButtonBlueFilterPress(this.configModel, document.body);
  }

  onBlueFilterIntensitySliderLiveChange(oEvent) {
    const intensity = oEvent.getParameter("value");
    onBlueFilterIntensitySliderLiveChange(this.configModel, intensity, document.body);
  }



  // Blue Filter End
}

module.exports = npm_popover;
