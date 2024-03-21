from flask import Flask, request, jsonify
from pyspark.sql import SparkSession
from part1 import search_flights_by_year, get_flight_performance, get_top_cancelled_reason, get_top_airports, get_worst_performing_airlines
from part2 import visualize_airport_performance, compare_airport_performance
from flask_cors import CORS
from helper_functions import get_dashboard_data


spark = SparkSession.builder.config("spark.driver.memory", "16g").appName("Airline Performance Analyzer").getOrCreate()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize the airline variable globally
airline = None
default_data = None

def read_parquet_and_print_top(parquet_path):
    global airline
    global default_data
    # Read Parquet files into a DataFrame
    airline = spark.read.parquet(parquet_path)
    default_data = get_dashboard_data(airline)

# Initialize Spark session and read Parquet file
parquet_path = "./airline.parquet"
read_parquet_and_print_top(parquet_path)


@app.route('/')
def home():
    global default_data
    return jsonify(default_data)

@app.route('/search_flights_by_year', methods=['POST'])
def search_flights_by_year_route():
    global airline
    request_data = request.get_json()  # Get JSON data from the request
    print("request data ", request_data)
    years = request_data.get('year', '').split(',') 
    print("years ", years)
    result = search_flights_by_year(airline, years)
    return jsonify(result)

@app.route('/get_annual_stats', methods=['POST'])
def get_annual_stats_route():
    global airline
    request_data = request.get_json()  # Get JSON data from the request
    print("request data ", request_data)
    year = request_data.get('year', '')
    result = get_flight_performance(airline, year)
    return jsonify(result)


@app.route('/get_to_reasons', methods=['POST'])
def get_to_reasons_route():
    global airline
    request_data = request.get_json()  # Get JSON data from the request
    print("request data ", request_data)
    year = request_data.get('year', '')
    result = get_top_cancelled_reason(airline, year)
    return jsonify(result)

@app.route('/get_top_airports')
def get_top_airports_route():
    global airline
    years = [1987, 1997, 2007, 2017]
    result = get_top_airports(airline,years)
    return jsonify(result)

@app.route('/get_worst_performing_airlines')
def get_worst_performing_airlines_route():
    global airline
    result = get_worst_performing_airlines(airline)
    return jsonify(result)


if __name__ == '__main__':
    app.run()





