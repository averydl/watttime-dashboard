from webscrapers.Australia.australia import australia
from webscrapers.Australia.western_australia import western_australia
from webscrapers.Canada.BCHydro import BCHydro
from webscrapers.Taiwan.taiwan import taiwan

class ClientFactory:
    def __init__(self, logger):
        self.log = logger

    def get_client(self, name):
        region = name.lower()
        logger = self.log
        if region == 'canada':
            return BCHydro(logger)
        elif region == 'australia':
            return australia(logger)
        elif region == 'westernaustralia':
            return western_australia(logger)
        elif region == 'taiwan':
            return taiwan(logger)
        else:
            return None
