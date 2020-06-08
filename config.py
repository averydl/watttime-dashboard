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
CATEGORY_IDS = {'generation': 3390101, 'interchange': 2123637,'load': 2122628}
CATEGORY_URL = 'http://api.eia.gov/category/?api_key={}&category_id={}'
SERIES_URL = 'http://api.eia.gov/series/?api_key={}&series_id={}'
API_KEY = 'xxx'

