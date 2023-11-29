const input = document.querySelector('input');
const delay = 300; // Adjust the delay in milliseconds (e.g., 300 milliseconds)
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-table');
const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file


async function dictionaryLoad() {
    // This function reads the json file and stores the content as json
    try {
        const response = await fetch(dictionaryPath, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        }) // Fetch the JSON file
        const jsonData = await response.json(); // Parse and store the JSON response in jsonData
        return jsonData;
    } catch (error) {
        console.error("Error loading the dictionary:", error);
        throw error;
    }
}


async function dictionarysearch(searchWord) {
    let jsonData = await dictionaryLoad();
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


btn.addEventListener('click', fetchandcreatecolumns())

input.addEventListener('input', function () {
    let timeout;
    clearTimeout(timeout); // clear previous timer (if any)
    timeout = setTimeout(function() {
        // Perform search
        fetchandcreatecolumns();
    }, delay);
});


function toSentenceCase(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}


async function fetchandcreatecolumns(){
    const result = await dictionarysearch(input.value.trim().toLowerCase());
    if (input.value.trim() === '') {
        // search word is blank
        dictionary.innerHTML = '';
    }
    else if (result === null) {
        // The result is null
        dictionary.innerHTML = `
        <div class="columnEnglish">
            <div class="word">
                <span>${input.value}</span>
            </div>
            <div class="property">English description </div>
            <div class="property">"No matching result found."</div>
            <div class="property">English Synonyms </div>
            <div class="property">"No matching result found."</div>
        </div>
        <div class="columnHindi">
            <div class="word">
                <span>${input.value}</span>
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