sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ui5/walkthrough/util/FontSizeHelper",
    "ui5/walkthrough/util/PopoverHelper",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, FontSizeHelper, PopoverHelper, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.App", {
        onInit: function () {
            // Mevcut modeller ve işlevler burada kalır
            const oModel = new JSONModel();
            oModel.loadData("model/keyboardShortcuts.json");
            this.getView().setModel(oModel, "keyboardShortcutsModel");

            // Diğer modeller ve yapılandırmalar
            this._initializeConfigModels();

            // Popover'ı başlatıyoruz
            this._initializePopover();
        },

        _initializeConfigModels: function () {
            const configModel = new JSONModel({
                fontSize: 16,
                contrastMode: false
            });

            const contrastModel = new JSONModel({
                backgroundColor: "white",
                textColor: "black",
                previewBackgroundColor: "white",
                previewTextColor: "black"
            });

            const blueFilterModel = new JSONModel({
                blueFilterActive: false,
                blueFilterIntensity: 32,
                blaufilterExpanded: true
            });

            const readWebsiteModel = new JSONModel({
                speed: 1.0,
                volume: 40,
                isPlaying: false,
                isPaused: false,
                currentText: "",
                mouseReadingActive: false,
                lastReadElement: null
            });

            this.getView().setModel(configModel, "configModel");
            this.getView().setModel(contrastModel, "contrastModel");
            this.getView().setModel(blueFilterModel, "blueFilterModel");
            this.getView().setModel(readWebsiteModel, "readWebsiteModel");
        },

        _initializePopover: async function () {
            // Fragment'i yükleme
            const view = this.getView();
            const button = view.byId("bfsgButton"); // Button ID'yi kontrol edin

            if (!button) {
                console.error("Button not found!");
                return;
            }

            try {
                const popover = await Fragment.load({
                    name: "ui5.walkthrough.view.fragments.accesspopover", // Fragment yolu
                    controller: this
                });

                this._popover = popover;
                view.addDependent(this._popover);

                // Button'a basıldığında popover'ı açmak için event binding
                button.attachPress(this._openPopover.bind(this));
            } catch (error) {
                console.error("Popover loading failed:", error);
            }
        },

        // _openPopover: function (event) {
        //     if (this._popover) {
        //         this._popover.openBy(event.getSource());
        //     } else {
        //         console.error("Popover is not initialized.");
        //     }
        // },

        _closePopover: function () {
            if (this._popover) {
                this._popover.close();
            }
        },

        _fetchStyle: function () {
            // Popover CSS yüklemesi
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "resources/ui5.walkthrough/css/style.css";

            let headScript = document.querySelector("script");
            headScript.parentNode.insertBefore(link, headScript);
        },

        // Read Website Begin

        onIconStartReadPress: function () {
            var oModel = this.getView().getModel("readWebsiteModel");

            if (oModel.getProperty("/isPlaying")) {
                MessageToast.show("Reading is already in progress.");
                return;
            }

            var sText = this._getVisibleTextFromPage();
            if (!sText) {
                MessageToast.show("No readable content found.");
                return;
            }

            oModel.setProperty("/currentText", sText);

            this._oUtterance = new SpeechSynthesisUtterance(sText);
            this._configureUtterance(this._oUtterance, oModel);

            this._oSpeechSynth.speak(this._oUtterance);
        },


        _getVisibleTextFromPage: function () {
            // Seçilen tüm HTML öğelerini filtreleyerek görünür olanları alır
            var visibleText = Array.from(document.body.querySelectorAll("*"))
                .filter(function (el) {
                    // Yalnızca görünür ve okunabilir öğeleri seç
                    return (
                        el.offsetParent !== null && // Görünür öğeler
                        el.innerText.trim() !== "" && // İçeriği boş olmayan öğeler
                        window.getComputedStyle(el).visibility !== "hidden" // Gizli olmayan öğeler
                    );
                })
                .map(function (el) {
                    // Her öğenin iç metin içeriğini al ve boşlukları temizle
                    return el.innerText.trim();
                })
                .join(" "); // Tüm metni birleştirerek tek bir dize haline getir
        
            return visibleText;
        },
        

        // Stop reading
        onIconStopReadPress: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
            if (this._oSpeechSynth.speaking || this._oSpeechSynth.pending) {
                this._oSpeechSynth.cancel();
                oModel.setProperty("/isPlaying", false);
                MessageToast.show("Reading stopped.");
            }
        },

        // Rewind (Restart reading)
        onIconBackReadPress: function () {
            this.onIconStopReadPress();
            this.onIconStartReadPress();
        },

        onButtonIncreaseSpeedPress: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
            var currentSpeed = parseFloat(oModel.getProperty("/speed"));
        
            if (currentSpeed < 2.0) {
                var newSpeed = (currentSpeed + 0.1).toFixed(1);
                oModel.setProperty("/speed", newSpeed);
        
                // Güncel konuşma varsa hız değişikliğini anında uygula
                if (this._oUtterance && this._oSpeechSynth.speaking) {
                    this._oUtterance.rate = newSpeed;
                    MessageToast.show("Speed increased to " + newSpeed + "x.");
                } else {
                    MessageToast.show("Speed set to " + newSpeed + "x. Start reading to apply.");
                }
            } else {
                MessageToast.show("Maximum speed reached.");
            }
        },
        
        onButtonDecreaseSpeedPress: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
            var currentSpeed = parseFloat(oModel.getProperty("/speed"));
        
            if (currentSpeed > 0.5) {
                var newSpeed = (currentSpeed - 0.1).toFixed(1);
                oModel.setProperty("/speed", newSpeed);
        
                // Güncel konuşma varsa hız değişikliğini anında uygula
                if (this._oUtterance && this._oSpeechSynth.speaking) {
                    this._oUtterance.rate = newSpeed;
                    MessageToast.show("Speed decreased to " + newSpeed + "x.");
                } else {
                    MessageToast.show("Speed set to " + newSpeed + "x. Start reading to apply.");
                }
            } else {
                MessageToast.show("Minimum speed reached.");
            }
        },
        
        
        onButtonIncreaseVolumePress: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
            var currentVolume = parseInt(oModel.getProperty("/volume"), 10);
        
            if (currentVolume < 100) {
                var newVolume = currentVolume + 5;
                oModel.setProperty("/volume", newVolume);
        
                // Güncel konuşma varsa ses değişikliğini anında uygula
                if (this._oUtterance && this._oSpeechSynth.speaking) {
                    this._oUtterance.volume = newVolume / 100;
                    MessageToast.show("Volume increased to " + newVolume + "%.");
                } else {
                    MessageToast.show("Volume set to " + newVolume + "%. Start reading to apply.");
                }
            } else {
                MessageToast.show("Maximum volume reached.");
            }
        },
        
        onButtonDecreaseVolumePress: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
            var currentVolume = parseInt(oModel.getProperty("/volume"), 10);
        
            if (currentVolume > 0) {
                var newVolume = currentVolume - 5;
                oModel.setProperty("/volume", newVolume);
        
                // Güncel konuşma varsa ses değişikliğini anında uygula
                if (this._oUtterance && this._oSpeechSynth.speaking) {
                    this._oUtterance.volume = newVolume / 100;
                    MessageToast.show("Volume decreased to " + newVolume + "%.");
                } else {
                    MessageToast.show("Volume set to " + newVolume + "%. Start reading to apply.");
                }
            } else {
                MessageToast.show("Minimum volume reached.");
            }
        },

        _onMouseHoverRead: function (event) {
            var target = event.target; // Fare işaretçisinin altındaki öğeyi al
            var oModel = this.getView().getModel("readWebsiteModel");
        
            // Fare ile okuma aktif değilse hiçbir şey yapma
            if (!oModel.getProperty("/mouseReadingActive")) {
                return;
            }
        
            // Daha önce okunan öğeyi kontrol et
            var lastReadElement = oModel.getProperty("/lastReadElement");
        
            // Aynı öğeyi tekrar okuma
            if (lastReadElement === target) {
                return;
            }
        
            // Öğenin metin içeriğini kontrol et
            var sText = target.innerText.trim();
            if (!sText) {
                // Eğer metin yoksa konuşmayı durdur
                if (this._oSpeechSynth.speaking) {
                    this._oSpeechSynth.cancel();
                }
                oModel.setProperty("/lastReadElement", null);
                return;
            }
        
            // Yeni öğe için okuma işlemini başlat
            oModel.setProperty("/lastReadElement", target);
        
            // Mevcut konuşmayı durdur
            if (this._oSpeechSynth.speaking) {
                this._oSpeechSynth.cancel();
            }
        
            var utterance = new SpeechSynthesisUtterance(sText);
            utterance.rate = oModel.getProperty("/speed");
            utterance.volume = oModel.getProperty("/volume") / 100;
            utterance.lang = "en-US";
        
            this._oSpeechSynth.speak(utterance);
        },
        
        
        
        
        
        
        
        // Restart reading with updated speed or volume
        _restartReadingWithUpdatedSettings: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
        
            if (!oModel.getProperty("/isPlaying")) {
                return; // Do nothing if not currently playing
            }
        
            // Cancel the current speech
            this._oSpeechSynth.cancel();
        
            // Extract the remaining text
            var remainingText = this._oUtterance.text.substring(this._oUtterance.charIndex);
        
            // Create a new utterance for the remaining text
            this._oUtterance = new SpeechSynthesisUtterance(remainingText);
            this._configureUtterance(this._oUtterance, oModel);
        
            // Start speaking again with updated settings
            this._oSpeechSynth.speak(this._oUtterance);
        },
        
        // Helper: Configure SpeechSynthesisUtterance
        _configureUtterance: function (utterance, oModel) {
            utterance.rate = oModel.getProperty("/speed");
            utterance.volume = oModel.getProperty("/volume") / 100;
            utterance.lang = "en-US";
        
            utterance.onstart = () => oModel.setProperty("/isPlaying", true);
            utterance.onend = () => oModel.setProperty("/isPlaying", false);
            utterance.onerror = () => oModel.setProperty("/isPlaying", false);
        },
        

        
        // Read Website End

        // Font Size Begin

        onButtonFontSizeChangePress: function (action) {
            const oModel = this.getView().getModel("configModel");
            const oView = this.getView();
            FontSizeHelper.updateFontSize(oModel, oView, action);
        },



        // Font Size End

        onNightModeButtonPress: function () {
            const oCore = sap.ui.getCore();
            const currentTheme = oCore.getConfiguration().getTheme();
        
            if (currentTheme === "sap_horizon") {
                oCore.applyTheme("sap_horizon_dark");
            } else {
                oCore.applyTheme("sap_horizon");
            }
        },

        onContrastModeButtonPress: function () {
            const oModel = this.getView().getModel("configModel");
            const bContrastMode = oModel.getProperty("/contrastMode");
        
        
            const bNewContrastMode = !bContrastMode;
            oModel.setProperty("/contrastMode", bNewContrastMode);
        
            if (bNewContrastMode) {
                const contrastModel = this.getView().getModel("contrastModel");
                const backgroundColor = contrastModel.getProperty("/backgroundColor");
                const textColor = contrastModel.getProperty("/textColor");
        
            
                this.applyColorsToPage(backgroundColor, textColor);
        
          
                sap.m.MessageToast.show("Contrast mode activated.");
            } else {
                
                this.onButtonContrastResetPress();
                sap.m.MessageToast.show("Contrast mode deactivated. Changes reset to default.");
            }
        },
        

        onButtonBlueFilterPress: function () {
            const oModel = this.getView().getModel("configModel");
            const isActive = oModel.getProperty("/blueFilterActive");
        

            oModel.setProperty("/blueFilterActive", !isActive);
            if (!isActive) {
                const intensity = oModel.getProperty("/blueFilterIntensity");
                this._applyBlueFilterToDom(intensity);
                sap.m.MessageToast.show("Blue Filter Activated");
            } else {
                this._removeBlueFilterFromDom();
                sap.m.MessageToast.show("Blue Filter Deactivated");
            }
        },
        
        onBlueFilterIntensitySliderLiveChange: function (oEvent) {
            const intensity = oEvent.getParameter("value");
            const oModel = this.getView().getModel("configModel");
        
            oModel.setProperty("/blueFilterIntensity", intensity);

            if (oModel.getProperty("/blueFilterActive")) {
                this._applyBlueFilterToDom(intensity);
            }
        },
        
        _applyBlueFilterToDom: function (intensity) {
            const oView = this.getView();
            const aControls = oView.findAggregatedObjects(true, function (oControl) {
                return oControl.getDomRef() !== null; 
            });
            const filterColor = `rgba(0, 0, 255, ${intensity / 100})`;
        
         
            aControls.forEach((oControl) => {
                const oDomRef = oControl.getDomRef();
                if (oDomRef) {
                    oDomRef.style.backgroundColor = filterColor;
                    oDomRef.style.mixBlendMode = "multiply";
        
                    const childNodes = oDomRef.querySelectorAll("*");
                    childNodes.forEach((child) => {
                        child.style.backgroundColor = filterColor;
                        child.style.mixBlendMode = "multiply";
                    });
                }
            });
        },
        
        _removeBlueFilterFromDom: function () {
            const oView = this.getView();
            const aControls = oView.findAggregatedObjects(true, function (oControl) {
                return oControl.getDomRef() !== null; 
            });
        
            aControls.forEach((oControl) => {
                const oDomRef = oControl.getDomRef();
                if (oDomRef) {
                    oDomRef.style.backgroundColor = "";
                    oDomRef.style.mixBlendMode = "";
        
                    const childNodes = oDomRef.querySelectorAll("*");
                    childNodes.forEach((child) => {
                        child.style.backgroundColor = "";
                        child.style.mixBlendMode = "";
                    });
                }
            });
        },

        onButtonCloseKeyboardShortcutsPopoverPress: function () {
            var oPopover = this.byId("idKeyboardShortcutsResponsivePopover");
            if (oPopover) {
                oPopover.close();
            }
        },
        
        

        onButtonBackgroundBlackPress: function() {
            console.log("Black Button klicked")
            this._updatePreview("black", this._getCurrentTextColor());
        },

        onButtonBackgroundWhitePress: function() {
            this._updatePreview("white", this._getCurrentTextColor());
        },

        onButtonBackgroundRedPress: function() {
            this._updatePreview("red", this._getCurrentTextColor());
        },

        onButtonBackgroundYellowPress: function() {
            this._updatePreview("yellow", this._getCurrentTextColor());
        },
        onButtonBackgroundGreenPress: function() {
            this._updatePreview("green", this._getCurrentTextColor());
        },
        onButtonBackgroundBluePress: function() {
            this._updatePreview("blue", this._getCurrentTextColor());
        },

        onButtonTextBlackPress: function() {
            this._updateTextColor("black");
        },

        onButtonTextWhitePress: function() {
            this._updateTextColor("white");
        },

        onButtonTextRedPress: function() {
            this._updateTextColor("red");
        },

        onButtonTextYellowPress: function() {
            this._updateTextColor("yellow");
        },
        onButtonTextGreenPress: function() {
            this._updateTextColor("green");
        },
        onButtonTextBluePress: function() {
            this._updateTextColor("blue");
        },

        onSaveButtonPress: function () {
            var oText = this.byId("idCanYouReadThisText");
            var backgroundColor = oText.getDomRef().style.backgroundColor || "white";
            var textColor = oText.getDomRef().style.color || "black";

           
            this.applyColorsToPage(backgroundColor, textColor);

           
            this._closePopover();

         
            MessageToast.show("Colors applied successfully!");
        },

        onCancelButtonPress: function () {
            this._closePopover();
        },

        onButtonContrastResetPress: function () {
            const defaultBackgroundColor = "white";
            const defaultTextColor = "black";
            const oView = this.getView();
            const aControls = oView.findAggregatedObjects(true, function (oControl) {
                return oControl.getDomRef() !== null;
            });
            aControls.forEach((oControl) => {
                const oDomRef = oControl.getDomRef();
                if (oDomRef) {
                    oDomRef.style.backgroundColor = ""; 
                    oDomRef.style.color = ""; 
                    const childNodes = oDomRef.querySelectorAll("*");
                    childNodes.forEach((child) => {
                        child.style.backgroundColor = "";
                        child.style.color = ""; 
                    });
                }
            });
            const oModel = this.getView().getModel("contrastModel");
            if (oModel) {
                oModel.setProperty("/backgroundColor", defaultBackgroundColor);
                oModel.setProperty("/textColor", defaultTextColor);
                oModel.setProperty("/previewBackgroundColor", defaultBackgroundColor);
                oModel.setProperty("/previewTextColor", defaultTextColor);
            }
            const oText = this.byId("idCanYouReadThisText");
            if (oText && oText.getDomRef()) {
                oText.getDomRef().style.backgroundColor = defaultBackgroundColor;
                oText.getDomRef().style.color = defaultTextColor;
            }
        
            sap.m.MessageToast.show("All changes have been reset to default values.");
        },
        
        
        
        

        applyColorsToPage: function (backgroundColor, textColor) {
            const allElements = document.body.querySelectorAll("*");

            allElements.forEach((element) => {
                if (!element.closest(".contrastmode-popover")) {
                    element.style.backgroundColor = backgroundColor;
                    element.style.color = textColor;
                }
            });
        },

        updateChildColors: function (domElement, backgroundColor, textColor) {
            const childNodes = domElement.querySelectorAll("*");
            childNodes.forEach((child) => {
                child.style.backgroundColor = backgroundColor;
                child.style.color = textColor;
            });
        },

        _closePopover: function () {
            var oPopover = this.byId("idMoreColorsResponsivePopover");
            if (oPopover) {
                oPopover.close();
            }
        },

        _updatePreview: function(backgroundColor, textColor) {
            var oText = this.byId("idCanYouReadThisText");
            if (oText) {
                oText.getDomRef().style.backgroundColor = backgroundColor;
                oText.getDomRef().style.color = textColor;
            }
        },

        _updateTextColor: function(textColor) {
            var oText = this.byId("idCanYouReadThisText");
            if (oText) {
                oText.getDomRef().style.color = textColor;
            }
        },

        _getCurrentTextColor: function() {
            var oText = this.byId("idCanYouReadThisText");
            if (oText && oText.getDomRef()) {
                return oText.getDomRef().style.color || "black"; // Default to black
            }
            return "black";
        },

        onMoreColorsButtonPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.morecolors", "_oMoreColorsPopover");
        },
                
        onImageAccessPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.accesspopover", "_oPopover");
        },

        onButtonSettingsPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.settings", "_pSettingsPopover");
        },

        onButtonInfoPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.info", "_pInfoPopover");
        },

        onInstantViewButtonPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.instantview", "_pInstantViewPopover");
        },

        onReadWebsiteButtonPress: function (oEvent) {
            // Popover'u aç
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.readwebsite", "_pReadWebsitePopover");

            // var oModel = this.getView().getModel("readWebsiteModel");
            // var isMouseReadingActive = oModel.getProperty("/mouseReadingActive");

            // if (!isMouseReadingActive) {
            //     // Fare ile okuma aktif değilse, etkinleştir
            //     oModel.setProperty("/mouseReadingActive", true);
            //     MessageToast.show("Mouse hover reading activated.");

            //     // Fare hareketlerini dinlemeye başla
            //     document.body.addEventListener("mousemove", this._onMouseHoverRead.bind(this));
            // } else {
            //     this._deactivateMouseHoverReading();
            // }
        },

        onSwitchPointerReadChange: function (oEvent) {
            var isActive = oEvent.getParameter("state"); // Switch'in durumu (true: ON, false: OFF)
            var oModel = this.getView().getModel("readWebsiteModel");
        
            if (isActive) {
                // Fare ile okuma özelliğini etkinleştir
                oModel.setProperty("/mouseReadingActive", true);
                MessageToast.show("Mouse hover reading activated.");
        
                // Fare hareketlerini dinlemeye başla
                document.body.addEventListener("mousemove", this._onMouseHoverRead.bind(this));
            } else {
                // Fare ile okuma özelliğini devre dışı bırak
                this._deactivateMouseHoverReading();
            }
        },
        

        _deactivateMouseHoverReading: function () {
            var oModel = this.getView().getModel("readWebsiteModel");
        
            // Fare hareketlerini dinlemeyi durdur
            document.body.removeEventListener("mousemove", this._onMouseHoverRead.bind(this));
        
            // Mevcut konuşmayı durdur
            if (this._oSpeechSynth.speaking || this._oSpeechSynth.pending) {
                this._oSpeechSynth.cancel(); // Devam eden konuşmayı iptal et
            }
        
            // Model güncellemesi
            oModel.setProperty("/mouseReadingActive", false);
            oModel.setProperty("/lastReadElement", null); // Son okunan öğeyi sıfırla
        
            // Kullanıcıya bilgi ver
            MessageToast.show("Mouse hover reading deactivated.");
        },
        
        
        


        onTabNavigationButtonPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.tabnavigation", "_pTabNavigationPopover");
        },

        onColorBlindnessButtonPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.colorblindness", "_pColorBlindnessPopover");
        },

        onHideImagesButtonPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.hideimages", "_pHideImagesPopover");
        },

        onMoreFeaturesButtonPress: function (oEvent) {
            PopoverHelper.handlePopover(oEvent, this.getView(), "ui5.walkthrough.view.fragments.morefeatures", "_pMoreFeaturesPopover");
        },

        
        
    });
});
