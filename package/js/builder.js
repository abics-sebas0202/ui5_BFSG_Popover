const Fragment = require("sap/ui/core/Fragment");

async function buildPopover(context) {
  try {
    const popover = await Fragment.load({
      id: context.view.createId("uniquePopover"),
      name: "ui5_bfsg_popover.popover",
      controller: context,
    });
    context.popover = popover; 
    context.view.addDependent(popover);
    console.log("Popover successfully loaded.");
  } catch (error) {
    console.error("An error occurred while loading the popover:", error);
  }
}

function open(oButton, oData, context) {
  if (!context.popover) {
    console.warn("Popover is not loaded yet. Reloading...");
    buildPopover(context).then(() => {
      if (context.popover) {
        context.configModel.setData(oData, true);
        context.popover.openBy(oButton);
      } else {
        console.error("Popover could not be loaded.");
      }
    });
    return;
  }

  context.configModel.setData(oData, true);
  context.popover.openBy(oButton);
}

function onClose(context) {
  if (context.popover) {
    context.popover.close();
    console.log("Popover closed.");
  } else {
    console.warn("Popover is not available to close.");
  }
}

module.exports = { buildPopover, open, onClose };
