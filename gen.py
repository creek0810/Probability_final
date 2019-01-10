import os

for i in range(1,13): 
    if i < 10:
        name = "0" + str(i)
    else:
        name = str(i)
    name = "rain_source/2017" + name
    cmd = "python pretreatment.py " + name
    os.system(cmd)