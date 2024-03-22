# Running InFlight Application

1. **Navigate to the InFlight folder:**
    ```bash
    cd InFlight
    ```

2. **Convert CSV files to Parquet:**
    - Navigate to the back_end folder:
        ```bash
        cd back_end
        ```
    - Open `converter.py` and specify the input CSV folder and output Parquet folder.
    - Run the converter script:
        ```bash
        python converter.py
        ```

3. **Install npm packages:**
    - Back inside the InFlight folder:
        ```bash
        npm install
        ```

4. **Start the backend:**
    - Run the command:
        ```bash
        npm run start-backend
        ```
    - This may take 10-15 seconds.

5. **Start the frontend:**
    - Run the command:
        ```bash
        npm run start
        ```
    - This will open the frontend in the default browser.

