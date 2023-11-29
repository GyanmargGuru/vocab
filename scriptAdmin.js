// > functionality # 1: for update/ deletion, search of word is required so load the json data as 
// soon as the page loads
const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file
//const btn = document.querySelector('button');
//const dictionary = document.querySelector('.dictionary-table');

var jsonData = null; // Initialize dictionary json (entire dictionary) with null


async function dictionaryLoad() {
    // This function reads the json file and stores the content as json
    try {
        const response = await fetch(dictionaryPath, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        }) // Fetch the JSON file
            .then(response => response.json())
        jsonData = response; // Parse and store the JSON response
    } catch (error) {
        console.error("Error loading the dictionary:", error);
    }
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


function collectData(form) {
    // This function collects data from sections of the add form
    let newWordArray = [];
    const eword = document.getElementById(`${form}Eword`).value.trim();
    const scEword = toSentenceCase(eword);
    const esyn = document.getElementById(`${form}Esyn`).value;
    const capEsyn = capitalizeEachWord(esyn);
    const edes = document.getElementById(`${form}Edes`).value.trim();
    const scEdes = toSentenceCase(edes);
    const hdword = document.getElementById(`${form}Hdword`).value.trim();
    const hrword = document.getElementById(`${form}Hrword`).value.trim();
    const scHrword = toSentenceCase(hrword);
    const hsyn = document.getElementById(`${form}Hsyn`).value.trim();
    const arrayHsyn = capitalizeEachWord(hsyn);
    const hdes = document.getElementById(`${form}Hdes`).value.trim();
    newWordArray = [scEword, capEsyn, scEdes, [scHrword, hdword], arrayHsyn, hdes];
    return newWordArray;
}


function validateHindiword(newWordArray) {
    // This function validates if Hindi word entry is complete
    var isValid = true;
    if (newWordArray[3][0] !== "") {
        // Roman script Hindi word present. This could be valid entry.
        if (newWordArray[3][1] === "") {
            // No Devnagri script Hindi word. Invalid Entry. 
            alert("Both Devnagri Hindi word and Roman Hindi word is required!");
            isValid = false;
            return isValid;
        } else if (newWordArray[3][1] !== "") {
            // Devngari script Hindi word entered
            // Check for synonyms and description
            if (newWordArray[4] === "" || newWordArray[5] === "") {
                // Hindi word but no synonyms or description
                alert("For Hindi word entry, respective synonyms and description is required!");
                isValid = false;
                return isValid;
            } else if (newWordArray[4] !== "" && newWordArray[5] !== "") {
                // Hindi word with synonyms and description
                alert("Valid Hindi word entry")
                isValid = true;
                return isValid;
            }
        }
    } else if (newWordArray[3][0] === "") {
        // Roman script Hindi word not entered. This is Invalid entry.
        // Checking further to provide correct alert to user. 
        if (newWordArray[3][1] === "") {
            // Devnagri script Hindi word not entered. 
            isValid = false;
            return isValid;
        } else if (newWordArray[3][1] !== "") {
            // Devngari script Hindi word entered.
            alert("Both Devnagri Hindi word and Roman Hindi word is required!");
            isValid = false;
            return isValid;
        }
    }
}


function validateForm(newWordArray) {
    // This function validates the word entry
    var wordStatus = []; // Array contains three boolean values. First is True if both English and Hindi valid words are entered. 
    // Second is True if valid English word is entered. Third is True if valid Hindi word is entered. 
    var hindiValid = validateHindiword(newWordArray);
    if (newWordArray[0] === "") {
        // English word not entered. Check if English synonyms and description are present
        if (newWordArray[1].length < 1 || newWordArray[2] !== "") {
            alert("Use update if you want to add synonyms or update the description of existing English words");
        }
        // Hindi Roman script word must be there for valid entry
        if (hindiValid) {
            // Hindi word with synonyms and description
            wordStatus = [false, false, true];
            return wordStatus;
        } else {
            // Neither English nor Hindi word is valid
            alert("Either English word or Hindi word is required!");
            wordStatus = [false, false, false];
            return wordStatus;
        }
    } else {
        // English word entered.
        if (newWordArray[1] === "" || newWordArray[2] === "") {
            // English word but no synonyms and description
            alert("For English word entry, respective synonyms and description is required!");
            if (hindiValid) {
                // Hindi word with synonyms and description
                wordStatus = [false, false, true];
                return wordStatus;
            } else {
                // Neither English nor Hindi word is valid
                wordStatus = [false, false, false];
                return wordStatus;

            }
        } else if (newWordArray[1] !== "" && newWordArray[2] !== "") {
            // Valid English word with synonyms and description
            alert("Valid English word entry")
            if (hindiValid) {
                // Hindi word with synonyms and description
                wordStatus = [true, true, true];
                return wordStatus;
            } else {
                // Only English word is valid
                wordStatus = [false, true, false];
                return wordStatus;
            }
        }
    }
}


async function duplicateOrNew(newDictEntry) {
    // This function searches whether entered word already exists in the dictionary
    // This is mandatory before adding stuff
    console.log(newDictEntry)
    const enword = Object.keys(newDictEntry)[0]; // english word in the new entry
    const hnwords = newDictEntry[enword]["hindiWord"]; // hindi word array in the new entry
    console.log(enword, hnwords);
    await dictionaryLoad(); // reload dictionary
    return new Promise((resolve, reject) => {
        if (jsonData) {
            var result = false;
            // Use the stored JSON data
            for (const [key, value] of Object.entries(jsonData)) {
                console.log(key.toLowerCase(), enword.toLowerCase())
                console.log(value["hindiWord"], hnwords)
                if (key.toLowerCase() === enword.toLowerCase()) {
                    // There is an English word in Dictionary which matches new Word
                    result = true;
                    console.log(result + ": " + enword + " matched existing key " + key);
                    resolve(result);
                    return;
                } else if ((value["hindiWord"][0] === hnwords[0]) || 
                (value["hindiWord"][1] === hnwords[1])) {
                    result = true;
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


function updateJson(newWord) {
    console.log(newWord);
    fetch('updateJson.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(newWord),
    })
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}


function deleteJson(existingWordKey) {
    console.log(existingWordKey);
    // Assuming you have the key of the object to be deleted
    var keyToDelete = existingWordKey; // Replace with the actual key
    console.log(keyToDelete);
    // Send an AJAX request to the PHP script
    fetch('deleteJson.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'keyToDelete=' + encodeURIComponent(keyToDelete),
    })
        .then(response => response.text())
        .then(result => {
            console.log(result); // Output the result (success or failure)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function formFullWord(newWordArray) {
    let newWordObj = {};
    newWordObj[newWordArray[0]] = {
        "englishWord": newWordArray[0],
        "englishSynonyms": newWordArray[1],
        "englishDescription": newWordArray[2],
        "hindiWord": newWordArray[3],
        "hindiSynonyms": newWordArray[4],
        "hindiDescription": newWordArray[5]
    }
    console.log(newWordObj);
    return newWordObj;
}

async function updateFullWord(newWordObj, indexWordArray) {
    const duplicateResult = await duplicateOrNew(newWordObj);
    console.log(duplicateResult);
    if (!duplicateResult) {
        // if data doesn't already exists
        updateJson(newWordObj);
    } else {
        alert("Dictinary word " + indexWordArray[0] + " or " + indexWordArray[1] + " already exist")
    }
}

function formEnglishWord(newWordArray) {
    let newWordObj = {};
    newWordObj[newWordArray[0]] = {
        "englishWord": newWordArray[0],
        "englishSynonyms": newWordArray[1],
        "englishDescription": newWordArray[2],
        "hindiWord": ["", ""],
        "hindiSynonyms": [],
        "hindiDescription": ""
    }
    console.log(newWordObj);
    return newWordObj;
}

async function updateEnglishWord(newWordObj, indexWordArray) {
    const duplicateResult = await duplicateOrNew(newWordObj);
    console.log(duplicateResult);
    if (!duplicateResult) {
        // if data doesn't already exists
        updateJson(newWordObj);
    } else {
        alert("Dictinary word " + indexWordArray[0] + " already exists");
    }
}

function formHindiWord(newWordArray) {
    let newWordObj = {};
    newWordObj[newWordArray[3][0]] = {
        "englishWord": "",
        "englishSynonyms": [],
        "englishDescription": "",
        "hindiWord": newWordArray[3],
        "hindiSynonyms": newWordArray[4],
        "hindiDescription": newWordArray[5]
    }
    console.log(newWordObj);
    return newWordObj;
}

async function updateHindiWord(newWordObj, indexWordArray) {
    const duplicateResult = await duplicateOrNew(newWordObj);
    console.log(duplicateResult);
    if (!duplicateResult) {
        // if data doesn't already exists
        updateJson(newWordObj);
    } else {
        alert("Dictinary word " + indexWordArray[0] + " already exists")
    }
}


async function addData() {
    await dictionaryLoad(); // Update the dictionary in the browser
    let newWordArray = collectData("add");
    console.log(newWordArray);
    let wordStatus = validateForm(newWordArray);
    console.log(wordStatus);
    let newWordObj = {};
    if (wordStatus[0]) {
        newWordObj = formFullWord(newWordArray);
        updateFullWord(newWordObj, [newWordArray[0], newWordArray[3][0]]);
    } else if (wordStatus[1]) {
        // only English word needs to be added
        newWordObj = formEnglishWord(newWordArray);
        updateEnglishWord(newWordObj, [newWordArray[0]]);
    } else if (wordStatus[2]) {
        // only Hindi word needs to be added
        newWordObj = formHindiWord(newWordArray);
        updateHindiWord(newWordObj, newWordArray[3][0]);
    } 
}


// > functionality #5: update or delete

async function dictionarysearch(searchWord) {
    console.log(searchWord);
    return new Promise((resolve, reject) => {
        if (jsonData) {
            // Use the stored JSON data
            for (const [key, value] of Object.entries(jsonData)) {
                if (key.toLowerCase() === searchWord.toLowerCase()) {
                    const result = [key, value];
                    console.log("English Word", result);
                    resolve({ resultType: "English", resultValue: result });
                    return;
                } else if (value["hindiWord"].some(word => word.toLowerCase() === searchWord.toLowerCase())) {
                    const result = [key, value];
                    console.log("Hindi Word", result);
                    resolve({ resultType: "Hindi", resultValue: result });
                    return;
                } 
            }
            console.log("No Match");
            resolve(null);  // Resolve with null when no match is found
        } else {
            reject("JSON data is not available. Check if it was downloaded when the page loaded first time"); // Reject the promise as JSON data is not available
            return;
        }
    });
}


// get search button for update/ delete
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener('click', () => {
    const searchWord = document.getElementById("searchWord").value.trim();
    searchAndPopulateWord(searchWord);
});


async function searchAndPopulateWord(searchWord) {
    await dictionaryLoad(); // Update the dictionary in the browser
    console.log(searchWord);
    const result = await dictionarysearch(searchWord);
    if (result) {
        console.log(result.resultValue[1]);
        existingWord = result.resultValue[1];
        //document.getElementById("username").value = userData.username;
        document.getElementById("updelEword").value = existingWord.englishWord;
        document.getElementById("updelEsyn").value = existingWord.englishSynonyms;
        document.getElementById("updelEdes").value = existingWord.englishDescription;
        document.getElementById("updelHdword").value = existingWord.hindiWord[1];
        document.getElementById("updelHrword").value = existingWord.hindiWord[0];
        document.getElementById("updelHsyn").value = existingWord.hindiSynonyms;
        document.getElementById("updelHdes").value = existingWord.hindiDescription; 
    }
}

// get buttons and form by ids
const updateButton = document.getElementById("updateButton");

// set button listeners
updateButton.addEventListener('click', () => {
    updateData();
});


async function updateData() {
    let newWordArray = collectData("updel");
    console.log(newWordArray);
    let wordStatus = validateForm(newWordArray);
    console.log(wordStatus);
    let newWordObj = {};
    if (wordStatus[0]) {
        //both English and Hindi words are valid
        newWordObj = formFullWord(newWordArray);
        deleteJson(newWordArray[0]); // delete the word which is to be updated
        jsonData = null;
        updateFullWord(newWordObj, [newWordArray[0], newWordArray[3][0]]);
    } else if (wordStatus[1]) {
        // only English word needs to be added
        newWordObj = formEnglishWord(newWordArray);
        deleteJson(newWordArray[0]); // delete the word which is to be updated
        jsonData = null;
        updateEnglishWord(newWordObj, [newWordArray[0]]);
    } else if (wordStatus[2]) {
        // only Hindi word needs to be added
        newWordObj = formHindiWord(newWordArray);
        deleteJson(newWordArray[3][0]);  // delete the word which is to be updated
        jsonData = null;
        updateHindiWord(newWordObj, newWordArray[3][0]);
    }
}


// get buttons and form by ids
const deleteButton = document.getElementById("deleteButton");

// set button listeners
deleteButton.addEventListener('click', () => {
    deleteData();
});

async function deleteData() {
    var newWordArray = collectData("updel");
    console.log(newWordArray);
    let wordStatus = validateForm(newWordArray);
    console.log(wordStatus);
    if (wordStatus[0] || wordStatus[1]) {
        //both English and Hindi words are valid
        deleteJson(newWordArray[0]); // delete the word which is to be updated
        jsonData = null;
    } else if (wordStatus[2]) {
        deleteJson(newWordArray[3][0]);
        jsonData = null;
    } else {
        alert("Invalid Word!");
        jsonData = null;
    }
    await dictionaryLoad();
}
