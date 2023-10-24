import json

search_word = "Experiencer"

with open ("data/dictionary.json") as f_dict:
    data_dict = json.load(f_dict)

def search(search_word):
    for key, value in data_dict.items():
        if search_word in key:
            return key, value, "key"
        elif search_word in value["hindi_word"]:
            return key, value, "hw"
        elif search_word in value["english_synonyms"]:
            return key, value, "es"
        elif search_word in value["english_synonyms"]:
            return key, value, "hs"
        return 1

res, resv, type = search(search_word);
print(res, resv, type)