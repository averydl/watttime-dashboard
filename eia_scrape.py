import requests
from os import path, environ
import json
from dateutil.parser import parse
import pandas as pd
import re
import datetime
import config
import logging

class EIAScraper:
    def __init__(self, logger):
        self.key = config.API_KEY
        self.log = logger
        self.cachelog = {}

    def get_api_data(self, ba, category, name_func):
        self.log.info(f'Fetching category IDs for BA {ba}')
        category_id = config.CATEGORY_IDS.get(category)
        if not category_id:
            self.log.warning(f'Category {category} is not supported')
            return None

        series_ids = self.get_series_ids(ba, category_id, name_func)
        if not series_ids:
            self.log.warning(f'Could not find series for category {category_id} for ba {ba}')
            return None

        df = pd.DataFrame(columns=['ts'])

        for series_id, name in series_ids.items():
            self.log.info(f'getting {category} from {name}')
            url = config.SERIES_URL.format(self.key, series_id)
            data = self.get_url_data(url, name)

            if data is not None:
                df = df.merge(data, on='ts', how='outer')
            else:
                self.log.warning(f'Failed to fetch series {name} for {ba}')

        df['ts'] = df['ts'].apply(parse)
        df.set_index('ts', inplace=True)
        return df


    def _load_name(self, name):
        return 'load'


    def _gen_name(self, name):
        return name.split('Net generation from ')[1].split(' for')[0]


    def get_series_ids(self, ba_code, cat_id, name_func):
        url = config.CATEGORY_URL.format(self.key, cat_id)
        ba_cat = None

        data = self.get_url_data(url, raw=True)
        data = json.loads(data)['category']['childcategories']
        for cat_data in data:
            if f'({ba_code})' in cat_data['name']:
                ba_cat = cat_data['category_id']
                self.log.info(f'Found category ID {ba_cat} for {ba_code}')
                break

        if not ba_cat:
            self.log.warning(f'Failed to find category ID for {ba_code}')
            return None

        url = config.CATEGORY_URL.format(self.key, ba_cat)
        data = self.get_url_data(url, raw=True)
        data = json.loads(data)['category']['childseries']
        series_ids = {}
        for cat_data in data:
            if 'UTC' in cat_data['name']:
                name = name_func(cat_data['name'])
                series_ids[cat_data['series_id']] = name
        return series_ids


    def get_url_data(self, url, col_name=None, raw=False):
        code = None
        data = None
        try:
            response = requests.get(url, timeout=60)
            data = response.text
            code = response.status_code
            if not raw:
                data = response.json()['series']
                df = pd.DataFrame()
                for series in data:
                    _df = pd.DataFrame(series['data'], columns=['ts', col_name])
                    data = pd.concat([_df, df])
        except BaseException as e:
            self.log.error(f'Error getting EIA data: {e}, {code}, {data}')
            return None

        return data

    def get_raw_data(self, ba):
        if ba not in config.BA_LIST:
            self.log.warning(f'Balancing Authority {ba} is not supported/does not exist')
            return None

        self.log.info('Fetching load data from EIA')
        load = self.get_api_data(ba, 'load', self._load_name)
        self.log.info('Fetching generation data from EIA')
        fuel = self.get_api_data(ba, 'generation', self._gen_name)

        if fuel is None:
            self.log.warning('BA did not return required generation data')
            data = None
        elif load is None:
            self.log.warning('BA did not return any load data')
            data = fuel
        else:
            fuel.join(load, on='ts')
            data = fuel

        return data


    def get_derived_data(self, data, start, end):
        data = data.reset_index()
        date_range = data['ts'].between(start, end, inclusive=True)
        data = data[date_range].sort_values(by='ts')
        data.set_index('ts', inplace=True)

        fossil_fuels = [fuel for fuel in data.keys() if fuel in config.FOSSIL_FUELS]
        carbon_free = [fuel for fuel in data.keys() if fuel in config.NON_FOSSIL_FUELS]
        renewables = [fuel for fuel in data.keys() if fuel in config.RENEWABLES]
        total = list(set(fossil_fuels + carbon_free + renewables))

        result = pd.DataFrame()
        columns = data.columns
        # chart 1 information
        if 'load' in columns:
            result['load'] = data['load']
        else:
            result['load'] = 0

        result['generation'] = data[total].sum(axis=1)
        result['fossil'] = data[fossil_fuels].sum(axis=1)
        result['carbon_free'] = data[carbon_free].sum(axis=1)
        result['renewables'] = data[renewables].sum(axis=1)

        # chart 2 information
        result['change_fossil'] = result['fossil'].diff().div(result['generation'].diff()).mul(100).round(2)
        result['change_carbon_free'] = result['carbon_free'].diff().div(result['generation'].diff()).mul(100).round(2)
        result['change_renewables'] = result['renewables'].diff().div(result['generation'].diff()).mul(100).round(2)

        result.fillna(0, inplace=True)
        return result


    def get_data(self, ba, start, end):
        if self.is_cached(ba):
            raw_data = self.uncache(ba)
        else:
            raw_data = self.get_raw_data(ba)
            self.cache(ba, raw_data)

        if raw_data is None:
            return None
        result = self.get_derived_data(raw_data, start, end)
        return result


    def cache(self, ba, data):
        self.cachelog[ba] = datetime.datetime.now()
        data.to_pickle(f'cache/{ba}.pkl')


    def uncache(self, ba):
        try:
            data = pd.read_pickle(f'cache/{ba}.pkl')
            return data
        except Exception as e:
            self.log.info(f'Could not read cache data for {ba}: {e}')
            return None

    def is_cached(self, ba):
        if ba not in self.cachelog:
            self.log.info(f'No data has been cached for {ba}')
            return False
        elif (datetime.datetime.now() - self.cachelog[ba]).seconds > 300:
            self.log.info(f'Cached data for {ba} has expired')
            return False
        else:
            self.log.info(f'Data is cached for {ba}')
            return True


# TODO: Add unittest module & improve testing/cover more test cases
# start = parse('2020-05-01 00:00:00+00:00')
# end = parse('2020-05-1 23:00:00+00:00')
# client = EIAScraper(logging.getLogger(__name__))
# logging.basicConfig()
# data = client.get_data('CISO', start, end)
# print(data)

