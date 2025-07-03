from flask import Flask, request, jsonify
from flask_cors import CORS

import requests

app = Flask(__name__)
CORS(app)

API_KEY = '598ce753cb7dbcbb6c648169388bc167'  # 替换为你的 OpenWeatherMap API Key

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City not provided'}), 400

    url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric",
        "lang": "zh_cn"
    }

    res = requests.get(url, params=params)
    if res.status_code == 200:
        data = res.json()
        return jsonify({
            "city": data["name"],
            "temp": f"{data['main']['temp']}°C",
            "desc": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind": data["wind"]["speed"]
        })
    else:
        return jsonify({'error': 'Unable to fetch weather'}), 500
if __name__ == '__main__':
    print("Flask server running...") 
    app.run(host='0.0.0.0', port=5000, debug=True)

