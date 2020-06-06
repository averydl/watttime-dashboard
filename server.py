from flask import Flask, request, Response
import eia_scrape
import pytz
from dateutil.parser import parse

app = Flask(__name__)
timezone = pytz.utc


@app.route('/emissions/<ba>', methods=['GET'])
def emissions(ba):
    start, end = request.args.get('start'), request.args.get('end')
    if not start or not end:
        return 'Must supply parameter(s) start/end', 400
    else:
        start, end = parse(start).astimezone(timezone), parse(end).astimezone(timezone)
        data = eia_scrape.get_data(ba, start, end)
        resp = Response(data.to_json())
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp


if __name__ == '__main__':
    app.run(debug=True)
