from pyspark.sql import SparkSession
from part1 import search_flights_by_year, display_flight_performance, display_top_cancelled_reason, display_top_airports, display_worst_performing_airlines
from part2 import visualize_airport_performance, compare_airport_performance


spark = SparkSession.builder.appName("Parquet Reader").getOrCreate()



# Example usage:
# display_worst_performing_airlines(airline)


# Example usage:
# display_worst_performing_airlines()

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


def menu_selection(airline):
    while True:
        display_menu()
        choice = input("Enter your choice: ")

        if choice == "1":
            year = int(input("Enter the year to search flights: "))
            search_flights_by_year(airline, year)
        elif choice == "2":
            year = int(input("Enter the year to display flight performance: "))
            display_flight_performance(airline, year)
        elif choice == "3":
            year = int(input("Enter the year to display top reason for cancelled flights: "))
            display_top_cancelled_reason(airline, year)
        elif choice == "4":
            specific_years = input("Enter specific years separated by comma: ")
            display_top_airports(airline, specific_years)
        elif choice == "5":
            display_worst_performing_airlines(airline)
        elif choice == "6":
            compare_airport_performance(airline,['NY', 'CA', 'TX'])
        elif choice == "7":
            visualize_airport_performance(airline)
        elif choice == "8":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")



