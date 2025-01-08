sap.ui.define([
    "sap/ui/core/Fragment"
], function (Fragment) {
    "use strict";

    return {
        handlePopover: function (oEvent, oView, fragmentName, popoverKey) {
            if (!this[popoverKey]) {
                this[popoverKey] = Fragment.load({
                    id: oView.getId(),
                    name: fragmentName, 
                    controller: oView.getController()
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                }).catch(function (err) {
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
    };
});
