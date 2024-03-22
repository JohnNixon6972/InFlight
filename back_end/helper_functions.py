from pyspark.sql import SparkSession
from part1 import search_flights_by_year
from part2 import visualize_airport_performance, compare_airport_performance


spark = SparkSession.builder.appName("Parquet Reader").getOrCreate()


# Example usage:
# display_worst_performing_airlines(airline)


# Example usage:
# display_worst_performing_airlines()

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
        delayed = airline.filter(airline.Month == month).filter(
            airline.ArrDelay > 15).count()
        month = month_map[month]
        flights_month[month] = {'total': total, 'delayed': delayed}

    # assign total and delayed for each year
    for year in years:
        total = airline.filter(airline.Year == year).count()
        delayed = airline.filter(airline.Year == year).filter(
            airline.ArrDelay > 15).count()
        flights_year[year] = {'total': total, 'delayed': delayed}
    return flights_year, flights_month


def get_dashboard_data(airline):
    data = {}
    total_entries = airline.count()
    data['total_entries'] = total_entries
    data_range = airline.select('Year').distinct().collect()
    data_range = [row.Year for row in data_range]
    data['data_range'] = data_range

    uniq_origin = airline.select('Origin').distinct().collect()
    uniq_origin = [row.Origin for row in uniq_origin]
    data['uniq_origin'] = uniq_origin

    uniq_dest = airline.select('Dest').distinct().collect()
    uniq_dest = [row.Dest for row in uniq_dest]
    data['uniq_dest'] = uniq_dest

    flights_each_year, flights_each_month = get_flights_each_year(airline)

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
    return data

def get_states(airline):
    states = airline.select('OriginStateName').distinct().collect()
    states = [row.OriginStateName for row in states]
    states.remove(None)

    return states
   

def get_comparison(airline, states):
    res = []
    # for all the states get the total number of flights, delayed flights and cancelled flights
    for state in states:
        total = airline.filter(airline.OriginStateName == state).count()
        delayed = airline.filter(airline.OriginStateName == state).filter(
            airline.ArrDelay > 15).count()
        cancelled = airline.filter(airline.OriginStateName == state).filter(
            airline.Cancelled == 1).count()

        res.append({'state': state, 'total': total, 'delayed': delayed, 'cancelled': cancelled})

    return res


def display_menu():
    print("Menu:")
    print("1. Search flights by year")
    print("2. Display flight performance for a year")
    print("3. Display top reason for cancelled flights for a year")
    print("4. Display top airports with most punctual take-offs for specific years")
    print("5. Display top three worst performing airlines in the 20th century")
    print("6. Compare airport performance across US states")
    print("7. Visualize airport performance across US states")
    print("8. Exit")


# def menu_selection(airline):
#     while True:
#         display_menu()
#         choice = input("Enter your choice: ")

#         if choice == "1":
#             year = int(input("Enter the year to search flights: "))
#             search_flights_by_year(airline, year)
#         elif choice == "2":
#             year = int(input("Enter the year to display flight performance: "))
#             display_flight_performance(airline, year)
#         elif choice == "3":
#             year = int(
#                 input("Enter the year to display top reason for cancelled flights: "))
#             display_top_cancelled_reason(airline, year)
#         elif choice == "4":
#             specific_years = input("Enter specific years separated by comma: ")
#             display_top_airports(airline, specific_years)
#         elif choice == "5":
#             display_worst_performing_airlines(airline)
#         elif choice == "6":
#             compare_airport_performance(airline, ['NY', 'CA', 'TX'])
#         elif choice == "7":
#             visualize_airport_performance(airline)
#         elif choice == "8":
#             print("Exiting...")
#             break
#         else:
#             print("Invalid choice. Please try again.")
