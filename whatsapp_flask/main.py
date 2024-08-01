from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



options = Options()
options.add_argument("--start-maximized")
# options.add_argument("--headless")
# options.add_experimental_option("detach", True)


service = ChromeService(executable_path=ChromeDriverManager().install())

driver = webdriver.Chrome(service=service, options=options)

driver.get("https://web.whatsapp.com")

title = driver.title
print(title)

qr_code_class_name = "_19vUU"
#driver.find_element(By.CLASS_NAME, qr_code_class_name)

try:
    element = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, qr_code_class_name))
    )

    WebDriverWait(driver, 10).until(
        lambda driver: element.get_attribute("data-ref") is not None
    )

    data_ref_value = element.get_attribute("data-ref")
    
    print("Element is present. data-ref:", data_ref_value)
except Exception as e:
    print("Element not found within the timeout period.")
    print(e)

breakpoint()


