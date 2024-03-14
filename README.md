# UCSD DSC180B Capstone Project (Winter 2024)
## Description 

Our project focuses on creating a comprehensive dashboard for predicting sepsis risk in MIMIC-III patients. Instead of treating symptoms in isolation, we adopt a holistic approach that considers the complex relationships between various medical conditions. Using Latent Class Analysis, we classify ICU patients into seven distinct subgroups, each representing a unique health profile, defined by features such as age, pre-existing conditions, previous procedures, vitals, and more. While our model uses the traditional approach of monitoring patient vitals to predict sepsis risk, we combine the knowledge of comorbidity subgroups in the data to target certain vitals for more accurate prediction. Our dashboard aims to visualize our model's function as well as the patient's profile in relation to our predicted sepsis score to enhance medical professionals' assessment of sepsis risk in the ICU. 


## Contributions
- Jiyeon Song: jis036@ucsd.edu
- Oakkar Aung: oaaung@ucsd.edu
- Rihana Mohamed: rmohamed@ucsd.edu
- Vibha Sastry: vsastry@ucsd.edu
- Mentor: Professor Kyle Shannon: kshannon@ucsd.edu

### Accessing Data 
MIMIC-III Access
Create PhysioNet Account and CITI Program Account.
Follow instructions to complete "CITI Data or Specimens Only Research" course with over 90 percent pass rate.
Upload course report to PhysioNet under training tab.
Apply for credentialing on PhysioNet and wait 1 day to 3 weeks for approval.
Sign "Data Use Agreement" and then have access to data.
MIMIC-III Local Database Setup
We created the MIMIC-III Local Database following the instructions provided by MIT-LCP (Laboratory of Computer Physiology) found here.

Data Prep and Processing
Place raw MIMIC data for MIMIC-III dataset into the raw_data folder. Run selected_datasets.sql to process data and keep processed data in the processed_data folder.

### dashboard_website
Consists of HTML files for each page in the dashboard, and data for display.
Link to the Medical Dashboard: 

### machine_learning
consists of the machine learning models used to predict subgroup and predict sepsis risk 
- 01_subgroup_likelihood: uses XGBoost to calculate the likelihood of a patient being in its assigned subgroup
- 02_sepsis_risk_classification_subgroup: uses random forest classifier to create models for each subgroup
- 03_sepsis_risk_classification_all_population: uses random forest classifier to create models for the entire patient population

### statistical_analysis
Each statistical analysis file requires different R libraries. Make sure to install the right libraries before running the code.

Example of _01_lca_subgroups:_
1. `install.packages("poLCA")`
2. `library poLCA`
3. Run the code

### environment setup for data_extraction
Create a new virtual environment with the command prompt using<br>
`python -m dsc180b dsc180b_wi24_quarter2`

Once you have activated your environment, install all required packages using the following command: <br>
`pip install -r requirements.txt`

Deactivate the environment when all done: <br>
`deactivate`

### data_extraction
- Run the following lines to produce data in processed_data folder:<br>
    `python chartevents_bp.py`<br>
    `python chartevents_hr.py`<br>
    `python chartevents_o2sat.py`<br>
    `python chartevents_rr.py`<br>
    `python chartevents_temp.py`<br>
    `python chartevents_wbc.py`<br>
- Other files:
    - 01_data_processing.ipynb: Data processing code
    - 03_eda_vitals: EDA on vitals data




 

