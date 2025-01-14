const sapMessageToast = require("sap/m/MessageToast");

function startOrPauseReading(oModel, speechSynth, getVisibleText) {
  const isPlaying = oModel.getProperty("/readWebsite/isPlaying");
  const isPointerReadEnabled = oModel.getProperty("/readWebsite/isPointerReadEnabled");

  if (isPointerReadEnabled) {
    sapMessageToast.show("Pointer Reading is active. Please disable it to start normal reading.");
    return;
  }

  if (isPlaying) {
    speechSynth.pause();
    oModel.setProperty("/readWebsite/isPlaying", false);
    sapMessageToast.show("Reading paused.");
  } else {
    if (speechSynth.paused) {
      speechSynth.resume();
      oModel.setProperty("/readWebsite/isPlaying", true);
      sapMessageToast.show("Reading resumed.");
    } else {
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
  }
}

function stopReading(oModel, speechSynth) {
  const isPointerReadEnabled = oModel.getProperty("/readWebsite/isPointerReadEnabled");

  if (isPointerReadEnabled) {
    sapMessageToast.show("Pointer Reading is active. Please disable it to stop reading.");
    return;
  }

  if (speechSynth.speaking || speechSynth.pending) {
    speechSynth.cancel();
    oModel.setProperty("/readWebsite/isPlaying", false);
    sapMessageToast.show("Reading stopped.");
  }
}

function onSwitchPointerReadChange(oEvent, oModel, speechSynth) {
  const isPointerReadEnabled = oEvent.getParameter("state");
  oModel.setProperty("/readWebsite/isPointerReadEnabled", isPointerReadEnabled);

  if (isPointerReadEnabled) {
    enablePointerRead(oModel, speechSynth);
    console.log("Pointer reading enabled.");
  } else {
    disablePointerRead(oModel, speechSynth);
    console.log("Pointer reading disabled.");
  }
}


function enablePointerRead(oModel, speechSynth) {
  // Mouseover olayını dinle
  document.body.addEventListener("mouseover", (event) => {
    if (!oModel.getProperty("/readWebsite/isPointerReadEnabled")) return; 

    const text = event.target.innerText?.trim();
    if (text && text !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      configureUtterance(utterance, oModel, speechSynth);
      speechSynth.speak(utterance);
    }
  });

  // Mouseout olayını dinle (sesi durdurur)
  document.body.addEventListener("mouseout", () => {
    if (speechSynth.speaking || speechSynth.pending) {
      speechSynth.cancel();
    }
  });
}

function disablePointerRead(oModel, speechSynth) {
  // Olay dinleyicilerini kaldır
  document.body.removeEventListener("mouseover", null);
  document.body.removeEventListener("mouseout", null);

  // Eğer konuşuyorsa durdur
  if (speechSynth.speaking || speechSynth.pending) {
    speechSynth.cancel();
  }
  oModel.setProperty("/readWebsite/isPointerReadEnabled", false);
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

function increaseSpeed(oModel, utterance, speechSynth) {
  const currentSpeed = parseFloat(oModel.getProperty("/readWebsite/speed"));

  if (currentSpeed < 2.0) {
    const newSpeed = (currentSpeed + 0.1).toFixed(1);
    oModel.setProperty("/readWebsite/speed", newSpeed);

    if (utterance && speechSynth.speaking) {
      utterance.rate = newSpeed; 
      speechSynth.cancel(); 
      speechSynth.speak(utterance);
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
      speechSynth.cancel(); 
      speechSynth.speak(utterance); 
      sapMessageToast.show(`Speed decreased to ${newSpeed}x.`);
    } else {
      sapMessageToast.show(`Speed set to ${newSpeed}x. Start reading to apply.`);
    }
  } else {
    sapMessageToast.show("Minimum speed reached.");
  }
}

function configureUtterance(utterance, oModel, speechSynth) {
  utterance.rate = parseFloat(oModel.getProperty("/readWebsite/speed")); 
  utterance.volume = parseFloat(oModel.getProperty("/readWebsite/volume")) / 100; 
  utterance.lang = "en-US";

  utterance.onstart = () => oModel.setProperty("/readWebsite/isPlaying", true);
  utterance.onend = () => oModel.setProperty("/readWebsite/isPlaying", false);
  utterance.onerror = () => oModel.setProperty("/readWebsite/isPlaying", false);
}

function increaseVolume(oModel) {
  const currentVolume = parseFloat(oModel.getProperty("/readWebsite/volume"));

  if (currentVolume < 100) {
    const newVolume = currentVolume + 10;
    oModel.setProperty("/readWebsite/volume", newVolume);

    sapMessageToast.show(`Volume increased to ${newVolume}%.`);
  } else {
    sapMessageToast.show("Maximum volume reached.");
  }
}

function decreaseVolume(oModel) {
  const currentVolume = parseFloat(oModel.getProperty("/readWebsite/volume"));

  if (currentVolume > 0) {
    const newVolume = currentVolume - 10;
    oModel.setProperty("/readWebsite/volume", newVolume);

    sapMessageToast.show(`Volume decreased to ${newVolume}%.`);
  } else {
    sapMessageToast.show("Minimum volume reached.");
  }
}

module.exports = {
  onSwitchPointerReadChange,
  startOrPauseReading,
  stopReading,
  increaseSpeed,
  decreaseSpeed,
  increaseVolume,
  decreaseVolume,
  configureUtterance,
  getVisibleTextFromPage,
};
