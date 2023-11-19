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
    let newWordArray = [];
    const eword = document.getElementById("addEword").value.trim();
    const scEword = toSentenceCase(eword);
    const esyn = document.getElementById("addEsyn").value;
    const capEsyn = capitalizeEachWord(esyn);
    const edes = document.getElementById("addEdes").value.trim();
    const scEdes = toSentenceCase(edes);
    const hdword = document.getElementById("addHdword").value.trim();
    const hrword = document.getElementById("addHrword").value.trim();
    const scHrword = toSentenceCase(hrword);
    const hsyn = document.getElementById("addHsyn").value.trim();
    const arrayHsyn = capitalizeEachWord(hsyn);
    const hdes = document.getElementById("addHdes").value.trim();
    newWordArray = [scEword, capEsyn, scEdes, [scHrword, hdword], arrayHsyn, hdes];
    return newWordArray;
}


function collectUpdateData() {
    // This function collects data from constious sections of the add or update form
    let newWordArray = [];
    const eword = document.getElementById("updelEword").value.trim();
    const scEword = toSentenceCase(eword);
    const esyn = document.getElementById("updelEsyn").value;
    const capEsyn = capitalizeEachWord(esyn);
    const edes = document.getElementById("updelEdes").value.trim();
    const scEdes = toSentenceCase(edes);
    const hdword = document.getElementById("updelHdword").value.trim();
    const hrword = document.getElementById("updelHrword").value.trim();
    const scHrword = toSentenceCase(hrword);
    const hsyn = document.getElementById("updelHsyn").value.trim();
    const arrayHsyn = capitalizeEachWord(hsyn);
    const hdes = document.getElementById("updelHdes").value.trim();
    newWordArray = [scEword, capEsyn, scEdes, [scHrword, hdword], arrayHsyn, hdes]
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


function showAndReviewData(){
    // To be done if required
    // This function will show the data back to user to review before final save. 
}


async function duplicateOrNew(newDictEntry) {
    // This function searches whether entered word already exists in the dictionary
    // This is mandatory before adding stuff
    console.log(newDictEntry)
    const enword = Object.keys(newDictEntry)[0]; // english word in the new entry
    const hnwords = newDictEntry[enword]["hindiWord"]; // hindi word array in the new entry
    console.log(enword, hnwords);
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
        .then(data => {
            alert(data);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}


async function addData() {
    dictionaryLoad(); // Update the dictionary in the browser
    var newWordArray = collectAddData();
    console.log(newWordArray);
    var wordStatus = validateForm(newWordArray);
    console.log(wordStatus);
    var newWordObj = {};
    if (wordStatus[0]) {
        //both English and Hindi words are valid
        newWordObj[newWordArray[0]] = {
            "englishWord": newWordArray[0],
            "englishSynonyms": newWordArray[1],
            "englishDescription": newWordArray[2],
            "hindiWord": newWordArray[3],
            "hindiSynonyms": newWordArray[4],
            "hindiDescription": newWordArray[5]
        }
        console.log(newWordObj);
        const duplicateResult = await duplicateOrNew(newWordObj);
        console.log(duplicateResult);
        if (!duplicateResult) {
            // if data doesn't already exists
            updateJson(newWordObj);
        } else {
            alert("Dictinary word " + newWordArray[0] + " or " + newWordArray[3][0] + " already exist")
        }
    } else if (wordStatus[1]) {
        // only English word needs to be added
        newWordObj[newWordArray[0]] = {
            "englishWord": newWordArray[0],
            "englishSynonyms": newWordArray[1],
            "englishDescription": newWordArray[2],
            "hindiWord": ["", ""],
            "hindiSynonyms": [],
            "hindiDescription": ""
        }
        console.log(newWordObj);
        const duplicateResult = await duplicateOrNew(newWordObj);
        console.log(duplicateResult);
        if (!duplicateResult) {
            // if data doesn't already exists
            updateJson(newWordObj);
        } else {
            alert("Dictinary word " + newWordArray[0] + " already exists");
        }
    } else if (wordStatus[2]) {
        // only Hindi word needs to be added
        newWordObj[newWordArray[3][0]] = {
            "englishWord": "",
            "englishSynonyms": [],
            "englishDescription": "",
            "hindiWord": newWordArray[3],
            "hindiSynonyms": newWordArray[4],
            "hindiDescription": newWordArray[5]
        }
        console.log(newWordObj);
        const duplicateResult = await duplicateOrNew(newWordObj);
        console.log(duplicateResult);
        if (!duplicateResult) {
            // if data doesn't already exists
            updateJson(newWordObj);
        } else {
            alert("Dictinary word " + newWordArray[3][0] + " already exists")
        }
    } 
}
