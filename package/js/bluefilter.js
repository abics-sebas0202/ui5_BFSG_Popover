function onButtonBlueFilterPress(oModel, oBody) {
    const isBlueFilterActive = oModel.getProperty("/blueFilter/isActive");

    if (!isBlueFilterActive) {
        oModel.setProperty("/blueFilter/isActive", true);
        oModel.setProperty("/blueFilter/blueFilterIntensity", 32);
        oModel.setProperty("/blueFilter/blaufilterExpanded", true);
        const intensity = oModel.getProperty("/blueFilter/blueFilterIntensity");
        oBody.style.filter = `brightness(${1 - intensity / 100}) sepia(0.4) saturate(1.8) hue-rotate(180deg)`;

        console.log("Blue filter activated with default intensity 32.");
    } else {
        oModel.setProperty("/blueFilter/isActive", false);
        oModel.setProperty("/blueFilter/blaufilterExpanded", false);
        oBody.style.filter = "";

        console.log("Blue filter deactivated.");
    }
}

function onBlueFilterIntensitySliderLiveChange(oModel, intensity, oBody) {
    oModel.setProperty("/blueFilter/blueFilterIntensity", intensity);
    oBody.style.filter = `brightness(${1 - intensity / 100}) sepia(0.4) saturate(1.8) hue-rotate(180deg)`;

    console.log(`Blue filter intensity set to ${intensity}%`);
}

module.exports = {
    onButtonBlueFilterPress,
    onBlueFilterIntensitySliderLiveChange,
};