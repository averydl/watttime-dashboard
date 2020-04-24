"""
Run this file to create a key value pair map (dict) for the chinese strings to be translated.
    this file will create a json, that we can use as a cached translation dictionary,
    which will reduce the amount of API calls needed to translate.
"""


import googletrans
from googletrans import Translator
import requests
import json
import math

URL = 'http://data.taipower.com.tw/opendata01/apply/file/d006001/001.txt'

translator = Translator()

response = requests.get(URL)
raw_data = response.content.decode('utf-8')
raw_dict = json.loads(raw_data)

powerTypes = []
unitNames = []
deviceCapacities = []
netPowerGenerations = []
generationPerDeviceCapacityRatios = []
comments = []

translationDict = {}
transltionKeySet = set()
translationKeyList = []


for entry in raw_dict['aaData']:
    powerTypes.append(entry[0])
    unitNames.append(entry[1])
    comments.append(entry[5])

for powerType in powerTypes:
    if powerType != '':
        transltionKeySet.add(powerType)
for unitName in unitNames:
    if unitName != '':
        transltionKeySet.add(unitName)
for comment in comments:
    if comment != '':
        transltionKeySet.add(comment)
for tranlsationKey in transltionKeySet:
    translationKeyList.append(tranlsationKey)

translatedList = translator.translate(translationKeyList)

for tanslatedObject in translatedList:
    chineseKey = tanslatedObject.origin
    englishValue = tanslatedObject.text
    translationDict[chineseKey] = englishValue

with open('chineseEnglishDictionary.txt', 'w') as outfile:
    json.dump(translationDict, outfile)

print('not yet done')

print('done')


