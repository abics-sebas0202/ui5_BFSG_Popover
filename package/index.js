const JSONModel = require('sap/ui/model/json/JSONModel');
const Fragment = require('sap/ui/core/Fragment');
const MessageToast = require('sap/m/MessageToast');

class BFSG_Popover {
    constructor(view, control) {
        this.view = view;
        this.control = control;

        this.genConfigModel();
        this.buildPopover();
        this.attachPress();
        this.fetchStyle();


        this._mouseHoverHandler = this._onMouseHoverRead.bind(this);
        this._oSpeechSynth = window.speechSynthesis;
        this._oUtterance = null;

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

    changeFontSize(event) {
        const size = this.getValue()
        document.documentElement.style.fontSize = `${size}px`;
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

    onButtonFontSizeChangePress (action) {
        this.updateFontSize(this.configModel, this.view, action);
    }

    attachPress() {
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

  

    // Font Size Begin

  


    closePopover() {
        this.popover.close();
    }

    // Popover Open Begin

    onReadWebsiteButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5._bfsg_popover.view.fragments.readwebsite", "_pReadWebsitePopover");
    }

    onMoreColorsButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.morecolors", "_oMoreColorsPopover");
    }
            
    onImageAccessPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.accesspopover", "_oPopover");
    }

    onButtonSettingsPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.settings", "_pSettingsPopover");
    }

    onButtonInfoPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.info", "_pInfoPopover");
    }

    onInstantViewButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.instantview", "_pInstantViewPopover");
    }


    onTabNavigationButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.tabnavigation", "_pTabNavigationPopover");
    }

    onColorBlindnessButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.colorblindness", "_pColorBlindnessPopover");
    }

    onHideImagesButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.hideimages", "_pHideImagesPopover");
    }

    onMoreFeaturesButtonPress(oEvent) {
        this.handlePopover(oEvent, this.view, "ui5_bfsg_popover.view.fragments.morefeatures", "_pMoreFeaturesPopover");
    }

    handlePopover(oEvent, oView, fragmentName, popoverKey) {
        if (!this[popoverKey]) {
            this[popoverKey] = Fragment.load({
                id: oView.getId(),
                name: fragmentName,
                controller: oView.getController()
            })
            .then(function (oPopover) {
                oView.addDependent(oPopover);
                return oPopover;
            }.bind(this))
            .catch(function (err) {
                console.error("Fragment yüklenirken hata oluştu:", err);
            });
        }
        this[popoverKey].then(function (oPopover) {
            if (oPopover) {
                oPopover.openBy(oEvent.getSource());
            } else {
                console.error("Popover yüklenemedi veya bulunamadı.");
            }
        });
    }

    // Popover Open End

    //Contrast Mode Begin

    onButtonBackgroundPress(color) {
        const contrastConfig = this.configModel.getProperty("/contrastConfig");
        contrastConfig.backgroundColor = color;
        this.configModel.setProperty("/contrastConfig", contrastConfig);
        this.updatePreview();
    }

    onButtonTextPress(color) {
        const contrastConfig = this.configModel.getProperty("/contrastConfig");
        contrastConfig.textColor = color;
        this.configModel.setProperty("/contrastConfig", contrastConfig);
        this.updatePreview();
    }

    updatePreview() {
        const contrastConfig = this.configModel.getProperty("/contrastConfig");
        const previewElement = document.getElementById("idCanYouReadThisText");
        if (previewElement) {
            previewElement.style.backgroundColor = contrastConfig.backgroundColor;
            previewElement.style.color = contrastConfig.textColor;
        }
    }

    onSaveButtonPress() {
        const contrastConfig = this.configModel.getProperty("/contrastConfig");

        const allElements = document.body.querySelectorAll("*:not(#idMoreColorsResponsivePopover *)");
        allElements.forEach((element) => {
            element.style.backgroundColor = contrastConfig.backgroundColor;
            element.style.color = contrastConfig.textColor;
        });

        this.closePopover();
    }

    onResetButtonPress() {
        this.configModel.setProperty("/contrastConfig", { 
            backgroundColor: "white", 
            textColor: "black", 
            previewBackgroundColor: "white", 
            previewTextColor: "black" 
        });
        this.updatePreview();
    }

    onCancelButtonPress() {
        this.updatePreview();
        this.closePopover();
    }


    //Contrast Mode End


}

module.exports = BFSG_Popover