import pandas
import logging
import requests
import re
import zipfile
from datetime import datetime
from pytz import timezone
from io import BytesIO

METADATA_FILE = './metadata.xlsx'
LOAD_DATA_URL = 'http://www.nemweb.com.au/REPORTS/CURRENT/Dispatch_SCADA/'
LOAD_DATA = "http://www.nemweb.com.au/REPORTS/CURRENT/Dispatch_SCADA/"
DATE_FORMAT = '%Y/%m/%d %H:%M:%S'
TZ = timezone('Etc/GMT+10')

logger = logging.getLogger(__name__)

class australia:
	def __init__(self, log):
		self.log = log
		self.metadata, self.dataframe = self._extract_metadata(METADATA_FILE)
	
	def _extract_metadata(self, filepath):
		metadata_dict = {}
		data = pandas.read_excel(filepath)
		for index, row in data.iterrows():
			metadata_dict[row['DUID']] = {
				'name': row['DUID'], 
				'fuel': row['CO2E_ENERGY_SOURCE'], 
				'capacity': row['REGISTEREDCAPACITY'], 
				'maxcapacity': row['MAXCAPACITY']
			}
		return metadata_dict, data

	def _create_datapoint_dict(self, df):
		data = []
		for index, row in df.iterrows():
			try:
				data_map = self.metadata.get(row['DUID'])
				if not data_map:
					raise Exception('DUID {} does not exist in metadata.xls'.format(row['DUID']))
				else:
					date = datetime.strptime(row['SETTLEMENTDATE'], DATE_FORMAT)
					ts = TZ.localize(date)
					data.append({'ts': ts, 'value': row['SCADAVALUE'], 'ba': 'AEMO', 'name': data_map['name'], 'fuel_type': data_map['fuel'], 'capacity': data_map['capacity']})
			except Exception as e:
				self.log.error('Error creating datapoint: {} '.format(e))
				continue
		return data
		
	def get_realtime_load_data(self):
		response = requests.get(LOAD_DATA_URL)
		allURLs = re.findall("PUBLIC_DISPATCHSCADA_[0-9]+_[0-9]+.zip", response.content.decode('utf-8'))
		response = requests.get(LOAD_DATA + allURLs[-1], stream=True)

		decompressed_file = zipfile.ZipFile(BytesIO(response.content))
		
		df = pandas.read_csv(decompressed_file.open(decompressed_file.namelist()[0]), header = 1)
		df.drop(df.tail(1).index,inplace=True)
		return self._create_datapoint_dict(df)
