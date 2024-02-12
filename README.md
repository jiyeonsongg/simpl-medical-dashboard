# UCSD DSC180B Capstone Project (Winter 2024)
## Description 

Our project focuses on creating a comprehensive dashboard for predicting sepsis risk in MIMIC-III patients. Instead of treating symptoms in isolation, we adopt a holistic approach that considers the complex relationships between various medical conditions. Using Latent Class Analysis, we classify ICU patients into seven distinct subgroups, each representing a unique health profile, defined by features such as age, pre-existing conditions, previous procedures, vitals, and more. While our model uses the traditional approach of monitoring patient vitals to predict sepsis risk, we combine the knowledge of comorbidity subgroups in the data to target certain vitals for more accurate prediction. Our dashboard aims to visualize our model's function as well as the patient's profile in relation to our predicted sepsis score to enhance medical professionals' assessment of sepsis risk in the ICU. 



## Contributions
- Jiyeon Song: jis036@ucsd.edu
- Oakkar Aung: oaaung@ucsd.edu
- Rihana Mohamed: rmohamed@ucsd.edu
- Vibha Sastry: vsastry@ucsd.edu
- Mentor: Professor Kyle Shannon: kshannon@ucsd.edu

### dashboard_website


### machine_learning

### statistical_analysis

### environment setup for data_extraction
create a new virtual environment with the command prompt using 
`python -m dsc180b dsc180b_wi24_quarter2`

Once you have activated your environment, install all required packages using the following command: 
`pip install -r requirements.txt`

Deactivate the environment when all done: 
`deactivate`

### data_extraction
- Run the following lines to produce data in processed_data folder:
    `python chartevents_bp.py`
    `python chartevents_hr.py`
    `python chartevents_o2sat.py`
    `python chartevents_rr.py`
    `python chartevents_temp.py`
    `python chartevents_wbc.py`
- Other files:
    - data_processing.ipynb: Data processing code
    - eda_subgroups: EDA on vitals data




 

