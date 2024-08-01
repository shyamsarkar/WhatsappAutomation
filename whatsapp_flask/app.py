from flask import Flask, redirect, request, render_template
from action import *
app = Flask(__name__)


def take_scree_shot(timeMultiple=1):
    global browserChrome
    time.sleep(2*timeMultiple)
    now = datetime.now()
    curr_time = now.strftime("%d%m%Y%H%M%S")
    browserChrome.get_screenshot_as_file(os.getcwd()+"\\static\\"+curr_time + ".png")


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        mobile = request.form.get('mobile')
        message = request.form.get('message')
        index(mobile, message)
    return render_template('index.html')


@app.route('/open')
def openLink():
    global browserChrome
    browserChrome.get('https://web.whatsapp.com')
    take_scree_shot()
    take_scree_shot()
    print(browserChrome.title)
    return redirect('/')
