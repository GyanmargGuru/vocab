// > functionality # 1: for update/ deletion, search of word is required so load the json data as 
// soon as the page loads

const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file
//const btn = document.querySelector('button');
//const dictionary = document.querySelector('.dictionary-table');

var jsonData = null; // Initialize dictionary json (entire dictionary) with null

async function dictionaryLoad() {
    // This function reads the json file and stores the content as json 
    fetch(dictionaryPath) // Fetch the JSON file
        .then(response => response.json()) // Parse the JSON response
        .then(dataDict => {
            jsonData = dataDict; // Store the json data in variable to be searched
        })
        .catch(error => {
            console.error("Error loading the dictionary:", error);
        });
}

dictionaryLoad(); // Call the dictionary load function when the page loads. Now it is ready to search words

// > functionality #2: page will only show add or update/ delete button. Depending on 
// what user chooses (add or update/ delete), respective form will show up. 

// get buttons and form by ids

const addContainer = document.getElementById("addcontainer");
const updelContainer = document.getElementById("updelcontainer");
const maddButton = document.getElementById("maddButton");
const mupdelButton = document.getElementById("mupdelButton");

// set button listeners
maddButton.addEventListener("click", function () {
    addContainer.classList.remove("hidden");
    maddButton.classList.add("hidden");
    mupdelButton.classList.add("hidden");
})

mupdelButton.addEventListener("click", function () {
    updelContainer.classList.remove("hidden");
    maddButton.classList.add("hidden");
    mupdelButton.classList.add("hidden");
})

backButton1.addEventListener("click", function () {
    maddButton.classList.remove("hidden");
    mupdelButton.classList.remove("hidden");
    addContainer.classList.add("hidden");
    updelContainer.classList.add("hidden");
})

backButton2.addEventListener("click", function () {
    maddButton.classList.remove("hidden");
    mupdelButton.classList.remove("hidden");
    addContainer.classList.add("hidden");
    updelContainer.classList.add("hidden");
})

// > functionality 3: functions that will parse data for input during add or update functions

function toSentenceCase(inputString) {
    // This function capitalizes first letter of a sentence or word
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}


function capitalizeEachWord(synString){
    // This function takes a string splits the string into array of words (processing synonyms)
    // Capitalizes each of them and returns it back as string
    const synWords = synString.split(', ');

    // Capitalize the first letter of each word
    const capitalizedWords = synWords.map(sword => {
        return toSentenceCase(sword.trim());
    });
    //const synResult = capitalizedWords.join(', ');
    return capitalizedWords;
}

function collectAddData () {
    // This function collects data from constious sections of the add or update form
    const newWord = {};
    const eword = document.getElementById("add_eword").value.trim();
    const sc_eword = toSentenceCase(eword);
    const esyn = document.getElementById("add_esyn").value;
    const cap_esyn = capitalizeEachWord(esyn);
    const edes = document.getElementById("add_edes").value.trim();
    const sc_edes = toSentenceCase(edes);
    const hdword = document.getElementById("add_hdword").value.trim();
    const hrword = document.getElementById("add_hrword").value.trim();
    const sc_hrword = toSentenceCase(hrword);
    const hsyn = document.getElementById("add_hsyn").value.trim();
    const array_hsyn = capitalizeEachWord(hsyn);
    const hdes = document.getElementById("add_hdes").value.trim();
    newWord[sc_eword] = {
        "english_synonyms": cap_esyn,
        "english_description": sc_edes,
        "hindi_word": [ sc_hrword, hdword ],
        "hindi_synonyms": array_hsyn,
        "hindi_description": hdes
    }
    return newWord;
}

function collectUpdateData() {
    // This function collects data from constious sections of the add or update form
    const newWord = {};
    const eword = document.getElementById("add_eword").value.trim()
    const sc_eword = toSentenceCase(eword);
    const esyn = document.getElementById("add_esyn").value
    const cap_esyn = capitalizeEachWord(esyn);
    const edes = document.getElementById("add_edes").value.trim()
    const sc_edes = toSentenceCase(edes);
    const hdword = document.getElementById("add_hdword").value;
    const hrword = document.getElementById("add_hrword").value;
    const sc_hrword = toSentenceCase(hrword);
    const hsyn = document.getElementById("add_hsyn").value;
    const array_hsyn = hsyn.split(',');
    const hdes = document.getElementById("add_hdes").value;
    newWord[sc_eword] = {
        "english_synonyms": cap_esyn,
        "english_description": sc_edes,
        "hindi_word": [ sc_hrword, hdword],
        "hindi_synonyms": array_hsyn,
        "hindi_description": hdes
    }
    return newWord;
}

function validateHindiword(wordEntry) {
    // This function validates if Hindi word entry is complete
    var isValid = true;
    if (wordEntry["hindi_word"][0] === "" && wordEntry["hindi_word"][1] === "") {
        // No Hindi word
        hindiWord = false;
        isValid = false;
        if (wordEntry["hindi_synonyms"][0] !== "" || wordEntry["hindi_description"] !== "") {
            // Synonyms and Description added without Hindi word
            alert("Use update if you want to add synonyms or update the description of existing Hindi words");
        }
    }
    else if ((wordEntry["hindi_word"][0] !== "" && wordEntry["hindi_word"][1] === "") ||
        (wordEntry["hindi_word"][0] === "" && wordEntry["hindi_word"][1] !== "")) {
        // Hindi word but only in Devnagri or Roman script
        alert("Both Devnagri Hindi word and Roman Hindi word is required!");
        hindiWord = false;
        isValid = false;
    }
    else if (wordEntry["hindi_word"][0] !== "" && wordEntry["hindi_word"][1] !== "") {
        hindiWord = true;
        // valid hindi word is there, so synonyms and description should also be there
        if (wordEntry["hindi_synonyms"][0] === "" || wordEntry["hindi_description"] === "") {
            // Hindi word but no synonyms or description
            alert("For Hindi word entry, respective synonyms and description is required!");
            isValid = false;
        } else if (wordEntry["hindi_synonyms"][0] !== "" && wordEntry["hindi_description"] !== "") {
            // Hindi word with synonyms and description
            isValid = true;
            alert("Valid Hindi word entry")
        }
    }
    return isValid;
}

function validateForm(newWord) {
    // This function validates the word entry
    var wordStatus = [];
    var englishWord = true;
    var englishValid = true;
    var hindiValid = true;
    for (let [eword, word_entry] of Object.entries(newWord)) {
        console.log(eword, word_entry);
        if (eword === "") { // No English word
            englishWord = false;
            englishValid = false;
            if (word_entry["english_synonyms"][0] !== "" || word_entry["english_description"] !== "") {
                // English word with synonyms and description
                alert("Use update if you want to add synonyms or update the description of existing English words");
            }
            var hindiValid = validateHindiword(word_entry);
            if (!hindiValid) {
                // No or Incorrect Hindi word Entry
                alert("Either English word or Hindi word is required!");
                wordStatus = [false, englishValid, hindiValid];
                break;
            }
            wordStatus = [false, englishValid, hindiValid]
        } else if (eword !== "") { // English word
            englishWord = true;
            if (word_entry["english_synonyms"][0] === "" || word_entry["english_description"] === "") {
                // English word but no synonyms and description
                alert("For English word entry, respective synonyms and description is required!");
                englishValid = false;
            } else if (word_entry["english_synonyms"][0] !== "" && word_entry["english_description"] !== "") {
                // English word with synonyms and description
                englishValid = true;
                alert("Valid English word entry")
            }
            hindiValid = validateHindiword(word_entry);
            if (englishValid) {
                if (hindiValid) {
                    wordStatus = [true, englishValid, hindiValid];
                } else {
                    wordStatus = [false, englishValid, hindiValid];
                }
            }
            else if (!englishValid) {
                if (hindiValid) {
                    wordStatus = [false, englishValid, hindiValid];
                } else {
                    wordStatus = [false, englishValid, hindiValid];
                }
            }
        }
    }
    return wordStatus;
}



function showAndReviewData(){
    // To be done if required
    // This function will show the data back to user to review before final save. 
}

async function duplicateOrNew(newDictEntry) {
    // This function searches whether entered word already exists in the dictionary
    // This is mandatory before adding stuff
    console.log(newDictEntry)
    const enword = Object.keys(newDictEntry)[0]; // english word in the new entry
    const hnwords = newDictEntry[enword]["hindi_word"]; // hindi word array in the new entry
    console.log(enword, hnwords);
    return new Promise((resolve, reject) => {
        if (jsonData) {
            var result = false;
            // Use the stored JSON data
            for (const [key, value] of Object.entries(jsonData)) {
                console.log(key.toLowerCase(), enword.toLowerCase())
                console.log(value["hindi_word"], hnwords)
                if (key.toLowerCase() === enword.toLowerCase()) {
                    const result = true;
                    console.log(result + ": " + enword + " matched existing key " + key);
                    resolve(result);
                    return;
                } else if ((value["hindi_word"][0] === hnwords[0]) || 
                value["hindi_word"][1] === hnwords[1]) {
                    const result = true;
                    console.log(result + ": " + hnwords + " matched existing hindi word");
                    resolve(result);
                    return;
                } 
            }
            console.log(result + ": " + "No Match");
            resolve(result);  // Resolve with null when no match is found
            return;
        } else {
            console.log("JSON data is not available. Check if it was downloaded when the page loaded first time");
            // Reject the promise as JSON data is not available
            reject(error);
            return;
        }
    });
}


// > functionality #4: add button 

// get buttons and form by ids
const addButton = document.getElementById("addButton");

// set button listeners
addButton.addEventListener('click', () => {
    addData();
});


function updateJson(newEntry) {
    console.log(newEntry);
    fetch('update_json.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(newEntry),
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}


async function addData() {
    var newEntry = collectAddData();
    console.log(newEntry);
    var wordStatus = validateForm(newEntry);
    console.log(wordStatus);
    if (wordStatus[0]) {
        //both English and Hindi words are valid
        const duplicateResult = await duplicateOrNew(newEntry);
        console.log(duplicateResult);
        var enword = Object.keys(newEntry)[0]; // english word in the new entry
        var hnword = newEntry[enword]["hindi_word"][1] // hindi word in the new entry
        if (!duplicateResult) {
            // if data doesn't already exists
            updateJson(newEntry);
        } else {
            alert("Dictinary word " + enword + " and " + hnword + " already exists")
        }
    } else if (wordStatus[1]) {
        // only English word needs to be added
        const duplicateResult = await duplicateOrNew(newEntry);
        console.log(duplicateResult);
        var enword = Object.keys(newEntry)[0]; // english word in the new entry
        if (!duplicateResult) {
            // if data doesn't already exists
            newEntry = {
                [enword]: {
                    "english_description": newEntry[enword]["english_description"],
                    "english_synonyms": newEntry[enword]["english_synonyms"],
                    "hindi_word": [],
                    "hindi_description": "",
                    "hindi_synonyms": ""
                }
            }
            updateJson(newEntry);
        } else {
                alert("Dictinary word " + enword + " already exists");
        }
    } else if (wordStatus[2]) {
        // only Hindi word needs to be added
        const duplicateResult = await duplicateOrNew(newEntry);
        console.log(duplicateResult);
        var enword = Object.keys(newEntry)[0]; // english word in the new entry
        var hnword = newEntry[enword]["hindi_word"][1] // hindi word in the new entry
        if (!duplicateResult) {
            // if data doesn't already exists
            newEntry = {
                [enword]: {
                    "english_description": "",
                    "english_synonyms": "",
                    "hindi_word": newEntry[enword]["hindi_word"],
                    "hindi_description": newEntry[enword]["hindi_description"],
                    "hindi_synonyms": newEntry[enword]["hindi_synonyms"]
                }
            }
            updateJson(newEntry);
        } else {
            alert("Dictinary word " + hnword + " already exists")
        }
    } 
}
