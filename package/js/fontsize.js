function updateFontSize(oModel, oView, action) {
    console.log("Font size action:", action);
    const currentSize = oModel.getProperty("/font/fontSize");
    let newSize = currentSize;

    if (action === "increase" && currentSize < 40) {
        newSize += 2;
    } else if (action === "decrease" && currentSize > 10) {
        newSize -= 2;
    } else if (action === "reset") {
        newSize = 16;
    }

    oModel.setProperty("/font/fontSize", newSize); 
    applyFontSizeToView(oView, newSize);
}

function applyFontSizeToView(oView, fontSize) {
    oView.findAggregatedObjects(true, (oControl) => {
        const oDomRef = oControl.getDomRef();
        if (oDomRef) {
            oDomRef.style.fontSize = fontSize + "px";
            updateChildFontSize(oDomRef, fontSize);
        }
        return false;
    });
}

function updateChildFontSize(domElement, fontSize) {
    const childNodes = domElement.querySelectorAll("*");
    childNodes.forEach((child) => {
        child.style.fontSize = fontSize + "px";
    });
}

module.exports = {
    updateFontSize,
    applyFontSizeToView,
    updateChildFontSize,
};