#!/usr/bin/python3
import sys
from datetime import datetime
from datetime import timedelta
import json
impfmenge={}
sum_impfmenge={}

def add_impfstofflieferung(date,impfstoff,bundesland,delta):
    if impfstoff== 'comirnaty':
        impfstoff='biontech'

    if not bundesland in impfmenge:
        impfmenge[bundesland]={}
        sum_impfmenge[bundesland]={}
        impfungen[bundesland]={}
        #print(bundesland)

    if not impfstoff in impfmenge[bundesland]:
        impfmenge[bundesland][impfstoff]={}
        impfungen[bundesland][impfstoff]={}
        sum_impfmenge[bundesland][impfstoff]=0
        #print(impfstoff)

    if date in impfmenge[bundesland][impfstoff]:
        print('Doppeltes Datum %s %s %s' % (date, impfstoff, bundesland))
    sum_impfmenge[bundesland][impfstoff] = sum_impfmenge[bundesland][impfstoff] + delta
    impfmenge[bundesland][impfstoff][date] = sum_impfmenge[bundesland][impfstoff]

impfungen={}

def add_impfung(date,bundesland,impfstoff,value):
    if impfstoff== 'astrazeneca':
        impfstoff='astra'

    if date in impfungen[bundesland][impfstoff]:
        sys.exit('Doppeltes Datum')
    impfungen[bundesland][impfstoff][date]=value

LIEFER_FILE='germany_deliveries_timeseries_v2.tsv'
f = open(LIEFER_FILE, 'r')
headline=f.readline().rstrip()
if (headline != 'date\timpfstoff\tregion\tdosen'):
    sys.exit('headline LIEFER_FILE wrong')

for line in f.readlines():
    (date,impfstoff,bundesland,delta)=line.rstrip().split('\t')
    bundesland=bundesland.replace('DE-','')
    add_impfstofflieferung(date,impfstoff,bundesland,int(delta))

f.close()
IMPFUNG_FILE='all.csv'
f = open( IMPFUNG_FILE, 'r')
headline = f.readline().rstrip()
if (headline != 'date,publication_date,region,metric,value'):
    sys.exit('headline IMPFUNG_FILE wrong')

for line in f.readlines():
    (date,publication_date,region,metric,value) = line.rstrip().split(',')

    if region != 'DE' and metric in ['dosen_moderna_kumulativ','dosen_astrazeneca_kumulativ','dosen_biontech_kumulativ']:
        add_impfung(date,region,metric.split('_')[1],int(value))

#print(impfmenge.keys())
out={}
for bundesland in impfmenge.keys():
    out[bundesland]={}
    for impfstoff in impfmenge[bundesland].keys():
        date=datetime.strptime('2020-12-26', '%Y-%m-%d')
        out[bundesland][impfstoff]={}
        enddate=datetime.now()
        impfm=0
        impf=0
        oldimpf=0
        oldGeliefert=0
        amTagGeimpft7day=[0,0,0,0,0,0,0]
        while (date<enddate):
            datestr=date.strftime('%Y-%m-%d')
            if datestr in impfmenge[bundesland][impfstoff].keys():
                impfm=impfmenge[bundesland][impfstoff][datestr]
            if datestr in impfungen[bundesland][impfstoff].keys():
                impf=impfungen[bundesland][impfstoff][datestr]
            amTagGeimpft=impf-oldimpf
            amTagGeimpft7day.pop(0)
            amTagGeimpft7day.append(amTagGeimpft)
            impfschnitt=(sum(amTagGeimpft7day)/7.0)
            if (impfschnitt!=0):
                reicht_fuer="%.1f" %((impfm-impf)/impfschnitt)
            else:
                reicht_fuer=0
            out[bundesland][impfstoff][datestr]={
                'geliefert':impfm,
                'gestern_geliefert':(impfm-oldGeliefert),
                'verimpft':impf,
                'verimpft_gestern':amTagGeimpft,
                'wochen_impfschnitt':impfschnitt,
                'lager':impfm-impf,
                'reichtTage':reicht_fuer
            }
            #print("%s %s %s %d %d" % (bundesland, impfstoff, date, impfm, impf))
            oldimpf=impf
            oldGeliefert=impfm
            date=date+timedelta(days=1)
OUTFILE= "impfhamster.json"
outfile=open(OUTFILE, "w")
json.dump(out, outfile)
outfile.close()