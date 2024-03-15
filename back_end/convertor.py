# Import necessary modules
from pyspark.sql import SparkSession

# Initialize Spark session
spark = SparkSession.builder.appName("CSV to Parquet Converter").getOrCreate()

# Specify the input and output paths
input_csv_path = "./airline.csv"
output_parquet_path = "./airline.parquet"

# Read CSV file into a DataFrame
df = spark.read.csv(input_csv_path, header=True, inferSchema=True)

# Write DataFrame to Parquet format
df.write.parquet(output_parquet_path, mode="overwrite")

# Stop Spark session
spark.stop()
