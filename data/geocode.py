import googlemaps
import pandas as pd
import numpy as np

gmaps = googlemaps.Client(key='AIzaSyDp-LsNg9RusqlMLx2K9_VXXWudUk2-d6c')

csv_input = pd.read_csv('pipelinesurveydata.csv', encoding="ISO-8859-1")

csv_input['Full Address'] = csv_input['street_address_1'] + ", " + \
    csv_input['org_city'] + ", " + \
    csv_input['org_state'] + " " + csv_input['zip_code']


for index, row in csv_input.iterrows():
    result = gmaps.geocode(row['Full Address'])
    print(result[0]['geometry']['location']['lat'])
