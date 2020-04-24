import googletrans
from googletrans import Translator
import requests
import logging
import pytz
import json
import datetime
from dateutil import parser
import math
import pandas
import io
import os
from urllib3.exceptions import HTTPError

"""
    This class gets the real time data for Taiwan, and translates it.
    
    We use a local dictionary for pre-translated chinese characters. This reduces the need 
    to reach out to the translation API as often.
"""

# TODO: add get historical data method.
# TODO: add method to update the local tranlsation dictionary file, each time we translate a new thing.
# TODO: remove print statements.
# TODO: make unit test.
# TODO: consider using beautiful soup, to extract the URL for real time data. It may change.

REAL_TIME_DATA_URL = 'http://data.taipower.com.tw/opendata01/apply/file/d006001/001.txt'
TZ = pytz.timezone('Asia/Shanghai')
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'
translator = Translator()



class taiwan:
    def __init__(self, log):
        self.log = log
        self.tz = TZ
        self.localTranslationDict = {}
        self.raw_dictionary_response = {}


    def percentOfCapacityGenerated(self, capacity, produced):
        try:
            if math.isnan(float(capacity)) or math.isnan(float(produced)):
                return "N/A"
        except ValueError as e:
            print(e, 'could not convert value to float')
        else:
            percent = float(produced)/float(capacity)
            formattedPercent = str(round(percent * 100, 3)) + '%'
            return formattedPercent


    def splitBracketFromString(self, inputString):
        return inputString.split('(')[0]


    def _loadLocalTranslationDict(self):
        with open('chineseEnglishDictionary.txt') as json_file:
            self.localTranslationDict = json.load(json_file)


    def _make_chinese_dataframe(self, dataIn):
        powerTypes = []
        unitNames = []
        deviceCapacities = []
        netPowerGenerations = []
        generationPerDeviceCapacityRatios = []
        comments = []
        dateTimeTaiwan = parser.parse(dataIn[''])
        for entry in dataIn['aaData']:
            powerTypes.append(entry[0])
            unitNames.append(entry[1])
            if "(" in entry[2] or "(" in entry[3] or "%" not in entry[4]:
                cleanCapacity = self.splitBracketFromString(entry[2])
                cleanGeneration = self.splitBracketFromString(entry[3])
                cleanPercent = self.percentOfCapacityGenerated(cleanCapacity, cleanGeneration)
                deviceCapacities.append(cleanCapacity)
                netPowerGenerations.append(cleanGeneration)
                generationPerDeviceCapacityRatios.append(cleanPercent)
            else:
                deviceCapacities.append(entry[2])
                netPowerGenerations.append(entry[3])
                generationPerDeviceCapacityRatios.append(entry[4])
            comments.append(entry[5])

        columns = ['Power Type', 'Unit Name', 'Power Capacity', 'Net Power Generated', 'Ratio Generated',
                   'Time Reported (Taiwan CST)']
        dataChinese = {columns[0]: powerTypes,
                       columns[1]: unitNames,
                       columns[2]: deviceCapacities,
                       columns[3]: netPowerGenerations,
                       columns[4]: generationPerDeviceCapacityRatios,
                       columns[5]: [dateTimeTaiwan] * len(powerTypes)}
        dataFrameChinese = pandas.DataFrame(data=dataChinese)
        print(dataFrameChinese.head())
        return dataFrameChinese

    def _make_local_translation_dict_file(self):
        powerTypes = []
        unitNames = []
        deviceCapacities = []
        netPowerGenerations = []
        generationPerDeviceCapacityRatios = []
        comments = []
        translationDict = {}
        transltionKeySet = set()
        translationKeyList = []
        for entry in self.raw_dictionary_response['aaData']:
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

    def _make_english_dataframe(self, dataIn):
        if len(self.localTranslationDict.keys()) <= 0:
            if os.path.isfile('chineseEnglishDictionary.txt'):
                self._loadLocalTranslationDict()
            else:
                self._make_local_translation_dict_file()
                self._loadLocalTranslationDict()
        englishRowsList = []
        columns = ['Power Type', 'Unit Name', 'Power Capacity', 'Net Power Generated', 'Ratio Generated',
                   'Time Reported (Taiwan CST)']
        for index, row in dataIn.iterrows():
            powType_CH = row['Power Type']
            name_CH = row['Unit Name']
            powerTypeEnglish = self.localTranslationDict[powType_CH] if powType_CH in self.localTranslationDict else translator.translate(powType_CH).text
            unitNameEnglish = self.localTranslationDict[name_CH] if name_CH in self.localTranslationDict else translator.translate(name_CH).text
            englishRowsList.append({columns[0]: powerTypeEnglish,
                                    columns[1]: unitNameEnglish,
                                    columns[2]: row['Power Capacity'],
                                    columns[3]: row['Net Power Generated'],
                                    columns[4]: row['Ratio Generated'],
                                    columns[5]: row['Time Reported (Taiwan CST)']})

        dataFrameEnglish = pandas.DataFrame(data=englishRowsList, columns=columns)
        print(dataFrameEnglish.head())
        return dataFrameEnglish


    def _json_to_dataframe(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            raw_data = response.content.decode('utf-8')
            self.raw_dictionary_response = json.loads(raw_data)
            dateTimeTaiwan = parser.parse(self.raw_dictionary_response[''])
            dataChinese = self._make_chinese_dataframe(self.raw_dictionary_response)
            data = self._make_english_dataframe(dataChinese)
            data['Measured At'] = pandas.to_datetime(
                dateTimeTaiwan,
                format=DATE_FORMAT
            )
            data['Measured At'] = data['Measured At'].dt.tz_localize(self.tz)
        except HTTPError as he:
            self.log.error('HTTP error fetching data from {}: {}'.format(url, he))
            return None
        except Exception as e:
            self.log.error('Error processing json data: {}'.format(e))
        else:
            return data


    def _create_datapoint_dict(self, df):
        data = []
        for index, row in df.iterrows():
            try:
                date = row['Measured At'].to_pydatetime()
                value = float(row['Net Power Generated'])
                unitName = row['Unit Name']
                powerType = row['Power Type']
                if unitName != 'subtotal':
                    data.append({'ts': date, 'value': value, 'name': unitName, 'type': powerType, 'ba': 'Taiwan'})
            except BaseException as e:
                self.log.error('Error creating datapoint: {} '.format(e))
                continue
        return data


    def get_realtime_load_data(self):
        data = self._json_to_dataframe(REAL_TIME_DATA_URL)
        if data is not None:
            data = self._create_datapoint_dict(data)
            return data
        else:
            return None





if __name__ == '__main__':
    logger = logging.getLogger(__name__)
    client = taiwan(logger)
    data = client.get_realtime_load_data()
    print(data)


