const Fragment = require("sap/ui/core/Fragment");

async function loadPopover(context, popoverName, fragmentPath, source) {
  if (!context[popoverName]) {
    try {
      const popover = await Fragment.load({
        id: context.view.createId(popoverName),
        name: fragmentPath,
        controller: context,
      });

      context.view.addDependent(popover);
      context[popoverName] = popover;
      console.log(`${popoverName} successfully loaded and attached to the view.`);
    } catch (error) {
      console.error(`An error occurred while loading the ${popoverName}:`, error);
      return;
    }
  }

  context[popoverName].openBy(source);
  console.log(`${popoverName} opened by source:`, source);
}

async function onTabNavigationButtonPress(oEvent, context) {
  const oSource = oEvent.getSource();
  await loadPopover(context, "tabNavigationPopover", "ui5_bfsg_popover.fragments.tabnavigation", oSource);
}

async function onMoreFeaturesButtonPress(oEvent, context) {
  const oSource = oEvent.getSource();
  await loadPopover(context, "moreFeaturesPopover", "ui5_bfsg_popover.fragments.morefeatures", oSource);
}

module.exports = {
  onTabNavigationButtonPress,
  onMoreFeaturesButtonPress,
};
