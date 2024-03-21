from pyspark.sql import SparkSession


def get_flight_performance(airline, year):
    # Filter flights by the specified year
    flights_by_year = airline.filter(airline['Year'] == year)

    # Count the total number of flights
    total_flights = flights_by_year.count()

    # Count the number of flights that took off on time, early, and late
    on_time_flights = flights_by_year.filter(airline['DepDelay'] <= 0).count()
    early_flights = flights_by_year.filter(airline['DepDelay'] < 0).count()
    late_flights = flights_by_year.filter(airline['DepDelay'] > 0).count()

    # Calculate the percentage of on-time, early, and late flights
    on_time_percentage = (on_time_flights / total_flights) * 100
    early_percentage = (early_flights / total_flights) * 100
    late_percentage = (late_flights / total_flights) * 100
    # normalize to 100 without decimals
    on_time_percentage = on_time_percentage / \
        (on_time_percentage + early_percentage + late_percentage) * 100
    early_percentage = early_percentage / \
        (on_time_percentage + early_percentage + late_percentage) * 100
    late_percentage = late_percentage / \
        (on_time_percentage + early_percentage + late_percentage) * 100

    on_time_percentage = round(on_time_percentage, 2)
    early_percentage = round(early_percentage, 2)
    late_percentage = round(late_percentage, 2)

    result = [on_time_percentage, early_percentage, late_percentage]

    return result

# Example usage:
# display_flight_performance(airline, 2010)


def search_flights_by_year(airline, years):
    result = []
    for year in years:
        # Filter flights by the specified year
        flights_by_year = airline.filter(airline['Year'] == year)

        # Count the total number of flights
        total_flights = flights_by_year.count()
        # Count the number of delayed flights
        delayed_flights = flights_by_year.filter(
            airline['ArrDelay'] > 15).count()

        if total_flights == 0:
            continue

        if delayed_flights == 0:
            result.append({'total_flights': total_flights,
                          'delayed_flights': 0, 'year': year})
            continue

        percent = (delayed_flights / total_flights) * 100
        percent = round(percent, 2)
        result.append({'total_flights': total_flights,
                      'delayed_flights': percent, 'year': year})

    return result


def get_top_cancelled_reason(airline, year):

    # Filter flights by the specified year and cancelled flights
    cancelled_flights = airline.filter(
        (airline['Year'] == year) & (airline['Cancelled'] == 1))

    # Group cancelled flights by cancellation reason and count occurrences
    cancellation_reasons = cancelled_flights.groupBy(
        'CancellationCode').count()

    # Find the most common cancellation reason
    top_reasons = cancellation_reasons.orderBy(
        cancellation_reasons['count'].desc())

    # read code cvs file
    code_spark = SparkSession.builder.appName("CancellationCode").getOrCreate()
    code = code_spark.read.csv(
        './SupplementaryCSVs/L_CANCELLATION.csv', header=True, inferSchema=True)

    # based on the code, find the reason from the csv file
    top_reasons = top_reasons.collect()
    result = []
    total_cancelled = cancelled_flights.count()
    for i, reason in enumerate(top_reasons, start=1):
        cancelled_percentage = (reason['count'] / total_cancelled) * 100
        cancelled_percentage = round(cancelled_percentage, 2)
        code_reason = code.filter(
            code['Code'] == reason['CancellationCode']).collect()
        if len(code_reason) == 0:
            result.append({'reason': 'Unknown',
                           'count': reason['count'], 'percentage': cancelled_percentage})
        else:
            result.append({'reason': code_reason[0]['Description'],
                           'count': reason['count'], 'percentage': cancelled_percentage})
    return result

# Example usage:
# display_top_cancelled_reason(airline, 2010)


def get_top_airports(airline, years):
    top_airports = []
    year_total_flights = {}
    result = []
    for year in years:
        # Filter flights by the specified year and on-time departures
        on_time_flights = airline.filter(
            (airline['Year'] == year) & (airline['DepDelay'] <= 0))

        # Group flights by originating airport and count occurrences also get the OriginStateName and OriginCityName
        airport_counts = on_time_flights.groupBy(
            'Origin', 'OriginStateName', 'OriginCityName').count()
        top_airports_year = airport_counts.orderBy(
            airport_counts['count'].desc()).limit(3)

        for airport in top_airports_year.collect():
            if airport['Origin'] in year_total_flights:
                year_total_flights[airport['Origin']] += airport['count']
            else:
                year_total_flights[airport['Origin']] = airport['count']

        # get the OriginStateName and OriginCityName
        top_airports = []
        for i, airport in enumerate(top_airports_year.collect(), start=1):
            city = airport['OriginCityName'].split(",")[
                0]
            location = city + \
                ', ' + airport['OriginStateName']
            percentage = (airport['count'] /
                          year_total_flights[airport['Origin']]) * 100
            percentage = round(percentage, 2)
            top_airports.append(
                {"airport": airport['Origin'], "count": percentage, "location": location, "year": year})
        result += top_airports
    return result

    # print(
    #     f"The top airports with most punctual take-offs for the years {years} are:")
    # for i, airport in enumerate(top_airports, start=1):
    #     print(
    #         f"{i}. {airport['Origin']}, Punctual Flights: {airport['count']}")

# Example usage:
# display_top_airports(airline, [1987, 1997, 2007, 2017])


def get_worst_performing_airlines(airline):
    # Filter flights in the 20th century (years 1900-1999)
    century_flights = airline.filter(
        (airline['Year'] >= 1900) & (airline['Year'] <= 1999))


    # calculate average delay
    average_delay = century_flights.groupBy('Reporting_Airline').avg('ArrDelay')
    average_delay = average_delay.withColumnRenamed('avg(ArrDelay)', 'avg_delay')

    # Filter flights with an arrival delay greater than average delay
    worst_performing_airlines = century_flights.join(average_delay, on='Reporting_Airline')
    worst_performing_airlines = worst_performing_airlines.filter(worst_performing_airlines['ArrDelay'] > worst_performing_airlines['avg_delay'])
    worst_performing_airlines = worst_performing_airlines.groupBy('Reporting_Airline').count().orderBy('count', ascending=False).limit(3)

    worst_performing_airlines_list = worst_performing_airlines.collect()

    # print("The top three worst performing airlines in the 20th century are:")
    data = []
    for i, airline in enumerate(worst_performing_airlines_list, start=1):
        # print(
        #     f"{i}. {airline['Reporting_Airline']}, Total Delays: {airline['count']}")
        data.append(
            {"airline": airline['Reporting_Airline'], "total_delays": airline['count']})
    return data
