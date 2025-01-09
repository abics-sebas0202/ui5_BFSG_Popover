sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "ui5_bfsg_popover"
    ],
    function(BaseController, bfsg_popover) {
      "use strict";
  
      return BaseController.extend("testapp.controller.App", {
        onInit() {
        },
    
        onAfterRendering() {
          this.initBfsgPopover();
        },
    
        initBfsgPopover() {
          let view = this.getView(),
          button = this.getView().byId("idBfsgImage");
            
          new bfsg_popover(view, button);
        }
      });
    }
  );
  