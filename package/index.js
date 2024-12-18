const JSON = require('sap/ui/model/json/JSONModel');
const Fragment = require('sap/ui/core/Fragment');
//blblabla
class BFSG_Popover {
    constructor(view, control) {
        this.view = view;
        this.control = control;

        this.genConfigModel({});
        this.buildPopover();
        this.attachPress();
        this.fetchStyle();
    }

    getHandler () {
        return {
            "fontSize": {
            "value": document.documentElement.style.fontSize.split("px")[0],
            "callback": this.changeFontSize
            },
            "contrastMode": {
                "value": false,
                "callback": this.changeContrastMode
            },
            "blueLight": {
                "value": 0,
                "callback": this.changeBlueLight
            }
        };        
    }

    genConfigModel(config) {
        const handler = this.getHandler();
        let o = {};
        for(let key in handler){
            o[key] = handler[key].value;
        }
        Object.assign(config, o);
        this.configModel = new JSON(config);
        this.view.setModel(this.configModel, "configModel");
        this.attachChangeToModel();
    }

    attachChangeToModel() {
        const handler = this.getHandler();
        const config = this.configModel.getData();
        for(let key in config){
            let binding = this.configModel.bindProperty(`/${key}`);
            binding.attachChange(handler[key].callback);
        }
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