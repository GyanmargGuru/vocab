from indic_transliteration import sanscript

import json
import pprint


def formHindiWord(word): 
    """
    """
    jsonObject = {}
    jsonObject = {
        "englishWord": "",
        "englishDescription": "",
        "englishSynonyms": [
        ],
        "hindiWord": [ 
            word[1], 
            word[0]
        ],
        "hindiDescription": word[2],
        "hindiSynonyms": [
        ]
    }
    return jsonObject


if __name__ == "__main__" :
    jsonFile = {}
    with open("./data/dict.txt") as _f:
        words = _f.readlines()
        hindi_word = []
        for line in words:
            word = line.split(' --- ')[0].strip()
            try:
                word_roman = sanscript.transliterate(word, sanscript.DEVANAGARI, sanscript.ISO)
                definition = line.split(' --- ')[1].strip()
            except:
                word_roman = ""
                definition = ""
            hindi_word = [ word, word_roman, definition ]
            wordDict = formHindiWord(hindi_word)
            jsonFile[word_roman] = wordDict
    with open("./data/dict.json", 'w', encoding='utf-8') as _wf:
        #json.dump(jsonFile, _wf, ensure_ascii=False)
        # write json to file with human-friendly formatting
        pretty_json_str = pprint.pformat(jsonFile, compact=True).replace("'",'"')
        _wf.write(pretty_json_str)
        
        

