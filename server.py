from flask import Flask, request
from eia_scrape import EIAScraper
from dateutil.parser import parse
import pytz
import os
import config
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '%(levelname)s: [%(asctime)s]: %(module)s: %(message)s',
        'datefmt': '%b %d %Y | %H:%M:%S',
    }},
    'handlers': {
        'wsgi': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://flask.logging.wsgi_errors_stream',
            'formatter': 'default',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'formatter': 'default',
            'filename': './logs/serverlogs.log',
            'maxBytes': 10000,
            'backupCount': 100
        },
    },
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi', 'file']
    }
})
app = Flask(__name__)


@app.route('/emissions/<ba>', methods=['GET'])
def emissions(ba):
    start, end = request.args.get('start'), request.args.get('end')
    app.logger.info('Validating request')
    valid, code, message = validate_emissions_input(ba, start, end)
    if valid:
        start, end = parse(start).astimezone(timezone), parse(end).astimezone(timezone)
        data = client.get_data(ba, start, end)
        if data is None:
            app.logger.warning('API did not return any data')
            return f'Data not found for {ba}', 404
        print(data)
        return data.to_json()
    else:
        return f'{message}', code


def validate_emissions_input(ba, start, end):
    try:
        if ba not in config.BA_LIST:
            message = f'BA {ba} is not supported or does not exist'
            return False, 400, message
        if not start or not end:
            message = 'Did not supply required parameters start & end'
            app.logger.error(message)
            return False, 400, message
        start, end = parse(start).astimezone(timezone), parse(end).astimezone(timezone)
    except ValueError as ve:
        message = f'Invalid input: {ve}'
        app.logger.error(message)
        return False, 400, message
    except OverflowError as oe:
        message = f'Invalid date: {oe}'
        app.logger.error(message)
        return False, 400, message
    else:
        if start > end:
            message = f'Start date must occur after end date'
            app.logger.error(message)
            return False, 400, message
        return True, 200, ''

if __name__ == '__main__':
    client = EIAScraper(app.logger)
    timezone = pytz.utc
    app.run(debug=True)

