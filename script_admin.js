// functionality # 1: for update/ deletion, search of word is required so load the json data as soon as page loads
const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file
//const btn = document.querySelector('button');
//const dictionary = document.querySelector('.dictionary-table');

let jsonData = null; // Initialize with null

async function dictionarydw() {
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

dictionarydw(); // Call the dictionary download function when the page loads

// functionality #2: page will only show add or update/ delete button. Depending on what user chooses, a form will show up. 
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

/*

function toSentenceCase(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}

function capitalizeEachWord(inputString){
    // split the string into array of words
    const synWords = inputString.split(', ');

    // Capitalize the first letter of each word
    const capitalizedWords = synWords.map(word => {
        return toSentenceCase(word);
    });
    const synResult = capitalizedWords.join(', ');
    return synResult;
}

function collectData () {
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
    varlist.forEach(item => {
        if(item == ""){
            alert(item + "is required");
            return false;
        }
    })
}

function showData(){

}

function addData(){
    //if form is validated
    variable_list = collectData()
    if(validateForm(variable_list) == true) {
        var dictWord;
        if (localStorage.getItem("data/dictionary.json") == null) {
            dictWord = {};
        } else {
            word
        }

    }
}

function stringToWords(synonyms){
    // takes string and returns an array
    const synArray = synonyms.split(',').map(sword => sword.trim());
    return wordsArray;
}


addButton.addEventListener('click', () => {
    wordEntry = collectData();
    if(validateForm(wordEntry) == true) {
        if 
        const newWord = {
            wordEntry[0]:{
                "english_description": wordEntry[4],
                "english_synonyms": stringToWords(wordEntry[2]),
                "hindi_word": wordEntry[1],
                "hindi_description": wordEntry[5],
                "hindi_synonyms": stringToWords(wordEntry[3]),
        }
    };
    fetch('')
}
});
*/