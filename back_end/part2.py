import matplotlib.pyplot as plt
import seaborn as sns

def visualize_airport_performance(airline):
    # Group flights by state and calculate performance metric (e.g., average delay time)
    state_performance = airline.groupBy('OriginState').agg({'DepDelay': 'mean'}).toPandas()

    # Plot performance of states using seaborn or matplotlib
    plt.figure(figsize=(12, 6))
    sns.barplot(x='OriginState', y='avg(DepDelay)', data=state_performance)
    plt.title('Average Departure Delay Time by State')
    plt.xlabel('State')
    plt.ylabel('Average Departure Delay (minutes)')
    plt.xticks(rotation=45)
    plt.show()

# Example usage:
# visualize_airport_performance(airline)


def compare_airport_performance(airline, states):
    # Filter flights by the specified states
    filtered_flights = airline.filter(airline['OriginState'].isin(states))

    # get data of each year
    state_performance = filtered_flights.groupBy('Year', 'OriginState').agg({'DepDelay': 'mean'}).toPandas()

    # Plot performance of states using seaborn or matplotlib
    plt.figure(figsize=(12, 6))
    sns.lineplot(x='Year', y='avg(DepDelay)', data=state_performance, hue='OriginState')
    plt.title('Average Departure Delay Time by State')
    plt.xlabel('Year')
    plt.ylabel('Average Departure Delay (minutes)')
    plt.show()

# Example usage:
# compare_airport_performance(airline, ['NY', 'CA', 'TX'])
