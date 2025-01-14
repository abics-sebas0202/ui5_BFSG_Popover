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
  startReading,
  stopReading,
  increaseSpeed,
  decreaseSpeed,
  getVisibleTextFromPage,
} = require("./js/readWebsite");

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

  onButtonFontSizeChangePress(action) {
    updateFontSize(this.configModel, this.view, action);
  }

  // Font Size Feature Handlers End

  // Read Website Feature Handlers Begin

  onIconStartReadPress() {
    const getVisibleText = getVisibleTextFromPage; 
    startReading(this.configModel, this.speechSynth, getVisibleText);
  }

  onIconStopReadPress() {
    stopReading(this.configModel, this.speechSynth);
  }

  onButtonIncreaseSpeedPress() {
    increaseSpeed(this.configModel, null, this.speechSynth);
  }

  onButtonDecreaseSpeedPress() {
    decreaseSpeed(this.configModel, null, this.speechSynth);
  }

  // Read Website Feature Handlers End

  // Contrast Mode Begin

  contrastPreviewBgColorPress(oEvent) {
    const oButton = oEvent.getSource();
    const aCustomData = oButton.getCustomData();

    if (!aCustomData || aCustomData.length === 0) {
        console.error("CustomData not found on button!");
        return;
    }

    const sBgColor = aCustomData[0].getValue(); // CustomData'dan renk alın

    // Text kontrolünü bul
    const oTextControl = this.view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef(); // DOM referansı al
    } else {
        console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
        oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
    }

    if (oDomRef) {
        oDomRef.style.backgroundColor = sBgColor; // Arka plan rengini değiştir
        this.configModel.setProperty("/contrast/buttonsVisible", true); // Butonları görünür yap
    } else {
        console.error("DOM element not found!");
    }
}




  contrastPreviewTextColorPress(oEvent) {
    const oButton = oEvent.getSource();
    const aCustomData = oButton.getCustomData();

    if (!aCustomData || aCustomData.length === 0) {
        console.error("CustomData not found on button!");
        return;
    }

    const sTextColor = aCustomData[0].getValue(); // CustomData'dan renk alın

    // Text kontrolünü bul
    const oTextControl = this.view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef(); // DOM referansı al
    } else {
        console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
        oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
    }

    if (oDomRef) {
        oDomRef.style.color = sTextColor; // Metin rengini değiştir
        this.configModel.setProperty("/contrast/buttonsVisible", true); // Butonları görünür yap
    } else {
        console.error("DOM element not found!");
    }
}




  onButtonContrastResetPress() {
    const sDefaultBgColor = "white";
    const sDefaultTextColor = "black";

    // Text kontrolünü bul
    const oTextControl = this.view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef(); // DOM referansı al
    } else {
        console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
        oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
    }

    if (oDomRef) {
        oDomRef.style.backgroundColor = sDefaultBgColor;
        oDomRef.style.color = sDefaultTextColor;
    } else {
        console.error("DOM element not found!");
    }

    // Butonları gizle
    this.configModel.setProperty("/contrast/buttonsVisible", false);
    console.log("Colors have been reset to default values.");
}



  onSaveButtonPress() {
    const oTextControl = this.view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef();
    } else {
        console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
        oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
    }

    if (oDomRef) {
        const sCurrentBgColor = oDomRef.style.backgroundColor || "white";
        const sCurrentTextColor = oDomRef.style.color || "black";

        console.log(`Saved settings: Background Color = ${sCurrentBgColor}, Text Color = ${sCurrentTextColor}`);
    } else {
        console.error("DOM element not found for saving!");
    }

    // Butonları gizle
    this.configModel.setProperty("/contrast/buttonsVisible", false);
}



  onCancelButtonPress() {
    const oModel = this.view.getModel("configModel");
    if (oModel) {
        const sBgColor = oModel.getProperty("/contrast/backgroundColor");
        const sTextColor = oModel.getProperty("/contrast/textColor");

        const oTextControl = this.view.byId("idCanYouReadThisText");
        let oDomRef;
        if (oTextControl) {
            oDomRef = oTextControl.getDomRef();
        } else {
            console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
            oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
        }

        if (oDomRef) {
            oDomRef.style.backgroundColor = sBgColor;
            oDomRef.style.color = sTextColor;
        } else {
            console.error("DOM element not found!");
        }

        // Butonları gizle
        oModel.setProperty("/contrast/buttonsVisible", false);
        console.log("Changes have been canceled.");
    }
}







  // Contrast Mode End
}

module.exports = npm_popover;
