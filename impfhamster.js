var jsonData = $.ajax({
  url: "impfhamster.json",
  dataType: "json",
}).done(function (data) {
  /*data['HH']['biontech'].forEach(element => {
        labels.append(element);
    });
*/
for (const bundesland of Object.keys(data).sort()) {
  //bundesland='HH';
  var $h2=$('<h2>').text(bundesland);
  $('.content').append($h2);

  impfstoffe = ["astra", "biontech", "moderna"];
  impfstoffe.forEach(function (impfstoff) {
    labels = [];
    hhdata = [];
    impfungen = [];
    liefertag = [];
      for (const date of Object.keys(data[bundesland][impfstoff]).sort()) {
          const values=data[bundesland][impfstoff][date];
          if (values.geliefert>0) {
            labels.push(date);
            hhdata.push(values.lager);
            liefertag.push(values.gestern_geliefert);
            impfungen.push(values.verimpft_gestern);
          }
    }
    console.log(hhdata);
    var $div=$('<div>',{class:'chart'});
    $('.content').append($div);

    var $canvas=$('<canvas>',{id:bundesland+"_"+impfstoff});
    $div.append($canvas);
    var myChart = new Chart($canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Lagerbestand " + bundesland+ ' '+impfstoff,
            borderColor: "red",
            fill: false,
            data: hhdata,
          },
          {
            label: "Impfungen pro Tag " +bundesland+' mit '+ impfstoff,
            borderColor: "green",
            data: impfungen,
          },
          {
              label:"Lieferungen pro Tag "+bundesland+' mit '+ impfstoff,
              type: 'bar',
              backgroundColor: "orange",
              fill: false,
              data: liefertag,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        /*scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
*/
      },
    });
  });
}
});
