// > functionality # 1: for update/ deletion, search of word is required so load the json data as 
// soon as the page loads

const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file
//const btn = document.querySelector('button');
//const dictionary = document.querySelector('.dictionary-table');

let jsonData = null; // Initialize dictionary json (entire dictionary) with null

async function dictionaryload() {
    // This function reads the json file and stores the content as json 
    fetch(dictionaryPath) // Fetch the JSON file
        .then(response => response.json()) // Parse the JSON response
        .then(dataDict => {
            jsonData = dataDict; // Store the json data in variable to be searched
        })
        .catch(error => {
            console.error("Error loading the dictionary:", error);
            reject(error);
        });
}

dictionaryload(); // Call the dictionary load function when the page loads. Now it is ready to search words

// > functionality #2: page will only show add or update/ delete button. Depending on 
// what user chooses (add or update/ delete), respective form will show up. 

// get buttons and form by ids
const addcontainer = document.getElementById("addcontainer");
const updelcontainer = document.getElementById("updelcontainer");
const maddbuttonelement = document.getElementById("maddButton");
const mupdelbuttonelement = document.getElementById("mupdelButton");

// set button listeners
maddButton.addEventListener("click", function () {
    addcontainer.classList.remove("hidden");
    maddbuttonelement.classList.add("hidden");
    mupdelbuttonelement.classList.add("hidden");
})

mupdelButton.addEventListener("click", function () {
    updelcontainer.classList.remove("hidden");
    maddbuttonelement.classList.add("hidden");
    mupdelbuttonelement.classList.add("hidden");
})

backButton1.addEventListener("click", function () {
    maddbuttonelement.classList.remove("hidden");
    mupdelbuttonelement.classList.remove("hidden");
    addcontainer.classList.add("hidden");
    updelcontainer.classList.add("hidden");
})

backButton2.addEventListener("click", function () {
    maddbuttonelement.classList.remove("hidden");
    mupdelbuttonelement.classList.remove("hidden");
    addcontainer.classList.add("hidden");
    updelcontainer.classList.add("hidden");
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
    const synResult = capitalizedWords.join(', ');
    return synResult;
}

function collectData () {
    // This function collects data from various sections of the add or update form
    const varlist = [];
    var eword = document.getElementById("eword").value.trim().toSentenceCase();
    var hword = document.getElementById("hword").value;
    var esyn = document.getElementById("esyn").value.capitalizeEachWord();
    var hsyn = document.getElementById("hsyn").value;
    var edes = document.getElementById("edes").value.trim().toSentenceCase();
    var hdes = document.getElementById("hdes").value;
    varlist.push(eword, hword, esyn, hsyn, edes, hdes);
    return varlist;
}

function validateForm(varlist) {
    // This function validates that none of the fields are emtpy
    varlist.forEach(item => {
        if(item == ""){
            alert(item + "is required");
            return false;
        }
    })
}


function showAndReviewData(){
    // To be done if required
    // This function will show the data back to user to review before final save. 
}

async function duplicateOrNew(newDictEntry) {
    // This function searches whether entered word already exists in the dictionary
    // This is mandatory before adding stuff

    var enword = newDictEntry[0] // english word in the new entry
    var hnword = newDictEntry[1] // hindi word in the new entry

    return new Promise((resolve, reject) => {
        if (jsonData) {
            // Use the stored JSON data
            for (const [key, value] of Object.entries(jsonData)) {
                if (key.toLowerCase() === enword) {
                    const result = [key, value, "key"];
                    console.log("first", result);
                    resolve({result_type: "first", result_value: result});
                    return;
                } else if (value["hindi_word"].some(word =>word.toLowerCase() === hnword)) {
                    const result = [key, value, "hw"];
                    console.log("second", result);
                    resolve({result_type: "second", result_value: result});
                    return;
            }
            console.log("No Match");
            resolve(null);  // Resolve with null when no match is found
        }
     } else {
            reject("JSON data is not available. Check if it was downloaded when the page loaded first time"); // Reject the promise as JSON data is not available
        }
    });
}


// > functionality #4: add button 

// get buttons and form by ids
const addbutton = document.getElementById("addButton");

// set button listeners
maddButton.addEventListener("click", function () {
    addcontainer.classList.remove("hidden");
    maddbuttonelement.classList.add("hidden");
    mupdelbuttonelement.classList.add("hidden");
})

addButton.addEventListener('click', () => {
    addData()
});


function addData(){
    var newEntry = collectData()
    if (validateForm(newEntry) === true) {
        //if form has data
        if (duplicateOrNew(newEntry) === null) {
            // if data doesn't already exists
            // create json blob
            var data = { newEntry[0]: {
                "english_description": newEntry[4],
                "english_synonyms": newEntry[2],
                "hindi_word": newEntry[1],
                "hindi_description": newEntry[5], 
                "hindi_synonyms": newEntry[3]
                }
            }
            fetch('save_entry.php', {
                method: 'POST',
                body: JSON.stringify({ data: data })
            })
            .then(response => response.text())
            .then(result => {
                alert(result); // Display the response from the server
            });
        }
    }
}





