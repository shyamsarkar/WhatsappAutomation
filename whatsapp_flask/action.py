from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from time import sleep
from urllib.parse import quote
from sys import platform
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.alert import Alert
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException, NoAlertPresentException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.service import Service as ChromeService
import os
from datetime import datetime
import time


options = Options()
options.add_argument("--start-maximized")
options.headless = True
# if platform == "win32":
#     options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

service = ChromeService(executable_path=ChromeDriverManager().install())

# browserChrome = webdriver.Chrome(r"C:\\chromedriver.exe", chrome_options=options)
browserChrome = webdriver.Chrome(service=service, chrome_options=options)


def index(number, message):
    message = quote(message)
    global browserChrome, delay
    try:
        url = 'https://web.whatsapp.com/send?phone=+91' + number + '&text=' + message
        browserChrome.get(url)
        try:
            click_btn = WebDriverWait(browserChrome, 20).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="main"]/footer/div[1]/div/span[2]/div/div[2]/div[2]/button')))
        except Exception as e:
            print("Make sure your phone and computer is connected to the internet.")
        else:
            sleep(1)
            click_btn.click()
            sleep(3)
            print('Message sent to: ' + number)
    except Exception as e:
        print('Failed to send message to ' + number + str(e))
