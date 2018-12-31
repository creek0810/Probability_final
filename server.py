import os
import re
import csv
import sys
import json
import decimal
import time
import numpy as np
from pprint import pprint
from flask import Flask, request, render_template, Response,jsonify

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1.0

# save file
file_path = os.path.dirname(__file__)
def get_file():
	file = request.files['file']
	path = os.path.join(file_path, 'upload_file\\', file.filename)
	file.save(path)
	result = {
		"name" : file.filename,
		"city_name" : []
	}
	with open(path, newline='', encoding='utf-8-sig') as file:
		rows = csv.DictReader(file)
		for row in rows:
			if row["測站"] not in result["city_name"] :
				result["city_name"].append(row["測站"])
	return result

"""
 return the table 
	[{
		"date": "2017/01/01,
		"temp": 10.5,
		"precipitation": 0.0,
		"bumidity": 82.83333
	},...]

"""
def pretreat(file_name,city):
	file_name = os.path.join(file_path, 'upload_file\\', file_name)
	with open(file_name, newline='', encoding='utf-8-sig') as file:
		rows = csv.DictReader(file)
		table = []
		for i in range(32):
			table.append({
						"date": "",
						"temp": 0,
						"humidity": 0,
						"precipitation": 0,
						"count": 0
			})
		for row in rows:
			if(row["測站"] == city):
				day = row["監測日期"].split('/')
				format_day = day[0] + "-" + day[1] + "-" + day[2]
				day = int(day[2])
				table[day]["date"] = format_day 
				table[day]["temp"] += float(row["溫度(℃)"])
				table[day]["humidity"] += float(row["相對溼度(%)"])
				table[day]["precipitation"] += float(row["降水量(mm)"])
				table[day]["count"] += 1
		table_range = 0 
		table.pop(0)
		for i in range(31):
			# cal
			if table[i]["date"] == "":
				break
			# calc temp and round
			table[i]["temp"] = decimal.Decimal(table[i]["temp"] / table[i]["count"])
			table[i]["temp"] = str(round(table[i]["temp"],5))
			table[i]["humidity"] = decimal.Decimal(table[i]["humidity"] / table[i]["count"])
			table[i]["humidity"] = str(round(table[i]["humidity"],5))
			table[i]["precipitation"] = str(table[i]["precipitation"])
			del table[i]["count"]
			table_range += 1
	return table[:table_range]

# main query webpage
@app.route("/", methods=['GET'])
def upload():
	return render_template('index.html')

# result webpage
@app.route('/', methods=['POST'])
def test():
	result = get_file()
	return render_template('result.html', date=result["name"], city=result["city_name"])

@app.route('/query', methods=['GET'])
def querry_result():
	data = pretreat(request.args.get("file_name"),request.args.get("city")) 
	# build humidity,pre,temp list
	temp_humidity = []
	temp_pre = []
	temp_temp = []
	for i in data:
		temp_humidity.append(float(i["humidity"]))
		temp_pre.append(float(i["precipitation"]))
		temp_temp.append(float(i['temp']))
	sta_data = {}
	sta_data["temp_coef"] = round(np.corrcoef([temp_temp,temp_pre])[0][1], 5)
	sta_data["humidity_coef"] = round(np.corrcoef([temp_humidity,temp_pre])[0][1], 5)
	data.append(sta_data)
	return jsonify(data=data)

if __name__ == '__main__':
	app.debug = True
	app.run()