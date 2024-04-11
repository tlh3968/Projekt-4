function updateEpisodeCount() {
    let episodeCount = document.getElementById("episodeCount");
    let isChecked = document.getElementById("check2").checked;
    if (isChecked) {
      episodeCount.textContent = "8/8";
    } else {
      episodeCount.textContent = "4/8";
    }
  }