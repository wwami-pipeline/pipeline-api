import pandas as pd

csv_input = pd.read_csv('pipelinesurveydata.csv')

csv_input['Full Address'] = csv_input['street_address_1'] + ", " + csv_input['org_city'] + ", " + csv_input['org_state'] + " " + csv_input['zip_code']

csv_input.to_csv('output.csv', index=False)

