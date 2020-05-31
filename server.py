from flask import Flask, request
import eia_scrape
import pytz
from datetime import datetime, timedelta
from dateutil.parser import parse

app = Flask(__name__)
timezone = pytz.utc


@app.route('/emissions/<ba>', methods=['GET'])
def emissions(ba):
    days = request.args.get('days')
    if not days:
        return 'Must supply parameter "days"', 400
    else:
        current_date = datetime.now()
        year, month, day = current_date.year, current_date.month, current_date.day

        start = current_date - timedelta(days=(int(days)))
        end = current_date

        print(start)
        print(end)

        start, end = start.astimezone(timezone), end.astimezone(timezone)
        data = eia_scrape.get_data(ba, start, end)
        return data.to_json()


if __name__ == '__main__':
    app.run(debug=True)
