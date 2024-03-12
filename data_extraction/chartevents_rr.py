import psycopg2
import pandas as pd

def process_chartevents_rr(conn):
    # Replace 'your_conn' with your actual database connection
    chart_events_rr_query = '''
    SET search_path TO mimiciii;

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
        di.label ILIKE 'Respiratory Rate%'
        AND ce.valuenum IS NOT NULL;
    '''

    chartevents_rr = pd.read_sql_query(chart_events_rr_query, conn)

    chartevents_rr_df = chartevents_rr.pivot_table(
        index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
        columns='item_label',
        values='valuenum',
        aggfunc='first'
    ).reset_index()

    chartevents_rr_df.columns = [''.join(col).strip() for col in chartevents_rr_df.columns.values]

    # Combine respiratory rate columns
    chartevents_rr_df['RespiratoryRate_combined'] = (
        chartevents_rr_df['Respiratory Rate']
        .combine_first(chartevents_rr_df['Respiratory Rate (Set)'])
        .combine_first(chartevents_rr_df['Respiratory Rate (Total)'])
        .combine_first(chartevents_rr_df['Respiratory Rate (spontaneous)'])
        .combine_first(chartevents_rr_df['Respiratory Rate Set'])
    )
    return chartevents_rr_df

def process_other_rr_table(table_name, conn):
    # Construct the query for respiratory rates
    respiratory_rate_query = f'''
    SET search_path TO mimiciii;

    SELECT
        ce.subject_id,
        ce.hadm_id,
        ce.icustay_id,
        ce.charttime,
        di.label AS item_label,
        di.unitname AS measurement_type,
        di.dbsource AS label_meaning,
        ce.valuenum
    FROM
        {table_name} ce
    JOIN
        d_items di ON ce.itemid = di.itemid
    WHERE
        di.label ILIKE 'Respiratory Rate%'
        AND ce.valuenum IS NOT NULL;
    '''

    # Execute the query
    respiratory_rate_df = pd.read_sql_query(respiratory_rate_query, conn)

    if respiratory_rate_df.empty:
        print(f"{table_name} has no rr values")

    else:

        # Pivot the table
        respiratory_rate_df = respiratory_rate_df.pivot_table(
            index=['subject_id', 'hadm_id', 'icustay_id', 'charttime'],
            columns='item_label',
            values='valuenum',
            aggfunc='first'
        ).reset_index()

        # Rename columns to remove multi-level indexing
        respiratory_rate_df.columns = [''.join(col).strip() for col in respiratory_rate_df.columns.values]

        # Combine respiratory rate columns dynamically
        respiratory_rate_cols = [col for col in respiratory_rate_df.columns if 'Respiratory Rate' in col]
        respiratory_rate_df['RespiratoryRate_combined'] = respiratory_rate_df[respiratory_rate_cols].bfill(axis=1).iloc[:, 0]

        # Drop unnecessary columns
    #respiratory_rate_df.drop(respiratory_rate_cols, axis=1, inplace=True)

        # Impute missing values if needed
        respiratory_rate_df['RespiratoryRate_combined'] = respiratory_rate_df['RespiratoryRate_combined']

        return respiratory_rate_df



def main():
    # Make sure to update inputs to match your Postgres server
    conn = psycopg2.connect(
        host="localhost",
        database="mimic",
        user="postgres"
        #, password = [your password],
        # port = 5432 [change to postgres port]
    )

    rr_df = process_chartevents_rr(conn)
    chartevents_5_rr_df = process_other_rr_table('chartevents_5', conn)
    chartevents_12_rr_df = process_other_rr_table("chartevents_12", conn)
    chartevents_15_rr_df = process_other_rr_table('chartevents_15', conn)

    csv_path_1 = '../processed_data/chartevents_rr.csv'
    csv_path_2 =  '../processed_data/chartevents_5_rr.csv'
    csv_path_3 = '../processed_data/chartevents_12_rr.csv'
    csv_path_4 = '../processed_data/chartevents_15_rr.csv'

    rr_df.to_csv(csv_path_1, index=False)
    chartevents_5_rr_df.to_csv(csv_path_2, index=False)
    chartevents_12_rr_df.to_csv(csv_path_3, index=False)
    chartevents_15_rr_df.to_csv(csv_path_4, index=False)



if __name__ == "__main__":
    main()



    




