sap.ui.define([], function () {
    "use strict";

    return {
        updateFontSize: function (oModel, oView, action) {
            const currentSize = oModel.getProperty("/fontSize");
            let newSize = currentSize;

            if (action === "increase" && currentSize < 40) {
                newSize += 2;
            } else if (action === "decrease" && currentSize > 10) {
                newSize -= 2;
            } else if (action === "reset") {
                newSize = 16;
            }

            oModel.setProperty("/fontSize", newSize);
            this.applyFontSizeToView(oView, newSize);
        },

        applyFontSizeToView: function (oView, fontSize) {
            oView.findAggregatedObjects(true, (oControl) => {
                const oDomRef = oControl.getDomRef();
                if (oDomRef) {
                    oDomRef.style.fontSize = fontSize + "px";
                    this.updateChildFontSize(oDomRef, fontSize);
                }
                return false;
            });
        },
        
        updateChildFontSize: function (domElement, fontSize) {
            const childNodes = domElement.querySelectorAll("*");
            childNodes.forEach((child) => {
                child.style.fontSize = fontSize + "px";
            });
        }
    };
});
