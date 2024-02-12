import psycopg2
import pandas as pd

def process_chartevents_wbc_table(conn, table_suffix=None):
    if table_suffix is None:
        table_name = 'chartevents'
    else:
        table_name = f'chartevents_{table_suffix}'

    wbc_item_ids = [1542, 861, 1127, 8614, 8615]

    wbc_query = f'''SET search_path TO mimiciii;
    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS wbc_label,
        ce.itemid,
        ce.valuenum
    FROM
        {table_name} ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        ce.itemid IN ({', '.join(map(str, wbc_item_ids))})'''

    wbc_data = pd.read_sql_query(wbc_query, conn)

    if wbc_data.empty:
        print(f"No white blood cell count data found for {table_name}. Check your query and data.")
        return None

    chartevents_wbc_df = wbc_data.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='wbc_label',
        values='valuenum',
        aggfunc='first'  
    ).reset_index()


    essential_columns = ['subject_id', 'hadm_id', 'icustay_id', 'charttime']
    wbc_columns = [col for col in chartevents_wbc_df.columns if col not in essential_columns]

    if not wbc_columns:
        print(f"No white blood cell count columns found for {table_name}. Check your data.")
        return None

    chartevents_wbc_df['WBC_combined'] = chartevents_wbc_df[wbc_columns].bfill(axis=1).iloc[:, 0]

    return chartevents_wbc_df


def main():
# Make sure to update inputs to match your Postgres server
    conn = psycopg2.connect(
        host="localhost",
        database="mimic",
        user="postgres"
        #, password = [your password],
        # port = 5432 [change to postgres port]
    )

    wbc_df = process_chartevents_wbc_table(conn)
    chartevents_7_wbc_df = process_chartevents_wbc_table(conn, 7)
    chartevents_8_wbc_df = process_chartevents_wbc_table(conn, 8)

    csv_path_1 = 'chartevents_wbc.csv'
    csv_path_2 =  'chartevents_7_wbc.csv'
    csv_path_3 = 'chartevents_8_wbc.csv'

    # Save the DataFrame to CSV
    wbc_df.to_csv(csv_path_1, index=False)
    chartevents_7_wbc_df.to_csv(csv_path_2, index=False)
    chartevents_8_wbc_df.to_csv(csv_path_3, index=False)


if __name__ == "__main__":
    main()