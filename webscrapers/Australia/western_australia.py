import logging
import requests
import pandas
import pytz
import unittest
from datetime import datetime, timedelta
from urllib3.exceptions import HTTPError
import io

LOAD_DATA_URL = 'http://data.wa.aemo.com.au/datafiles/operational-measurements/operational-measurements-{}.csv'
TZ = pytz.timezone('Australia/West')
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'


class western_australia:
    def __init__(self, log):
        self.log = log
        self.tz = TZ


    def _create_datapoint_dict(self, df):
        data = []
        for index, row in df.iterrows():
            try:
                date = row['Measured At'].to_pydatetime()
                value = float(row['Total Generation (MW)'])
                data.append({'ts': date, 'value': value, 'ba': 'AEMO'})
            except BaseException as e:
                self.log.error('Error creating datapoint: {} '.format(e))
                continue
        return data

    def _csv_to_dataframe(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            raw_data = response.content.decode('utf-8')
            data = pandas.read_csv(io.StringIO(raw_data))
            data['Measured At'] = pandas.to_datetime(
                data['Measured At'],
                format=DATE_FORMAT
            )
            data['Measured At'] = data['Measured At'].dt.tz_localize(self.tz)
        except HTTPError as he:
            self.log.error('HTTP error fetching data from {}: {}'.format(url, h))
            return None
        except Exception as e:
            self.log.error('Error processing CSV data: {}'.format(e))
        else:
            return data

    def _drop_unwanted_dates(self, df, start, end):
        date_series = df['Measured At'].between(start, end, inclusive=True)
        return df[date_series]

    def get_historical_load_data(self, start, end):
        df = []
        for year in range(start.year, end.year + 1):
            url = LOAD_DATA_URL.format(year)
            data = self._csv_to_dataframe(url)
            if data is not None:
                df.append(data)
        df = pandas.concat(df)
        df = df.reset_index(drop=True)
        df = self._drop_unwanted_dates(df, start, end)
        return self._create_datapoint_dict(df)

    def get_realtime_load_data(self):
        rt_url = LOAD_DATA_URL.format(datetime.now().year)
        data = self._csv_to_dataframe(rt_url)
        if data is not None:
            data = self._create_datapoint_dict(data)
            return data
        else:
            return None

class TestWesternAustralia(unittest.TestCase):
    def setUp(self):
        self.logger = logging.getLogger(__name__)
        self.client = western_australia(self.logger)
        self.date = TZ.fromutc(datetime.utcnow())  # current time in west Aus.

    def test_get_realtime_load_data(self):
        data = self.client.get_realtime_load_data()
        self.assertTrue(data is not None)
        self.assertTrue(type(data) is list)
        self.assertTrue(type(data[0]) is dict)
        self.assertTrue(data[-1]['ts'] + timedelta(days=1) > self.date) # true if data is within one hour of current

    def test_get_historical_load_data(self):
        start = TZ.localize(datetime(2017, 1, 1, 9))
        end = TZ.localize(datetime(2017, 1, 1, 12))
        data = self.client.get_historical_load_data(start, end)
        data0 = data[0]
        time0utc = data0["ts"]
        local_tz = pytz.timezone('Australia/West')
        local_dt = time0utc.replace(tzinfo=pytz.utc).astimezone(local_tz)
        time0ausWest = local_tz.normalize(local_dt)
        timeGap = time0ausWest - time0utc
        self.assertTrue(timeGap == timedelta(hours=8))

if __name__ == '__main__':
    unittest.main()
