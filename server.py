from flask import Flask
from factory import ClientFactory
import logging
import json

factory = ClientFactory(logging.getLogger(__name__))

app = Flask(__name__)
@app.route('/realtime/<region>')
def realtime(region):
    client = factory.get_client(region)
    data = client.get_realtime_load_data()
    return str(data)
    
if __name__ == '__main__':
    app.run(debug=True)
