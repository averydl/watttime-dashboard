import logging
import requests
import pandas
import pytz
import unittest
from datetime import datetime, timedelta
from dateutil.parser import parse

RT_LOAD_URL = 'https://www.bchydro.com/content/dam/BCHydro/customer-portal/documents/corporate/suppliers/transmission-system/balancing_authority_load_data/HourlyBALoad.xls'  # noqa
HIST_LOAD_DATA_URL = 'https://www.bchydro.com/content/dam/BCHydro/customer-portal/documents/corporate/suppliers/transmission-system/balancing_authority_load_data/Historical%20Transmission%20Data/BalancingAuthorityLoad{}.xls'  # noqa
TZ = pytz.timezone('Canada/Pacific')


class BCHydro:
    def __init__(self, log):
        self.log = log
        self.tz = TZ

    def _remote_xls_to_dataframe(self, url):
        """
        Fetch remote .xls file from BC Hydro website, parse the contents
        into a pandas dataframe object, and return
        a success bool, error, and dataframe
        """
        try:
            r = requests.get(url)
            code = r.status_code
            if code != 200:
                self.log.error('Error fetching from {}: {}'.format(url, code))
                return False, None, None
            else:
                BytesIO = pandas.io.common.BytesIO
                data = pandas.read_excel(
                    BytesIO(r.content),
                    engine='xlrd',
                    header=1)
                return True, None, data
        except BaseException as e:
            self.log.error('Error fetching realtime data: {}'.format(e))
            return False, e, None

    def _create_datapoint_dict(self, df):
        """
        Convert pandas dataframe object to a list of dictionaries
        and return a success bool, error, and list
        """
        data = []
        for index, row in df.iterrows():
            try:
                date = parse(row['Date']) + timedelta(hours=int(row['HE']-1))
                success, err, date = self._make_timezone_aware(self.tz, date)
                value = float(row['Balancing Authority Load'])
                if success:
                    data.append({'ts': date, 'value': value, 'ba': 'BC_HYDRO'})
            except BaseException as e:
                self.log.error('Error creating datapoint: {} '.format(e))
                continue
        return True, None, data

    def _make_timezone_aware(self, tz_name, dt):
        """
        Convert a datetime 'dt' to a timezone-aware
        datetime object for the specified timezone 'tz_name' and return a
        success bool, error, and datetime object
        """
        try:
            dt = self.tz.localize(dt)
            return True, None, dt
        except BaseException as e:
            self.log.error('Error converting timestamp {}: {}'.format(dt, e))
            return False, e, None

    def _drop_unwanted_dates(self, df, start, end):
        """
        Drop dataframe rows which contain data from dates
        which are not within the start/end date parameters
        and return the resulting dataframe
        """
        droprows = set()
        for i in range(len(df)):
            if(type(df.loc[i, 'HE']) is int):
                delta = timedelta(hours=(int(df.loc[i, 'HE'])))
                date = df.loc[i, 'Date'] + delta
                success, err, date = self._make_timezone_aware(self.tz, date)
                if not success or date < start or date > end:
                    droprows.add(i)
            else:
                droprows.add(i)
        droprows = sorted(droprows)
        i = 0
        for row in droprows:
            try:
                df = df.drop(df.index[row - i])
                i += 1
            except BaseException as e:
                self.log.error("Error dropping data row {}: {}".format(i, e))
                continue
        df = df.reset_index(drop=True)
        return True, None, df

    def get_realtime_load_data(self):
        """
        Return BCHydro hourly load data in pandas dataframe,
        or None in case of error
        """
        success, err, data = self._remote_xls_to_dataframe(RT_LOAD_URL)
        if not success:
            return False, err, None
        success, err, data = self._create_datapoint_dict(data)
        if not success:
            return None
        return data

    def get_historical_load_data(self, start, end):
        df = []
        for year in range(start.year, end.year+1):
            url = HIST_LOAD_DATA_URL.format(year)
            success, err, data = self._remote_xls_to_dataframe(url)
            if success:
                df.append(data)
        df = pandas.concat(df)
        df = df.reset_index(drop=True)
        success, err, data = self._drop_unwanted_dates(df, start, end)
        if not success:
            return False, err, None
        success, err, data = self._create_datapoint_dict(data)
        if not success:
            return None
        return data


class TestBCHydro(unittest.TestCase):
    def setUp(self):
        self.logger = logging.getLogger(__name__)
        self.client = BCHydro(self.logger)

    def test_historical_load(self):
        start = TZ.localize(datetime(year=2018, month=1, day=1))
        end = TZ.localize(datetime(year=2018, month=12, day=31))
        success, err, data = self.client.get_historical_load_data(start, end)
        self.assertTrue(success)
        self.assertTrue(len(data) >= 24*365*.995)

    def test_drop_unwanted_dates(self):
        start = TZ.localize(datetime(year=2018, month=1, day=1))
        end = TZ.localize(datetime(year=2018, month=12, day=1))
        new_start = TZ.localize(datetime(year=2018, month=3, day=1))
        new_end = TZ.localize(datetime(year=2018, month=9, day=1))
        success_old, err, data_old = (
                self.client.get_historical_load_data(start, end))
        success_new, err, data_new = (
                self.client.get_historical_load_data(new_start, new_end))
        if success_old and success_new:
            unwanted_date_count = 0
            for dict in data_old:
                if dict['ts'] < new_start:
                    unwanted_date_count += 1
                elif dict['ts'] > new_end:
                    unwanted_date_count += 1
            self.assertTrue(unwanted_date_count == len(data_old)-len(data_new))


if __name__ == '__main__':
    unittest.main()
