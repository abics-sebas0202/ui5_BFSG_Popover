const sapMessageToast = require("sap/m/MessageToast");

function startReading(oModel, speechSynth, getVisibleText) {
  if (oModel.getProperty("/readWebsite/isPlaying")) {
    sapMessageToast.show("Reading is already in progress.");
    return;
  }

  const sText = getVisibleText();
  if (!sText) {
    sapMessageToast.show("No readable content found.");
    return;
  }

  oModel.setProperty("/readWebsite/currentText", sText);

  const utterance = new SpeechSynthesisUtterance(sText);
  configureUtterance(utterance, oModel, speechSynth);
  speechSynth.speak(utterance);
}

function stopReading(oModel, speechSynth) {
  if (speechSynth.speaking || speechSynth.pending) {
    speechSynth.cancel();
    oModel.setProperty("/readWebsite/isPlaying", false);
    sapMessageToast.show("Reading stopped.");
  }
}

function increaseSpeed(oModel, utterance, speechSynth) {
  const currentSpeed = parseFloat(oModel.getProperty("/readWebsite/speed"));

  if (currentSpeed < 2.0) {
    const newSpeed = (currentSpeed + 0.1).toFixed(1);
    oModel.setProperty("/readWebsite/speed", newSpeed);

    if (utterance && speechSynth.speaking) {
      utterance.rate = newSpeed;
      sapMessageToast.show(`Speed increased to ${newSpeed}x.`);
    } else {
      sapMessageToast.show(`Speed set to ${newSpeed}x. Start reading to apply.`);
    }
  } else {
    sapMessageToast.show("Maximum speed reached.");
  }
}

function decreaseSpeed(oModel, utterance, speechSynth) {
  const currentSpeed = parseFloat(oModel.getProperty("/readWebsite/speed"));

  if (currentSpeed > 0.5) {
    const newSpeed = (currentSpeed - 0.1).toFixed(1);
    oModel.setProperty("/readWebsite/speed", newSpeed);

    if (utterance && speechSynth.speaking) {
      utterance.rate = newSpeed;
      sapMessageToast.show(`Speed decreased to ${newSpeed}x.`);
    } else {
      sapMessageToast.show(`Speed set to ${newSpeed}x. Start reading to apply.`);
    }
  } else {
    sapMessageToast.show("Minimum speed reached.");
  }
}

function configureUtterance(utterance, oModel, speechSynth) {
  utterance.rate = oModel.getProperty("/readWebsite/speed");
  utterance.volume = oModel.getProperty("/readWebsite/volume") / 100;
  utterance.lang = "en-US";

  utterance.onstart = () => oModel.setProperty("/readWebsite/isPlaying", true);
  utterance.onend = () => oModel.setProperty("/readWebsite/isPlaying", false);
  utterance.onerror = () => oModel.setProperty("/readWebsite/isPlaying", false);
}

function getVisibleTextFromPage() {
  const visibleText = Array.from(document.body.querySelectorAll("*"))
    .filter(
      (el) =>
        el.offsetParent !== null &&
        el.innerText.trim() !== "" &&
        window.getComputedStyle(el).visibility !== "hidden"
    )
    .map((el) => el.innerText.trim())
    .join(" ");

  return visibleText;
}

module.exports = {
  startReading,
  stopReading,
  increaseSpeed,
  decreaseSpeed,
  configureUtterance,
  getVisibleTextFromPage,
};
