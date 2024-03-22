# Import necessary modules
from pyspark.sql import SparkSession
import os

# Initialize Spark session
spark = SparkSession.builder.appName("CSV to Parquet Converter").getOrCreate()



def convert_csv_to_parquet(input_csv_folder_path,output_parquet_folder_path):
    # get all csv files in the input folder
    csv_files = [f for f in os.listdir(input_csv_folder_path) if f.endswith('.csv')]

    for file in csv_files:
        # Read all CSV files in the input folder
        df = spark.read.csv(input_csv_folder_path + file, header=True, inferSchema=True)

        # Write DataFrame to Parquet format
        df.write.parquet(output_parquet_folder_path + file.split('.')[0], mode="overwrite")


# Example usage
# convert_csv_to_parquet('./data/', './parquet_data/')
        
input_csv_folder_path = './dataSets/'
output_parquet_folder_path = './parquet_dataSets/'
convert_csv_to_parquet(input_csv_folder_path,output_parquet_folder_path)