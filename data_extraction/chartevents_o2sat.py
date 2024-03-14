import psycopg2
import pandas as pd

def process_o2sat_table(conn):
    o2sat_item_id = 646

    o2sat_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS o2sat_label,
        ce.itemid,
        ce.valuenum
    FROM
        chartevents ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid = {o2sat_item_id}'''

    o2sat_data = pd.read_sql_query(o2sat_query, conn)


    if o2sat_data.empty:
        print("No oxygen saturation data found. Check your query and data.")
        return None

    chartevents_o2sat_df = o2sat_data.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='o2sat_label',
        values='valuenum',
        aggfunc='first'  
    ).reset_index()

    
    return chartevents_o2sat_df

def process_other_o2sat_table(table_suffix, conn):
    o2sat_item_id = 646

    o2sat_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS o2sat_label,
        ce.itemid,
        ce.valuenum
    FROM
        chartevents_{table_suffix} ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid = {o2sat_item_id}'''


    o2sat_data = pd.read_sql_query(o2sat_query, conn)


    if o2sat_data.empty:
        print("No oxygen saturation data found. Check your query and data.")
        return None

    chartevents_o2sat_df = o2sat_data.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='o2sat_label',
        values='valuenum',
        aggfunc='first' 
    ).reset_index()

    
    return chartevents_o2sat_df


def main():
# Make sure to update inputs to match your Postgres server
    conn = psycopg2.connect(
        host="localhost",
        database="mimic",
        user="postgres"
        #, password = [your password],
        # port = 5432 [change to postgres port]
    )

    o2sat_df = process_o2sat_table(conn)
    chartevents_6_o2sat_df = process_other_o2sat_table(6, conn)

    csv_path_1 = '../processed_data/chartevents_o2sat.csv'
    csv_path_2 =  '../processed_data/chartevents_6_o2sat.csv'
  
    o2sat_df.to_csv(csv_path_1, index=False)
    chartevents_6_o2sat_df.to_csv(csv_path_2, index=False)



if __name__ == "__main__":
    main()