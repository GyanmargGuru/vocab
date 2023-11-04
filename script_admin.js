const dictionaryPath = './data/dictionary.json'; // Assuming dictionary.json is in the same directory as your HTML file

function collectData () {
    const varlist = [];
    var eword = document.getElementById("eword").value;
    var hword = document.getElementById("hword").value;
    var esyn = document.getElementById("esyn").value;
    var hsyn = document.getElementById("hsyn").value;
    var edes = document.getElementById("edes").value;
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

        var word;
        if (localStorage.getItem("data/dictionary.json") == null) {
            word = {};
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