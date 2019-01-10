import re
import csv
import sys
from pprint import pprint

file_name = sys.argv[1] + ".csv"
output_file_name = sys.argv[1] + "_output.csv"
sum_file_name = sys.argv[1] + "_sum.csv"
with open(file_name, newline='', encoding='utf-8-sig') as file:
    rows = csv.DictReader(file)
    with open(output_file_name, 'w', newline='', encoding ="utf-8-sig") as out:
        field_name = ["測站", "監測日期", "監測時間", "測站氣壓(hPa)", "溫度(℃)", "相對溼度(%)", "風向", "風速(m/s)", "降水量(mm)"]
        writer = csv.DictWriter(out, fieldnames=field_name)
        writer.writeheader()
        for row in rows:
            if(row["測站"] == "臺北"):
                del row["序號"]
                del row["日照時數(小時)"]
                writer.writerow(row)

with open(output_file_name, newline='', encoding='utf-8-sig') as file:
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
        day = row["監測日期"].split('/')
        day = int(day[2])
        table[day]["date"] = row["監測日期"]
        table[day]["temp"] += float(row["溫度(℃)"])
        table[day]["humidity"] += float(row["相對溼度(%)"])
        table[day]["precipitation"] += float(row["降水量(mm)"])
        table[day]["count"] += 1
    with open(sum_file_name, 'w', newline='', encoding='utf-8-sig') as out:
        field_name = ["date", "temp", "humidity", "precipitation"]
        writer = csv.DictWriter(out, fieldnames=field_name)
        writer.writeheader()
        for i in range(1,32):
            # cal
            if table[i]["date"] == "":
                break
            table[i]["temp"] = table[i]["temp"] / table[i]["count"]
            table[i]["humidity"] = table[i]["humidity"] / table[i]["count"]
            table[i]["precipitation"] = table[i]["precipitation"]
            del table[i]["count"]
            writer.writerow(table[i])