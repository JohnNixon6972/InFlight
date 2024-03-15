def display_flight_performance(airline, year):
    # Filter flights by the specified year
    flights_by_year = airline.filter(airline['Year'] == year)

    # Count the total number of flights
    total_flights = flights_by_year.count()

    # Count the number of flights that took off on time, early, and late
    on_time_flights = flights_by_year.filter(airline['DepDelay'] <= 0).count()
    early_flights = flights_by_year.filter(airline['DepDelay'] < 0).count()
    late_flights = flights_by_year.filter(airline['DepDelay'] > 0).count()

    # Calculate the percentage of flights in each category
    on_time_percentage = (on_time_flights / total_flights) * 100
    early_percentage = (early_flights / total_flights) * 100
    late_percentage = (late_flights / total_flights) * 100

    print(f"Percentage of flights on time: {on_time_percentage:.2f}%")
    print(f"Percentage of flights early: {early_percentage:.2f}%")
    print(f"Percentage of flights late: {late_percentage:.2f}%")

# Example usage:
# display_flight_performance(airline, 2010)


def search_flights_by_year(airline, year):
    # Filter flights by the specified year
    flights_by_year = airline.filter(airline['Year'] == year)

    # Count the total number of flights
    total_flights = flights_by_year.count()

    print(f"Total number of flights in {year}: {total_flights}")





def display_top_cancelled_reason(airline, year):
    # Filter flights by the specified year and cancelled flights
    cancelled_flights = airline.filter(
        (airline['Year'] == year) & (airline['Cancelled'] == 1))

    # Group cancelled flights by cancellation reason and count occurrences
    cancellation_reasons = cancelled_flights.groupBy(
        'CancellationCode').count()

    # Find the most common cancellation reason
    top_reason = cancellation_reasons.orderBy(
        cancellation_reasons['count'].desc()).first()

    if top_reason:
        print(
            f"The top reason for cancelled flights in {year} was {top_reason['CancellationCode']}")
    else:
        print(f"No cancelled flights found for the year {year}")

# Example usage:
# display_top_cancelled_reason(airline, 2010)


def display_top_airports(airline, years):
    top_airports = []

    for year in years:
        # Filter flights by the specified year and on-time departures
        on_time_flights = airline.filter(
            (airline['Year'] == year) & (airline['DepDelay'] <= 0))

        # Group flights by originating airport and count occurrences
        airport_counts = on_time_flights.groupBy('Origin').count()

        # Find the top 3 airports with most punctual take-offs
        top_airports_year = airport_counts.orderBy(
            airport_counts['count'].desc()).limit(3)
        top_airports.extend(top_airports_year.collect())

    print(
        f"The top airports with most punctual take-offs for the years {years} are:")
    for i, airport in enumerate(top_airports, start=1):
        print(
            f"{i}. {airport['Origin']}, Punctual Flights: {airport['count']}")

# Example usage:
# display_top_airports(airline, [1987, 1997, 2007, 2017])


def display_worst_performing_airlines(airline):
    # Filter flights in the 20th century (years 1900-1999)
    century_flights = airline.filter(
        (airline['Year'] >= 1900) & (airline['Year'] <= 1999))

    # Group flights by reporting airline and count occurrences
    airline_counts = century_flights.groupBy('Reporting_Airline').count()

    # Find the top 3 worst performing airlines (with highest average departure delays)
    worst_performing_airlines = airline_counts.orderBy(
        airline_counts['count'].desc()).limit(3)
    worst_performing_airlines_list = worst_performing_airlines.collect()

    # print("The top three worst performing airlines in the 20th century are:")
    data = []
    for i, airline in enumerate(worst_performing_airlines_list, start=1):
        # print(
        #     f"{i}. {airline['Reporting_Airline']}, Total Delays: {airline['count']}")
        data.append(
            {"airline": airline['Reporting_Airline'], "total_delays": airline['count']})
    return data