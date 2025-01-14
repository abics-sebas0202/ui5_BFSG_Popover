
function onHideImagesButtonPress(oView, imagesHidden) {
    const aImageControls = oView.findAggregatedObjects(true, (oControl) => {
        return oControl.isA("sap.m.Image");
    });

    imagesHidden = !imagesHidden;
    aImageControls.forEach((oImage) => {
        oImage.setVisible(!imagesHidden);
    });

    console.log(imagesHidden ? "All images are now hidden." : "All images are now visible.");

    return imagesHidden;
}

module.exports = {
    onHideImagesButtonPress,
};