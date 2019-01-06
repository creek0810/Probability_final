from selenium import webdriver
from selenium.webdriver.support.ui import Select

browser = webdriver.Chrome()
browser.get('https://fhy.wra.gov.tw/ReservoirPage_2011/StorageCapacity.aspx')


year = Select(browser.find_element_by_id("ctl00_cphMain_ucDate_cboYear"))
year.select_by_value("2017")


for i in range(1,13):
    month = Select(browser.find_element_by_id("ctl00_cphMain_ucDate_cboMonth"))
    month.select_by_value(str(i))
    for j in range(1,32):
        try:
            day = Select(browser.find_element_by_id("ctl00_cphMain_ucDate_cboDay"))
            day.select_by_value(str(j))
            query_btn = browser.find_element_by_id("ctl00_cphMain_btnExcel") 
            query_btn.click()
        except:
            print(str(i) + " " + str(j))

