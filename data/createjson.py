import pandas as pd
import json
import numpy as np
import googlemaps

gmaps = googlemaps.Client(key='AIzaSyDp-LsNg9RusqlMLx2K9_VXXWudUk2-d6c')


csv_input = pd.read_csv('pipelinesurveydata.csv', encoding="ISO-8859-1")

csv_input['Full Address'] = csv_input['street_address_1'] + ", " + \
    csv_input['org_city'] + ", " + \
    csv_input['org_state'] + " " + csv_input['zip_code']

j = []
org = {}
csv_input = csv_input.fillna('')
for index, row in csv_input.iterrows():
    result = gmaps.geocode(row['Full Address'])
    org['OrgID'] = row['participant_id']
    org['OrgTitle'] = row['org_name']
    org['OrgWebsite'] = row['org_website']
    org['StreetAddress'] = row['street_address_1']
    org['City'] = row['org_city']
    org['State'] = row['org_state']
    org['ZipCode'] = row['zip_code']
    org['Phone'] = row['org_phone_number']
    org['Email'] = row['org_email']
    org['ActivityDesc'] = row['description']
    org['Lat'] = result[0]['geometry']['location']['lat']
    org['Long'] = result[0]['geometry']['location']['lng']
    org['HasShadow'] = bool(row['has_shadow'] == 1)
    org['HasCost'] = bool(row['has_cost'] == 1)
    org['HasTransport'] = bool(row['provides_transportation'] == 1)
    org['Under18'] = bool(row['age_requirement___under_18'] == 1)
    careers = []
    if row['career_emp___medicine'] == 1:
        careers.append("Medicine")
    if row['career_emp___nursing'] == 1:
        careers.append("Nursing")
    if row['career_emp___dentistry'] == 1:
        careers.append("Dentistry")
    if row['career_emp___pharmacy'] == 1:
        careers.append("Pharmacy")
    if row['career_emp___social_work'] == 1:
        careers.append("Social Work")
    if row['career_emp___public_health'] == 1:
        careers.append("Public Health")
    if row['career_emp___gen_health_sci'] == 1:
        careers.append("Generic Health Sciences")
    if row['career_emp___allied_health'] == 1:
        careers.append("Allied Health")
    if row['career_emp___stem'] == 1:
        careers.append("STEM")
    if (len(row['career_emp_other']) > 0):
        careers.append(row['career_emp_other'])
    org['CareerEmp'] = careers
    gradeLevels = []
    if row['target_school_age___middle'] == 1:
        gradeLevels.extend((6, 7, 8))
    if row['target_school_age___highschool'] == 1:
        gradeLevels.extend((9, 10, 11, 12))
    org['GradeLevels'] = gradeLevels
    j.append(org)
    org = {}

with open('orgs.json', 'w') as outfile:
    json.dump(j, outfile)
