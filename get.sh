#!/bin/bash
rm germany_deliveries_timeseries_v2.tsv all.csv
wget https://impfdashboard.de/static/data/germany_deliveries_timeseries_v2.tsv
#wget https://impfdashboard.de/static/data/germany_vaccinations_by_state.tsv
wget https://raw.githubusercontent.com/ard-data/2020-rki-impf-archive/master/data/9_csv_v2/all.csv
