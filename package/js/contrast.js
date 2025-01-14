function onContrastModeButtonPress(oModel, oBody) {
    const isExpanded = oModel.getProperty("/contrast/isExpanded");
    const isContrastActive = oModel.getProperty("/contrast/isActive");
    oModel.setProperty("/contrast/isExpanded", !isExpanded);

    if (!isContrastActive) {
        const defaultContrastValue = 1.5; 
        oBody.style.filter = `contrast(${defaultContrastValue})`;
        oModel.setProperty("/contrast/isActive", true);
        oModel.setProperty("/contrast/contrastValue", defaultContrastValue);

        console.log(`Contrast mode activated with value ${defaultContrastValue}.`);
    } else {
        oBody.style.filter = ""; 
        oModel.setProperty("/contrast/isActive", false);
        oModel.setProperty("/contrast/contrastValue", 1); 

        console.log("Contrast mode deactivated.");
    }
}


function contrastPreviewBgColorPress(oEvent, view, configModel) {
    const oButton = oEvent.getSource();
    const aCustomData = oButton.getCustomData();

    if (!aCustomData || aCustomData.length === 0) {
        console.error("CustomData not found on button!");
        return;
    }

    const sBgColor = aCustomData[0].getValue();
    const oTextControl = view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef(); 
    } else {
        console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
        oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
    }

    if (oDomRef) {
        oDomRef.style.backgroundColor = sBgColor; 
        configModel.setProperty("/contrast/buttonsVisible", true);
    } else {
        console.error("DOM element not found!");
    }
}

function contrastPreviewTextColorPress(oEvent, view, configModel) {
    const oButton = oEvent.getSource();
    const aCustomData = oButton.getCustomData();

    if (!aCustomData || aCustomData.length === 0) {
        console.error("CustomData not found on button!");
        return;
    }

    const sTextColor = aCustomData[0].getValue(); 

    const oTextControl = view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef();
    } else {
        console.error("Text control not found in SAPUI5 context! Trying direct DOM ID access...");
        oDomRef = document.getElementById("container-testapp---MainView--uniquePopover--idCanYouReadThisText");
    }

    if (oDomRef) {
        oDomRef.style.color = sTextColor;
        configModel.setProperty("/contrast/buttonsVisible", true);
    } else {
        console.error("DOM element not found!");
    }
}
function onButtonContrastResetPress(view, configModel) {
    const sDefaultBgColor = "white";
    const sDefaultTextColor = "black";

    // Reset all DOM elements
    const aElements = document.querySelectorAll("*");
    aElements.forEach((element) => {
        element.style.backgroundColor = "";
        element.style.color = "";
    });

    // Reset the preview text
    const oTextControl = view.byId("idCanYouReadThisText");
    let oDomRef;
    if (oTextControl) {
        oDomRef = oTextControl.getDomRef();
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

    configModel.setProperty("/contrast/buttonsVisible", false);
    console.log("Colors have been reset to default values.");
}

function onSaveButtonPress(view, configModel) {
    const oTextControl = view.byId("idCanYouReadThisText");
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

        // Apply to all DOM elements
        const aElements = document.querySelectorAll("*");
        aElements.forEach((element) => {
            element.style.backgroundColor = sCurrentBgColor;
            element.style.color = sCurrentTextColor;
        });

        configModel.setProperty("/contrast/isExpanded", false);
    } else {
        console.error("DOM element not found for saving!");
    }
}


module.exports = {
    onContrastModeButtonPress,
    contrastPreviewBgColorPress,
    contrastPreviewTextColorPress,
    onButtonContrastResetPress,
    onSaveButtonPress,
};
