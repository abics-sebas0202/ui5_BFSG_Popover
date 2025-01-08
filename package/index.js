const JSONModel = require('sap/ui/model/json/JSONModel');
const Fragment = require('sap/ui/core/Fragment');
class BFSG_Popover {
    constructor(view, control) {
        this.view = view;
        this.control = control;

        this.genConfigModel();
        this.buildPopover();
        this.attachPress();
        this.fetchStyle();
    }

    genConfigModel () {
        this.configModel = new JSONModel({
            "fontConfig": {
                fontSize: 16,
                contrastMode: false
            },
            "contrastConfig": {
                backgroundColor: "white",
                textColor: "black",
                previewBackgroundColor: "white",
                previewTextColor: "black"    
            },
            "blueFilterConfig": {
                blueFilterActive: false,
                blueFilterIntensity: 32,
                blaufilterExpanded: true    
            },
            "readWebsiteConfig": {
                speed: 1.0,
                volume: 40,
                isPlaying: false,
                isPaused: false,
                currentText: "",
                mouseReadingActive: false,
                lastReadElement: null    
            }
        });

        this.view.setModel(this.configModel, "configModel");
    }

    updateFontSize (oModel, oView, action) {
        const currentSize = oModel.getProperty("/fontConfig/fontSize");
        let newSize = currentSize;

        if (action === "increase" && currentSize < 40) {
            newSize += 2;
        } else if (action === "decrease" && currentSize > 10) {
            newSize -= 2;
        } else if (action === "reset") {
            newSize = 16;
        }

        oModel.setProperty("/fontConfig/fontSize", newSize);
        this.applyFontSizeToView(oView, newSize);
    }

    applyFontSizeToView (oView, fontSize) {
        oView.findAggregatedObjects(true, (oControl) => {
            const oDomRef = oControl.getDomRef();
            if (oDomRef) {
                oDomRef.style.fontSize = fontSize + "px";
                this.updateChildFontSize(oDomRef, fontSize);
            }
            return false;
        });
    }
    
    updateChildFontSize (domElement, fontSize) {
        const childNodes = domElement.querySelectorAll("*");
        childNodes.forEach((child) => {
            child.style.fontSize = fontSize + "px";
        });
    }

    attachPress() {
        //TODO: check for press event availability
        this.control.attachPress(this.open, this);
    }

    async buildPopover() {
        const popover = await Fragment.load({
            name: "ui5_bfsg_popover.popover",
            controller: this
        });
        this.popover = popover;
        this.view.addDependent(this.popover);
    }

    fetchStyle () {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'resources/ui5_bfsg_popover/bfsg_style.css';
    
        let headScript = document.querySelector('script');
        headScript.parentNode.insertBefore(link, headScript);
    };


    open(event) {        
        this.popover.openBy(event.getSource());
    }

    changeFontSize(event) {
        const size = this.getValue()
        document.documentElement.style.fontSize = `${size}px`;
    }

    changeContrastMode(event) {
        const contrast = this.getValue();
        contrast ?? this.configModel.setProperty("/blueLight", 0);
        document.body.classList.toggle("high-contrast", contrast); 
    }

    // Font Size Begin

    onButtonFontSizeChangePress (action) {
        this.updateFontSize(this.configModel, this.view, action);
    }

    changeBlueLight(event) {
        let value = this.getValue();
        value = (100 - value) / 100;
        document.body.style.filter = `brightness(${value})`;
    }

  closePopover() {
    this.popover.close();
  }
}

module.exports = BFSG_Popover