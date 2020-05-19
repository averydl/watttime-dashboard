import requests
from os import path, environ
import json
from dateutil.parser import parse
import pandas as pd
import re
import ipdb
import datetime


BA_LIST = [
    'YAD', 'AZPS', 'DEAA', 'AECI', 'AVRN',
    'AVA', 'BANC', 'BPAT', 'CISO', 'HST',
    'TPWR', 'TAL', 'DUK', 'FPC', 'CPLE',
    'CPLW', 'EPE', 'EEI', 'ERCO', 'FMPP',
    'FPL', 'GVL', 'GLHB', 'GRID', 'GRIF',
    'ISNE', 'IPCO', 'IID', 'JEA', 'LDWP',
    'LGEE', 'MISO', 'GWA', 'WWA', 'NEVP',
    'HGMA', 'NYIS', 'NWMT', 'OVEC', 'PJM',
    'DOPD', 'PACE', 'PACW', 'PGE', 'AEC',
    'PSCO', 'PNM', 'CHPD', 'GCPD', 'PSEI',
    'SRP', 'SCL', 'SEC', 'SCEG', 'SC',
    'SEPA', 'SOCO', 'SWPP', 'SPA', 'TEC',
    'TVA', 'TEPC', 'TIDC', 'NSB', 'WALC',
    'WACM', 'WAUW'
]

FOSSIL_FUELS = ['coal', 'natural gas', 'other', 'petroleum']
NON_FOSSIL_FUELS = ['hydro', 'nuclear', 'solar', 'wind']
RENEWABLES = ['solar', 'wind']

CATEGORY_IDS = {
        'generation': 3390101,
        'interchange': 2123637,
        'load': 2122628
}

CATEGORY_URL = 'http://api.eia.gov/category/?api_key={}&category_id={}'
SERIES_URL = 'http://api.eia.gov/series/?api_key={}&series_id={}'

API_KEY = environ['API_KEY']
CUR_DIR = path.abspath(__file__)
TEMPFILE = path.join(CUR_DIR, 'temp.csv')


def get_api_data(ba, category, name_func):
    category_id = CATEGORY_IDS.get(category)
    if not category_id:
        print(f'Category {category} is not supported')
        return None

    series_ids = get_series_ids(ba, category_id, name_func)
    df = pd.DataFrame(columns=['ts'])

    for series_id, name in series_ids.items():
        print(f'getting {category} from {name}')
        url = SERIES_URL.format(API_KEY, series_id)
        success, err, series_df = get_url_data(url, name)
        if success:
            df = df.merge(series_df, on='ts', how='outer')

    df['ts'] = df['ts'].apply(parse)
    df.set_index('ts', inplace=True)
    return df


def _load_name(name):
    return 'load'


def _gen_name(name):
    return name.split('Net generation from ')[1].split(' for')[0]


def get_series_ids(ba_code, cat_id, name_func):
    # ba_code = ABBREV_TO_CODE[abbrev]
    url = CATEGORY_URL.format(API_KEY, cat_id)

    success, err, data = get_url_data(url, raw=True)
    data = json.loads(data)['category']['childcategories']
    for cat_data in data:
        if f'({ba_code})' in cat_data['name']:
            ba_cat = cat_data['category_id']
            break

    url = CATEGORY_URL.format(API_KEY, ba_cat)
    success, err, data = get_url_data(url, raw=True)
    data = json.loads(data)['category']['childseries']
    series_ids = {}
    for cat_data in data:
        if 'UTC' in cat_data['name']:
            name = name_func(cat_data['name'])
            series_ids[cat_data['series_id']] = name
    return series_ids


def get_url_data(url, col_name=None, raw=False):
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
        print('Error getting EIA data: {}, {}, {}'.format(
            e, code, data))
        ipdb.set_trace()
        return False, 'Error getting data', None

    return True, None, data


def total_gen(x):
    return sum([x[col] for col in x.index if col not in ['load', 'ts_x']])


def make_dataframe(load, fuel):
    load_fuel = fuel.join(load, on='ts')
    load_fuel.fillna(0, inplace=True)
    load_fuel['total_gen'] = load_fuel.apply(total_gen, axis=1)
    return load_fuel


def get_raw_data(ba, start, end):
    if ba not in BA_LIST:
        print(f'Balancing Authority {ba} is not supported/does not exist')
        return

    load = get_api_data(ba, 'load', _load_name)
    fuel = get_api_data(ba, 'generation', _gen_name)
    data = make_dataframe(load, fuel)
    data = data.reset_index()
    date_range = data['ts'].between(start, end, inclusive=True)
    data = data[date_range]
    data.set_index('ts', inplace=True)
    return data


def get_derived_data(data):
    fossil_fuels = [fuel for fuel in data.keys() if fuel in FOSSIL_FUELS]
    carbon_free = [fuel for fuel in data.keys() if fuel in NON_FOSSIL_FUELS]
    renewables = [fuel for fuel in data.keys() if fuel in RENEWABLES]

    result = pd.DataFrame()
    # chart 1 information
    result['load'] = data['load']
    result['fossil'] = data[fossil_fuels].sum(axis=1)
    result['carbon_free'] = data[carbon_free].sum(axis=1)

    # chart 2 information
    result['change_fossil'] = result['fossil'].pct_change()
    result['change_carbon_free'] = result['carbon_free'].pct_change()
    result['change_renewables'] = data[renewables].sum(axis=1).pct_change()

    return result


def get_data(ba, start, end):
    raw_data = get_raw_data(ba, start, end)
    result = get_derived_data(raw_data)
    return result

# TODO: Add unittest module & improve testing/cover more test cases
# start = parse('2020-05-01 00:00:00+00:00')
# end = parse('2020-05-1 23:00:00+00:00')

# data = get_raw_data('CISO', start, end)
# table_data = get_derived_data(data)

# print(data)
# print(table_data)
# print(table_data.to_json())
