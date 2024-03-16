from flask import Flask, request, jsonify
from pyspark.sql import SparkSession
from part1 import search_flights_by_year, display_flight_performance, display_top_cancelled_reason, display_top_airports, display_worst_performing_airlines
from part2 import visualize_airport_performance, compare_airport_performance
from flask_cors import CORS

spark = SparkSession.builder.appName("Parquet Reader").getOrCreate()
app = Flask(__name__)
CORS(app)

# Initialize the airline variable globally
airline = None

def read_parquet_and_print_top(parquet_path):
    global airline
    # Read Parquet files into a DataFrame
    airline = spark.read.parquet(parquet_path)

# Initialize Spark session and read Parquet file
parquet_path = "./airline.parquet"
read_parquet_and_print_top(parquet_path)

def get_flights_each_year(airline):
    month_map = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }
    flights_year = {}
    flights_month = {}
    years = airline.select('Year').distinct().collect()
    years = [row.Year for row in years]

    months = airline.select('Month').distinct().collect()
    months = [row.Month for row in months]
    # assign total and delayed for each month
    for month in months:
        total = airline.filter(airline.Month == month).count()
        delayed = airline.filter(airline.Month == month).filter(airline.ArrDelay > 15).count()
        month = month_map[month]
        flights_month[month] = {'total': total, 'delayed': delayed}

    # assign total and delayed for each year
    for year in years:
        total = airline.filter(airline.Year == year).count()
        delayed = airline.filter(airline.Year == year).filter(airline.ArrDelay > 15).count()
        flights_year[year] = {'total': total, 'delayed': delayed}
    return flights_year, flights_month


@app.route('/')
def home():
    data = {}
    total_entries = airline.count()
    data['total_entries'] = total_entries
    data_range = airline.select('Year').distinct().collect()
    data_range = [row.Year for row in data_range]
    data['data_range'] = data_range
    data_worst = display_worst_performing_airlines(airline)
    
    data['worst_performing_airlines'] = data_worst

    uniq_origin = airline.select('Origin').distinct().collect()
    uniq_origin = [row.Origin for row in uniq_origin]
    data['uniq_origin'] = uniq_origin

    uniq_dest = airline.select('Dest').distinct().collect()
    uniq_dest = [row.Dest for row in uniq_dest]
    data['uniq_dest'] = uniq_dest

    flights_each_year,flights_each_month = get_flights_each_year(airline)

    air_time = airline.select('AirTime').distinct().collect()
    # replace all None values with mean
    air_time = [row.AirTime for row in air_time]
    air_time1 = [abs(row) for row in air_time if row is not None]
    mean_air_time = sum(air_time1) / len(air_time1)
    air_time = [mean_air_time if row is None else abs(row) for row in air_time] 
    

    data['air_time'] = air_time
    data['flights_each_year'] = flights_each_year
    data['flights_each_month'] = flights_each_month
    # Flights = [row.Flight for row in Flights]
    # get unique flight names
    # print(data)
    return jsonify(data)

@app.route('/search_flights_by_year', methods=['GET', 'POST'])
def search_flights_by_year_route():
    print(request.method)
    if request.method == 'POST':
        year = request.form['year']
        search_flights_by_year(airline, year)

if __name__ == '__main__':
    # Now that airline is initialized, run the Flask app
    app.run()
