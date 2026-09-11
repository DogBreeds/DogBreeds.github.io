"""Extract numeric inputs from downloaded official PDFs converted by pdftotext -layout.

Usage: python scripts/extract-population-inputs.py PATH_TO_TEXT_FILES
Source URLs and manually transcribed historical/Japanese observations are retained
in data/population-inputs.json; this script refreshes the UK/Australia series.
"""
import json
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parents[1]
folder = pathlib.Path(sys.argv[1])

def rows(filename, columns):
    found = {}
    for line in (folder / filename).read_text().splitlines():
        line = re.sub(r'\s+Page \d+\s*$', '', line)
        match = re.match(r'^\s*(\D.*?)\s{2,}((?:[\d,]+\s+){' + str(columns - 1) + r'}[\d,]+)\s*$', line)
        if match and match[1].strip() and 'TOTAL' not in match[1]:
            found[match[1].strip()] = [int(value.replace(',', '')) for value in match[2].split()]
    return found

au, old = rows('au.txt', 8), rows('au-old.txt', 8)
uk = {}
for file in folder.glob('uk-*.txt'):
    uk.update(rows(file.name, 10))

aliases = {
 'brittany': [['Brittany'], ['Brittany']],
 'german-shepherd-dog': [['German Shepherd Dog', 'German Shepherd Dog (LSC)'], ['German Shepherd Dog']],
 'standard-poodle': [['Poodle (Standard)'], ['Poodle (Standard)']],
 'english-cocker-spaniel': [['Cocker Spaniel'], ['Spaniel (Cocker)']],
 'american-cocker-spaniel': [['Cocker Spaniel (American)'], ['Spaniel (American Cocker)']],
 'english-springer-spaniel': [['English Springer Spaniel'], ['Spaniel (English Springer)']],
 'labrador-retriever': [['Labrador Retriever'], ['Retriever (Labrador)']],
 'golden-retriever': [['Golden Retriever'], ['Retriever (Golden)']],
 'miniature-schnauzer': [['Schnauzer (Miniature)'], ['Miniature Schnauzer']],
 'giant-schnauzer': [['Schnauzer (Giant)'], ['Giant Schnauzer']],
 'pembroke-welsh-corgi': [['Welsh Corgi (Pembroke)'], ['Welsh Corgi (Pembroke)']],
 'doberman-pinscher': [['Dobermann'], ['Dobermann']],
 'chihuahua': [['Chihuahua (Long)', 'Chihuahua (Smooth)'], ['Chihuahua (Long Coat)', 'Chihuahua (Smooth Coat)']],
 'dachshund': [[key for key in au if key.startswith('Dachshund')], [key for key in uk if key.startswith('Dachshund')]],
 'bichon-frise': [['Bichon Frise'], ['Bichon Frise']],
 'vizsla': [['Hungarian Vizsla'], ['Hungarian Vizsla']],
 'portuguese-water-dog': [['Portugese Water Dog'], ['Portuguese Water Dog']],
 'great-pyrenees': [['Pyrenean Mountain Dog'], ['Pyrenean Mountain Dog']],
 'collie': [['Collie (Smooth)'], ['Collie (Smooth)']],
 'rough-collie': [['Collie (Rough)'], ['Collie (Rough)']],
 'belgian-malinois': [['Belgian Shepherd (Malin)'], ['Belgian Shepherd Dog (Malinois)']],
 'chesapeake-bay-retriever': [['Chesapeake Bay Retriever'], ['Retriever (Chesapeake Bay)']],
 'flat-coated-retriever': [['Flat Coated Retriever'], ['Retriever (Flat Coated)']],
 'nova-scotia-duck-tolling-retriever': [['Nova Scotia Duck Tolling Ret.'], ['Retriever (Nova Scotia Duck Tolling)']],
 'shiba-inu': [['Shiba Inu'], ['Japanese Shiba Inu']],
 'akita': [['Akita', 'Akita (Japanese)'], ['Akita', 'Japanese Akita Inu']],
 'weimaraner': [['Weimaraner', 'Weimaraner (Longhair)'], ['Weimaraner']],
 'australian-kelpie': [['Australian Kelpie'], []],
}
dogs = json.loads((root / 'dogs.json').read_text())
target = root / 'data/population-inputs.json'
data = json.loads(target.read_text())
series = {}
for dog in dogs:
    if dog.get('variableTraits'):
        continue
    names = aliases.get(dog['id'], [[dog['name']], [dog['name']]])
    series[dog['id']] = {}
    for country, keys in zip(['AU', 'UK'], names):
        if not keys:
            continue
        source = au if country == 'AU' else uk
        for key in keys:
            assert key in source, (dog['id'], country, key)
            # Rabbit dachshund records begin in 2018; omit those absent varieties
            # from the 2016–17 sum, with that coverage difference explicit.
            assert country != 'AU' or key in old or key.startswith('Dachshund Rabbit'), key
        vectors = [(old.get(key, [0] * 8)[-2:] + au[key]) if country == 'AU' else uk[key] for key in keys]
        series[dog['id']][country] = {'labels': keys, 'counts': [sum(values) for values in zip(*vectors)]}

groups = {}
for group, keys in {
 'poodle': ['Poodle (Standard)', 'Poodle (Miniature)', 'Poodle (Toy)'],
 'german-spitz': ['Pomeranian', 'Keeshond', 'German Spitz (Klein)', 'German Spitz (Mittel)'],
}.items():
    groups[group] = {}
    for country in ['AU', 'UK']:
        vectors = [old[key][-2:] + au[key] if country == 'AU' else uk[key] for key in keys]
        groups[group][country] = {'labels': keys, 'counts': [sum(values) for values in zip(*vectors)]}
data['series'] = series
data['groups'] = groups
target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print(f'Extracted {len(series)} breed series; 2016–2025 UK and Australia.')
