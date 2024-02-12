import psycopg2
import pandas as pd

def process_chartevents_temp(conn):
    chart_events_temp_query = '''
    set search_path to mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS item_label,
        ce.itemid,
        ce.valuenum
    FROM
        chartevents ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid IN (676, 677, 678, 679, 223761, 223762, 226329)'''

    chartevents_temp = pd.read_sql_query(chart_events_temp_query, conn)

    chartevents_temp_df = chartevents_temp.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='item_label',
        values='valuenum',
        aggfunc='first'
    ).reset_index()

    chartevents_temp_df.columns = [''.join(col).strip() for col in chartevents_temp_df.columns.values]

    # Drop rows without temperature values
    temperature_columns = ['Blood Temperature CCO (C)', 'Temperature C', 'Temperature C (calc)',
                            'Temperature Celsius', 'Temperature F', 'Temperature F (calc)',
                            'Temperature Fahrenheit']

    chartevents_temp_df = chartevents_temp_df.dropna(subset=temperature_columns, how='all')

    # Fix mismatched values
    celsius_columns = ['Blood Temperature CCO (C)', 'Temperature C', 'Temperature C (calc)', 'Temperature Celsius']
    fahrenheit_columns = ['Temperature F', 'Temperature F (calc)', 'Temperature Fahrenheit']

    chartevents_temp_df[celsius_columns] = chartevents_temp_df[celsius_columns].apply(pd.to_numeric)
    chartevents_temp_df[fahrenheit_columns] = chartevents_temp_df[fahrenheit_columns].apply(pd.to_numeric)

    def fix_values_celsius(value):
        if pd.notna(value):
            if value > 200:
                value /= 10
            elif value < 11:
                value *= 10

            # Check if the value is in Fahrenheit range
            elif 77 <= value <= 110:
                # Convert Fahrenheit to Celsius
                value = (value - 32) * 5/9
        return value
        
    def fix_values_fahrenheit(value):
        if pd.notna(value) == True:
            if value > 200:
                value /= 10
            elif value < 11:
                value *= 10

            # Check if the value is in Celsius range
            elif 20 <= value <= 50:
                # Convert Celsius to Fahrenheit
                value = (value * (9/5)) + 32

        return value
    

    for column in celsius_columns:
        chartevents_temp_df[column] = chartevents_temp_df[column].apply(fix_values_celsius)

    for column in fahrenheit_columns:
        chartevents_temp_df[column] = chartevents_temp_df[column].apply(fix_values_fahrenheit)

    #Combine celsius and fahrenheit columns
    chartevents_temp_df[celsius_columns + fahrenheit_columns] = chartevents_temp_df[celsius_columns + fahrenheit_columns].fillna(0)
    chartevents_temp_df['Celsius_combined'] = chartevents_temp_df[celsius_columns].apply(lambda row: max(row), axis=1)
    chartevents_temp_df['Fahrenheit_combined'] = chartevents_temp_df[fahrenheit_columns].apply(lambda row: max(row), axis=1)

    #Create final temperature column
    celsius_combined_column = 'Celsius_combined'
    fahrenheit_combined_column = 'Fahrenheit_combined'

    chartevents_temp_df[celsius_combined_column] = chartevents_temp_df[celsius_combined_column] * 9/5 + 32
    chartevents_temp_df['Final_Temperature_F'] = chartevents_temp_df[[celsius_combined_column, fahrenheit_combined_column]].apply(lambda row: max(row), axis=1)

    return chartevents_temp_df


def main():
    # Make sure to update inputs to match your Postgres server
    conn = psycopg2.connect(
        host="localhost",
        database="mimic",
        user="postgres"
        #, password = [your password],
        # port = 5432 [change to postgres port]
    )

    chartevents_temp_df = process_chartevents_temp(conn)

    csv_path_1 = 'chartevents_temp.csv'
    chartevents_temp_df.to_csv(csv_path_1, index=False)

if __name__ == "__main__":
    main()

