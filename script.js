const input = document.querySelector('input');
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-table');
const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file

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
                    resolve(result);
                    return;
                } else if (value["hindi_word"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "hw"];
                    console.log("second", result);
                    resolve(result);
                    return;
                } else if (value["english_synonyms"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "es"];
                    console.log("third", result);
                    resolve(result);
                    return;
                } else if (value["hindi_synonyms"].some(word =>word.toLowerCase() === searchWord)) {
                    const result = [key, value, "hs"];
                    console.log("fourth", result);
                    resolve(result);
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

async function fetchandcreatecolumns(){
    const result = await dictionarysearch(input.value.trim().toLowerCase());
    if (result !== null) {
        // The result is not null
        dictionary.innerHTML = `
            <div class="column_english">
                <div class="word">
                    <span>${result[0]}</span>
                </div>
                <div class="property">English description </div>
                <div class="property">${result[1]["english_description"]}</div>
                <div class="property">English Synonyms </div>
                <div class="property">${result[1]["english_synonyms"].join(", ")}</div>
            </div>

            <div class="column_hindi">
                <div class="word">
                    <span>${result[1]["hindi_word"][1]}</span>
                </div>
                <div class="property">Hindi description </div>
                <div class="property">${result[1]["hindi_description"]}</div>
                <div class="property">Hindi Synonyms </div>
                <div class="property">${result[1]["hindi_synonyms"].join(", ")}</div>  
            </div>
            `;
    } else {
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
}