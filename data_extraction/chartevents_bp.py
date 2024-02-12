import psycopg2
import pandas as pd

def process_chartevents_bp(conn):
    blood_pressure_item_ids = [220179, 51, 6701, 455, 442, 220050]

    blood_pressure_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS blood_pressure_label,
        ce.itemid,
        ce.valuenum
    FROM
        chartevents ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid IN ({', '.join(map(str, blood_pressure_item_ids))})'''

    blood_pressure_data = pd.read_sql_query(blood_pressure_query, conn)

    conn.close()

    if blood_pressure_data.empty:
        print("No data found. Check your query and data.")
    else:
        chartevents_bp_df = blood_pressure_data.pivot_table(
            index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
            columns='blood_pressure_label',
            values='valuenum',
            aggfunc='first'  
        ).reset_index()

        chartevents_bp_df.columns = [''.join(col).strip() for col in chartevents_bp_df.columns.values]

    essential_columns = ['subject_id', 'hadm_id', 'icustay_id', 'charttime']
    bp_columns = [col for col in chartevents_bp_df.columns if col not in essential_columns]
    chartevents_bp_df['BP_combined'] = chartevents_bp_df[bp_columns].bfill(axis=1).iloc[:, 0]


    return chartevents_bp_df

def process_other_bp_table(conn, table_suffix):
    
    table_name = f'chartevents_{table_suffix}'

    blood_pressure_item_ids = [220179, 51, 6701, 455, 442, 220050]

    blood_pressure_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS blood_pressure_label,
        ce.itemid,
        ce.valuenum
    FROM
        {table_name} ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid IN ({', '.join(map(str, blood_pressure_item_ids))})'''


    blood_pressure_data = pd.read_sql_query(blood_pressure_query, conn)

    if blood_pressure_data.empty:
        print(f"No data found for {table_name}. Check your query and data.")
        return None

    chartevents_bp_df = blood_pressure_data.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='blood_pressure_label',
        values='valuenum',
        aggfunc='first'  
    ).reset_index()

    essential_columns = ['subject_id', 'hadm_id', 'icustay_id', 'charttime']
    bp_columns = [col for col in chartevents_bp_df.columns if col not in essential_columns]


    if not bp_columns:
        print(f"No blood pressure columns found for {table_name}. Check your data.")
        return chartevents_bp_df

    chartevents_bp_df['BP_combined'] = chartevents_bp_df[bp_columns].bfill(axis=1).iloc[:, 0]

    return chartevents_bp_df



def main():
    # Make sure to update inputs to match your Postgres server
    conn = psycopg2.connect(
        host="localhost",
        database="mimic",
        user="postgres"
        #, password = [your password],
        # port = 5432 [change to postgres port]
    )

    bp_df = process_chartevents_bp(conn)
    chartevents_1_bp_df = process_other_bp_table(1, conn)
    chartevents_4_bp_df = process_other_bp_table(4, conn)
    chartevents_10_bp_df = process_other_bp_table(10, conn)
    chartevents_12_bp_df = process_other_bp_table(12, conn)

    csv_path_1 = 'chartevents_bp.csv'
    csv_path_2 =  'chartevents_1_bp.csv'
    csv_path_3 = 'chartevents_4_bp.csv'
    csv_path_4 = 'chartevents_10_bp.csv'
    csv_path_5 = 'chartevents_12_bp.csv'

    bp_df.to_csv(csv_path_1, index=False)
    chartevents_1_bp_df.to_csv(csv_path_2, index=False)
    chartevents_4_bp_df.to_csv(csv_path_3, index=False)
    chartevents_10_bp_df.to_csv(csv_path_4, index=False)
    chartevents_12_bp_df.to_csv(csv_path_5, index=False)



if __name__ == "__main__":
    main()
    
