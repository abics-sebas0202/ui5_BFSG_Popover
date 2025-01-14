sap.ui.define(
  ["sap/ui/core/mvc/Controller", "ui5_bfsg_popover"],
  function (Controller, PopoverControl) {
    "use strict";

    return Controller.extend("testapp.controller.App", {
      onInit: function () {
        this._oPopoverControl = new PopoverControl(this.getView());
      },

      onIconOpenPopoverPress: function () {
        const oButton = this.byId("idOpenPopoverIcon");
        this._oPopoverControl.open(oButton);
      },
    });
  }
);
