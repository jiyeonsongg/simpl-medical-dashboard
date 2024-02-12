import psycopg2
import pandas as pd

def process_hr_table(conn):
    heart_rate_item_ids = [211, 220045, 220046, 220047, 220048, 220049]

    heart_rate_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS heart_rate_label,
        ce.itemid,
        ce.valuenum
    FROM
        chartevents ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid IN ({', '.join(map(str, heart_rate_item_ids))})'''

    heart_rate_data = pd.read_sql_query(heart_rate_query, conn)

    if heart_rate_data.empty:
        print("No data found. Check your query and data.")
    else:
        chartevents_hr_df = heart_rate_data.pivot_table(
            index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
            columns='heart_rate_label',
            values='valuenum',
            aggfunc='first'  
        ).reset_index()

        chartevents_hr_df.columns = [''.join(col).strip() for col in chartevents_hr_df.columns.values]

      
    return chartevents_hr_df



def process_other_hr_table(table_suffix, conn):
    table_name = f'chartevents_{table_suffix}'

    heart_rate_item_ids = [211, 220045, 220046, 220047, 220048, 220049]

    heart_rate_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS heart_rate_label,
        ce.itemid,
        ce.valuenum
    FROM
        {table_name} ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid IN ({', '.join(map(str, heart_rate_item_ids))})'''

    heart_rate_data = pd.read_sql_query(heart_rate_query, conn)

    if heart_rate_data.empty:
        print(f"No data found for {table_name}. Check your query and data.")
        return None

    chartevents_hr_df = heart_rate_data.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='heart_rate_label',
        values='valuenum',
        aggfunc='first'  
    ).reset_index()

  
    essential_columns = ['subject_id', 'hadm_id', 'icustay_id', 'charttime']
    hr_columns = [col for col in chartevents_hr_df.columns if col not in essential_columns]

   
    if not hr_columns:
        print(f"No heart rate columns found for {table_name}. Check your data.")
        return chartevents_hr_df

    chartevents_hr_df['HR_combined'] = chartevents_hr_df[hr_columns].bfill(axis=1).iloc[:, 0]

    return chartevents_hr_df



def main():
    # Make sure to update inputs to match your Postgres server
    conn = psycopg2.connect(
        host="localhost",
        database="mimic",
        user="postgres"
        #, password = [your password],
        # port = 5432 [change to postgres port]
    )

    hr_df = process_hr_table(conn)
    chartevents_3_hr_df = process_other_hr_table(3, conn)
    chartevents_12_hr_df = process_other_hr_table(12, conn)
   

    csv_path_1 = 'chartevents_hr.csv'
    csv_path_2 =  'chartevents_3_hr.csv'
    csv_path_3 = 'chartevents_12_hr.csv'

    hr_df.to_csv(csv_path_1, index=False)
    chartevents_3_hr_df.to_csv(csv_path_2, index=False)
    chartevents_12_hr_df.to_csv(csv_path_3, index=False)



if __name__ == "__main__":
    main()
    