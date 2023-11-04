const input = document.querySelector('input');
const delay = 300; // Adjust the delay in milliseconds (e.g., 300 milliseconds)
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-table');
const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file

let timeout;

async function dictionarysearch(searchWord) {
    console.log(searchWord);
    return new Promise((resolve, reject) => {
        fetch(dictionaryPath) // Fetch the JSON file
        .then(response => response.json()) // Parse the JSON response
        .then(dataDict => {
            for (const [key, value] of Object.entries(dataDict)) {
                if (key.toLowerCase() === searchWord) {
                    const result = [key, value, "key"];
                    console.log("first", result);
                    resolve({result_type: "first", result_value: result});
                    return;
                } else if (value["hindi_word"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "hw"];
                    console.log("second", result);
                    resolve({result_type: "second", result_value: result});
                    return;
                } else if (value["english_synonyms"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "es"];
                    console.log("third", result);
                    resolve({result_type: "third", result_value: result});
                    return;
                } else if (value["hindi_synonyms"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "hs"];
                    console.log("fourth", result);
                    resolve({result_type: "fourth", result_value: result});
                    return;
                }
            }
            console.log("No Match");
            resolve(null);  // Resolve with null when no match is found
        })
        .catch(error => {
            console.error("Error loading the dictionary:", error);
            reject(error);
        });
    });
}

btn.addEventListener('click', fetchandcreatecolumns)

input.addEventListener('input', function() {
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
        <div class="column_english">
            <div class="word">
                <span>${input.value}</span>
            </div>
            <div class="property">English description </div>
            <div class="property">"No matching result found."</div>
            <div class="property">English Synonyms </div>
            <div class="property">"No matching result found."</div>
        </div>
        <div class="column_hindi">
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
    else if (result.result_value !== null) {
        // The result is not null
        if (result.result_type === "first") {
            //  if the search result is obtained from the key (which is the english word, not the synonyms)
            dictionary.innerHTML = `
                <div class="column_english">
                    <div class="word">
                        <span>${result.result_value[0]}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.result_value[1]["english_description"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.result_value[1]["english_synonyms"].join(", ")}</div>
                </div>
                <div class="column_hindi">
                    <div class="word">
                        <span>${result.result_value[1]["hindi_word"][1]}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.result_value[1]["hindi_description"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.result_value[1]["hindi_synonyms"].join(", ")}</div>  
                </div>
                `;
        }
        else if (result.result_type === "second") {
            //  if the search result is obtained from the hindi word, not the synonyms
            dictionary.innerHTML = `
                <div class="column_english">
                    <div class="word">
                        <span>${result.result_value[0]}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.result_value[1]["english_description"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.result_value[1]["english_synonyms"].join(", ")}</div>
                </div>
                <div class="column_hindi">
                    <div class="word">
                        <span>${result.result_value[1]["hindi_word"][1]}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.result_value[1]["hindi_description"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.result_value[1]["hindi_synonyms"].join(", ")}</div>  
                </div>
                `;

        }
        else if (result.result_type === "third") {
            //  if the search result is obtained from the english synonyms
            dictionary.innerHTML = `
                <div class="column_english">
                    <div class="word">
                        <span>${toSentenceCase(input.value)}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.result_value[1]["english_description"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.result_value[1]["english_synonyms"].join(", ") + 
                    ", " + result.result_value[0]}</div>
                </div>
                <div class="column_hindi">
                    <div class="word">
                        <span>${result.result_value[1]["hindi_word"][1]}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.result_value[1]["hindi_description"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.result_value[1]["hindi_synonyms"].join(", ")}</div>  
                </div>
                `;
        }
        else if (result.result_type === "fourth") {
            //  if the search result is obtained from hindi
            dictionary.innerHTML = `
                <div class="column_english">
                    <div class="word">
                        <span>${result.result_value[0]}</span>
                    </div>
                    <div class="property">English description </div>
                    <div class="property">${result.result_value[1]["english_description"]}</div>
                    <div class="property">English Synonyms </div>
                    <div class="property">${result.result_value[1]["english_synonyms"].join(", ")}</div>
                </div>
                <div class="column_hindi">
                    <div class="word">
                        <span>${input.value}</span>
                    </div>
                    <div class="property">Hindi description </div>
                    <div class="property">${result.result_value[1]["hindi_description"]}</div>
                    <div class="property">Hindi Synonyms </div>
                    <div class="property">${result.result_value[1]["hindi_synonyms"].join(", ") + 
                    ", " + result.result_value[1]["hindi_word"][1]}</div>  
                </div>
                `;
        }
    }     
}