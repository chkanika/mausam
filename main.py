from flask import Flask, render_template


app = Flask (__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/temperature")
def temperature():
    return {
        "Temperature change"
        }

@app.route("/map")
def map():
    return render_template("index.html")    
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port= 4001, debug= True)
