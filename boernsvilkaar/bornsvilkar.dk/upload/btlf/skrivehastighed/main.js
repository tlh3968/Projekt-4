
const danish =
  "om|hvordan|med|måtte|hos|alle|side|hvad|blandt|dag|gennem|par|ingen|må|du|fik|den|mand|samme|det|sine|denne|få|alt|kun|nogle|den|gang|gå|også|del|blevet|god|tre|uden|lige|mindre|fordi|store|måske|arbejde|verden|ingen|dette|dog|unge|da|ca|kom|er|arbejde|Danmark|går|langt|jo|endnu|op|kunne|være|vi|to|blev|ligger|frem|vores|samme|hun|for|der|hendes|hele|jo|mange|hans|sagde|synes|han|gennem|tidligere|derfor|nogle|her|så|os|gang|gik|deres|to|os|sidste|kommer|jeg|lille|hver|dansk|gamle|sådan|på|ligger|lidt|bare|ved|ca|vi|får|siger|dig|hende|folk|mener|siden|tid|når|hvis|først|anden|par|til|tror|kommer|lidt|giver|fra|anden|mener|gamle|tilbage|nye|netop|bliver|nogen|de|dig|disse|giver|sig|ville|efter|endnu|disse|og|år|var|alt|mest|hvor|stadig|her|fik|store|mod|komme|hende|end|have|tror|ikke|op|næsten|både|både|det|ja|skal|på|først|mere|langt|min|en|andet|ikke|hun|man|danske|måde|selv|mand|selv|uden|jeg|bare|man|ned|sig|helt|står|aldrig|meget|kun|ham|mig|stor|ham|ind|blive|som|blev|der|var|ud|stadig|mindre|allerede|gik|et|over|ny|måske|nok|dog|tale|til|tidligere|sit|stor|sige|gå|altså|efter|siden|nogen|af|nu|bliver|dette|ja|tage|kunne|du|en|hendes|gøre|dem|ser|hvor|nok|frem|de|da|andre|komme|skal|noget|så|sammen|sine|flere|igen|første|mellem|gøre|dag|mennesker|fire|mens|se|eller|gør|synes|lige|sin|fordi|mellem|helt|godt|allerede|blive|ind|af|måde|mig|tale|tid|fået|tre|igen|står|andre|tage|give|eller|nu|ved|mod|været|blevet|sit|meget|skulle|hans|god|under|et|netop|mere|sin|at|hvis|altid|tilbage|folk|vil|siger|kan|unge|omkring|fået|denne|vores|del|end|må|dem|børn|ned|fire|sammen|hver|København|mennesker|se|første|få|noget|i|kom|går|men|før|havde|";
const specifics = 
"problem|hjælpe|forældre|lærer|kommune|ensomhed|mobning|kærlighed|tanker|tænker|trøste|støtte|lytte|fortælle|bekymret|rettigheder|nysgerrig|stoler|tillid|tvivl|usikker|forstår|starte|skilsmisse|samtale|trist|opfører|hårdt|normalt|almindeligt|naturligt|mulighed|følelser|mening|svært|anbefale|prøve|spørge|snakke|skrive|angst|familie|";


// jQuery like selection of elements.
window.$ = document.querySelectorAll.bind(document);

// Knuth-Fisher-Yates Shuffle
// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let m = array.length,
      t,
      i;

  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--); // And swap it with the current element.

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

// Add words to word-section
function addWords() {

  const combined_words = danish+specifics;
  const danish_words = combined_words.split("|");
  const wordSet = new Set(danish_words);
  const unique_words = [...wordSet];

  // Clear existing word-section
  const wordSection = document.querySelectorAll("#word-section")[0];
  wordSection.innerHTML = "";
  window.$("#typebox")[0].value = "";

  const total = unique_words.length
  for (let i = total; i > 0; i--) {
    const words = shuffle(unique_words);
    if  (words[i])  {
      const wordSpan = `<span>${words[i]}</span>`;
      wordSection.innerHTML += wordSpan;
    }
  }

  // Mark first word as current-word
  wordSection.firstChild.classList.add("current-word");
}

// Word Colors
const colorCurrentWord = "#dddddd";
const colorCorrectWord = "#93C572";
const colorIncorrectWord = "#e50000";

// Word Count and other data.
const wordData = {
  seconds: 60,
  correct: 0,
  incorrect: 0,
  total: 0,
  typed: 0,
};

function checkWord(word) {
  
  const wlen = word.value.length;
  const wval = word.value.trim();

  // How much we have of the current word.
  const current = window.$(".current-word")[0];
  const currentSubstring = current.innerHTML.substring(0, wlen);

  // Check if we have any typing errors and make sure there is a real
  // word to check https://github.com/anschwa/typing-test/issues/2
  const noMatch = wval !== currentSubstring;
  const emptyWords = wval === '' || currentSubstring === '';

  if (noMatch || emptyWords) {
    current.classList.add("incorrect-word-bg");
    return false;
  } else {
    current.classList.remove("incorrect-word-bg");
    return true;
  }
}

function submitWord(word) {
  // Update current-word and keep track of correct & incorrect words
  const current = window.$(".current-word")[0];

  if (checkWord(word)) {
    current.classList.remove("current-word");
    current.classList.add("correct-word-c");
    wordData.correct += 1;
  } else {
    current.classList.remove("current-word", "incorrect-word-bg");
    current.classList.add("incorrect-word-c");
    wordData.incorrect += 1;
  }

  // Update wordData
  wordData.total = wordData.correct + wordData.incorrect;

  // Make the next word the new current-word.
  current.nextSibling.classList.add("current-word");
}

function clearLine() {
  // Remove past words once you get to the next line
  const wordSection = window.$("#word-section")[0];
  const current = window.$(".current-word")[0];
  const previous = current.previousSibling;
  const children = window.$(".correct-word-c, .incorrect-word-c").length;

  // <span>'s on the next line have a greater offsetTop value than
  // those on the top line. Remove words until the first word on the
  // second line is the fistChild of word-section.
  if (current.offsetTop > previous.offsetTop) {
    for (let i = 0; i < children; i++) {
      wordSection.removeChild(wordSection.firstChild);
    }
  }
}

let typingTimer = null;
function isTimer(seconds) {
  // BUG: page refresh with keyboard triggers onkeyup and starts timer
  const time = window.$("#timer > span")[0].innerHTML;
  if (time === "0:00") {
    return false;
  }

  // Only set timer once
  if (time === "1:00" && typingTimer === null) {
    typingTimer = window.setInterval(() => {
      if (seconds <= 0) {
        window.clearInterval(typingTimer);
      } else {
        seconds -= 1;
        const timePad = seconds < 10 ? "0" + seconds : seconds; // Zero padded

        window.$("#timer > span")[0].innerHTML = `0:${timePad}`;
      }
    }, 1000);
  }

  return true;
}

function calculateWPM(data) {
  const { seconds, correct, incorrect, total, typed } = data;
  const minutes = seconds / 60;
  const wpm = Math.max(0, Math.ceil(((typed / 5) - incorrect) / minutes));
  const accuracy = Math.ceil((correct / total) * 100);

  
  const results = `
<div id="results">
<div class="result-header">Dit resultat</div>
          <div class="result-details">
  <div class="wpm">
  <span class="wpm-value">${wpm} OPM</span>
  <small>(ord per minut)</small> 
  </div>
  <div id="results-stats">
    <div class="typed">Anslag: <span>${typed}</span></div>
    <div class="accuracy">Nøjagtighed: <span class="accuracy-value">${accuracy}%</span></div>
    <div class="total">Total Words: <span>${total}</span></div>
    <div class="right">Rigtige ord: <span>${correct}</span></div>
    <div class="wrong">Forkerte ord: <span>${incorrect}</span></div>
    </div>
  </div>
</div>
`;

  var wsection = window.$("#word-section")[0];
  wsection.innerHTML = results;
  wsection.classList.add("result-section");

  // Color-code accuracy
  const wpmClass = window.$(".accuracy-value")[0].classList;
  if (accuracy > 80) {
    wpmClass.add("correct-word-c");
  } else {
    wpmClass.add("incorrect-word-c");
  }

  console.log(wordData);
}

function typingTest(e) {
  const SPACE = 32;
  const ENTER = 13;
  

  // Get key code of current key pressed.
  e = e || window.event;
  const kcode = e.keyCode;
  const word = window.$("#typebox")[0];

  // Check if empty (starts with space)
  if (word.value.match(/^\s/g)) {
    word.value = "";
    return;
  }

  // Display typing test results when timer runs out.
  const isGameover = !isTimer(wordData.seconds);
  if (isGameover) {
    calculateWPM(wordData);
    return;
  }

  // Otherwise, keep score when timer is on.
  checkWord(word);
  if (kcode === SPACE) {
    submitWord(word);
    clearLine();

    window.$("#typebox")[0].value = "";
  }

  wordData.typed += 1;
}

function restartTest() {
  window.$("#typebox")[0].value = "";
  window.location.reload();
}


function ready(callbackFunc) {
  if (document.readyState !== 'loading') {
    // Document is already ready, call the callback directly
    callbackFunc();
  } else if (document.addEventListener) {
    // All modern browsers to register DOMContentLoaded
    document.addEventListener('DOMContentLoaded', callbackFunc);
  } else {
    // Old IE browsers
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') {
        callbackFunc();
      }
    });
  }
}

ready(function() {
    addWords();
});

