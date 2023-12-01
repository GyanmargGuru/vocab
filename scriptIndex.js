const dictionary = document.querySelector('.dictionaryTable');
const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file

var jsonData = null;

async function dictionaryLoad() {
    // This function reads the json file and stores the content as json
    try {
        const response = await fetch(dictionaryPath, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        }) // Fetch the JSON file
        jsonDict = await response.json(); // Parse and store the JSON response in jsonData
        return jsonDict;
    } catch (error) {
        console.error("Error loading the dictionary:", error);
        throw error;
    }
}

async function runOnce() {
    jsonData = await dictionaryLoad();
}

runOnce();


async function dictionarysearch(searchWord) {
    console.log(searchWord);
    return new Promise((resolve, reject) => {
        if (jsonData) {
            // Use the stored JSON data
            for (const [key, value] of Object.entries(jsonData)) {
                if (key.toLowerCase() === searchWord) {
                    const result = [key, value, "key"];
                    console.log("first", result);
                    resolve({resultType: "first", resultValue: result});
                    return;
                } else if (value["hindiWord"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "hw"];
                    console.log("second", result);
                    resolve({resultType: "second", resultValue: result});
                    return;
                } else if (value["englishSynonyms"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "es"];
                    console.log("third", result);
                    resolve({resultType: "third", resultValue: result});
                    return;
                } else if (value["hindiSynonyms"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "hs"];
                    console.log("fourth", result);
                    resolve({resultType: "fourth", resultValue: result});
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


async function keySearch(searchWord) {
    console.log(searchWord);
    foundKeys = [];
    return new Promise((resolve, reject) => {
        if (jsonData) {
            // Use the stored JSON data
            for (const [key, value] of Object.entries(jsonData)) {
                if (key.toLowerCase().includes(searchWord)) {
                    foundKeys.push(key);
                    console.log(key);
                } else if (value["hindiWord"].some(word => word.toLowerCase().includes(searchWord))) {
                    foundKeys.push(word);
                    console.log(word);
                } 
            }
            resolve(foundKeys);  // Resolve with null when no match is found
        } else {
            reject("JSON data is not available. Check if it was downloaded when the page loaded first time"); // Reject the promise as JSON data is not available
            return;
        }
    });
}


// get search button and add function for full word input and click
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener('click', () => {
    const searchWord = document.getElementById("searchWord").value.trim();
    fetchandcreatecolumns(searchWord);
});


function toSentenceCase(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}


async function fetchandcreatecolumns(searchWord) {
    const result = await dictionarysearch(searchWord.toLowerCase());
    if (searchWord === '') {
        // search word is blank
        dictionary.innerHTML = '';
    }
    else if (result === null) {
        // The result is null
        dictionary.innerHTML = `
        <div class="columnEnglish">
            <div class="word">
                <span>"No Match"</span>
            </div>
            <div class="property">English description </div>
            <div class="property">"No matching result found."</div>
            <div class="property">English Synonyms </div>
            <div class="property">"No matching result found."</div>
        </div>
        <div class="columnHindi">
            <div class="word">
                <span>"No Match"</span>
            </div>
            <div class="property">Hindi description </div>
            <div class="property">"No matching result found."</div>
            <div class="property">Hindi Synonyms </div>
            <div class="property">"No matching result found."</div>  
        </div>
        `;
    }
    else if (result.resultValue !== null) {
        // The result is not null
        if (result.resultType === "first") {
            //  if the search result is obtained from the key (which is the english word, not the synonyms)
            dictionary.innerHTML = `
                <div class="columnEnglish">
                    <div class="word">
                        <span>${result.resultValue[0]}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.resultValue[1]["englishDescription"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.resultValue[1]["englishSynonyms"].join(", ")}</div>
                </div>
                <div class="columnHindi">
                    <div class="word">
                        <span>${result.resultValue[1]["hindiWord"][1]}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.resultValue[1]["hindiDescription"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.resultValue[1]["hindiSynonyms"].join(", ")}</div>  
                </div>
                `;
        }
        else if (result.resultType === "second") {
            //  if the search result is obtained from the hindi word, not the synonyms
            dictionary.innerHTML = `
                <div class="columnEnglish">
                    <div class="word">
                        <span>${result.resultValue[0]}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.resultValue[1]["englishDescription"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.resultValue[1]["englishSynonyms"].join(", ")}</div>
                </div>
                <div class="columnHindi">
                    <div class="word">
                        <span>${result.resultValue[1]["hindiWord"][1]}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.resultValue[1]["hindiDescription"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.resultValue[1]["hindiSynonyms"].join(", ")}</div>  
                </div>
                `;

        }
        else if (result.resultType === "third") {
            //  if the search result is obtained from the english synonyms
            dictionary.innerHTML = `
                <div class="columnEnglish">
                    <div class="word">
                        <span>${toSentenceCase(input.value)}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.resultValue[1]["englishDescription"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.resultValue[1]["englishSynonyms"].join(", ") + 
                    ", " + result.resultValue[0]}</div>
                </div>
                <div class="columnHindi">
                    <div class="word">
                        <span>${result.resultValue[1]["hindiWord"][1]}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.resultValue[1]["hindiDescription"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.resultValue[1]["hindiSynonyms"].join(", ")}</div>  
                </div>
                `;
        }
        else if (result.resultType === "fourth") {
            //  if the search result is obtained from hindi
            dictionary.innerHTML = `
                <div class="columnEnglish">
                    <div class="word">
                        <span>${result.resultValue[0]}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.resultValue[1]["englishDescription"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.resultValue[1]["englishSynonyms"].join(", ")}</div>
                </div>
                <div class="columnHindi">
                    <div class="word">
                        <span>${input.value}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.resultValue[1]["hindiDescription"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.resultValue[1]["hindiSynonyms"].join(", ") + 
                    ", " + result.resultValue[1]["hindiWord"][1]}</div>  
                </div>
                `;
        }
    }     
}

// Add functionality for suggestion

async function fetchAndListKeys() {
    document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById("searchWord");
        const suggestionsList = document.getElementById("suggestionsList");

        searchInput.addEventListener('input', async function () {
            const suggestWord = document.getElementById("searchWord").value.trim();

            // Clear previous suggestions
            suggestionsList.innerHTML = '';

            // Show suggestions when at least 3 characters are typed
            if (suggestWord.length >= 3) {
                const mockSuggestions = await keySearch(suggestWord.toLowerCase());
                console.log(mockSuggestions.length, mockSuggestions);
                // Populate the suggestions list
                if (mockSuggestions.length > 0) {
                    mockSuggestions.forEach(function (suggestion) {
                        const li = document.createElement('li');
                        li.textContent = suggestion;
                        // Handle suggestion click
                        li.addEventListener('click', function () {
                            searchInput.value = suggestion;
                            suggestionsList.style.display = 'none';
                        });
                        suggestionsList.appendChild(li);
                    });

                    // Show the suggestions list
                    suggestionsList.style.display = 'block';
                }
            } else {
                suggestionsList.style.display = 'none';
            }
        });
        // Hide suggestions on outside click
        document.addEventListener('click', function (event) {
            if (!searchInput.contains(event.target) && !suggestionsList.contains(event.target)) {
                suggestionsList.style.display = 'none';
            }
        });
    });
}

fetchAndListKeys();