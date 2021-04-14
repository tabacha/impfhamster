var bundesland_lang = {
  BW: "Baden-Württemberg",
  BY: "Bayern",
  BE: "Berlin",
  BB: "Brandenburg",
  HB: "Bremen",
  HH: "Hamburg",
  HE: "Hessen",
  MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen",
  NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz",
  SL: "Saarland",
  SN: "Sachsen",
  ST: "Sachsen-Anhalt",
  SH: "Schleswig-Holstein",
  TH: "Thüringen",
};
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
    var $a_name = $("<a>").attr("name", bundesland);
    var $h2 = $("<h2>").text(bundesland_lang[bundesland]);
    $a_name.append($h2);
    $(".content").append($a_name);

    deutschland_lager = [];
    deutschland_liefertag = [];
    deutschland_impfungen = [];
    impfstoffe = ["astra", "biontech", "moderna"];
    bundeland_lager = [];
    alldates = [];
    impfstoffe.forEach(function (impfstoff) {
      labels = [];
      hhdata = [];
      impfungen = [];
      liefertag = [];
      bundeland_lager[impfstoff] = [];
      deutschland_lager[impfstoff] = [];
      deutschland_liefertag[impfstoff] = [];
      deutschland_impfungen[impfstoff] = [];
      for (const date of Object.keys(data[bundesland][impfstoff]).sort()) {
        const values = data[bundesland][impfstoff][date];
        if (values.geliefert > 0) {
          labels.push(date);
          hhdata.push(values.lager);
          if (!(date in deutschland_lager[impfstoff])) {
            deutschland_lager[impfstoff][date] = 0;
          }
          if (!(date in deutschland_liefertag[impfstoff])) {
            deutschland_liefertag[impfstoff][date] = 0;
          }
          if (!(date in deutschland_impfungen[impfstoff])) {
            deutschland_impfungen[impfstoff][date] = 0;
          }
          deutschland_lager[impfstoff][date] =
            deutschland_lager[impfstoff][date] + values.lager;
          deutschland_liefertag[impfstoff][date] =
            deutschland_liefertag[impfstoff][date] + values.gestern_geliefert;
          liefertag.push(values.gestern_geliefert);
          impfungen.push(values.verimpft_gestern);
          bundeland_lager[impfstoff][date] = parseFloat(values.reichtTage);
          alldates.push(date);
          deutschland_impfungen[impfstoff][date] =
            deutschland_impfungen[impfstoff][date] + values.verimpft_gestern;
        }
      }
      $(".content").append($("<h3>").text("Lieferung mit " + impfstoff));
      var $div = $("<div>", { class: "chart" });
      $(".content").append($div);

      var $canvas = $("<canvas>", { id: bundesland + "_" + impfstoff });
      $div.append($canvas);
      var myChart = new Chart($canvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Lagerbestand " + bundesland + " " + impfstoff,
              borderColor: "red",
              fill: false,
              data: hhdata,
            },
            {
              label: "Impfungen pro Tag " + bundesland + " mit " + impfstoff,
              borderColor: "green",
              data: impfungen,
            },
            {
              label: "Lieferungen pro Tag " + bundesland + " mit " + impfstoff,
              type: "bar",
              backgroundColor: "orange",
              fill: false,
              data: liefertag,
            },
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
    $(".content").append(
      $("<h3>").text(
        "Wie lange reicht das Lager (bei gleicher Impfgeschwindigkeit der letzten 7 Tage)?"
      )
    );
    var $div = $("<div>", { class: "chart" });
    $(".content").append($div);
    dates = Array.from(new Set(alldates)).sort();
    databl = {};
    dates.forEach(function (date) {
      impfstoffe.forEach(function (impfstoff) {
        if (!(impfstoff in databl)) {
          databl[impfstoff] = [];
        }
        if (!(date in bundeland_lager[impfstoff])) {
          bundeland_lager[impfstoff][date] = 0;
        }
        databl[impfstoff].push(bundeland_lager[impfstoff][date]);
      });
    });
    var $canvas = $("<canvas>", { id: bundesland + "_lagerbestand" });

    $div.append($canvas);
    var myChart = new Chart($canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Lagerbestand " + bundesland + "  Astra ",
            borderColor: "red",
            fill: false,
            data: databl["astra"],
          },
          {
            label: "Lagerbestand  " + bundesland + " Biontech",
            borderColor: "green",
            fill: false,
            data: databl["biontech"],
          },
          {
            label: "Lagerbestand " + bundesland + " Moderna",
            borderColor: "blue",
            fill: false,
            data: databl["moderna"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Reicht für x Tage Impfen",
              },
              type: "logarithmic",

              ticks: {
                min: 0,
                max: 365,
              },
            },
          ],
        },
      },
    });
  } // for
/*
  var $a_name = $("<a>").attr("name", "DE");
  var $h2 = $("<h2>").text("Deutschland");
  $a_name.append($h2);
  $(".content").append($a_name);

  impfstoffe.forEach(function (impfstoff) {
    lager = [];
    labels = [];
    lieferungen = [];
    impfungen = [];
    for (const date of Object.keys(deutschland_lager[impfstoff]).sort()) {
      lager.push(deutschland_lager[impfstoff][date]);
      labels.push(date);
      lieferungen.push(deutschland_liefertag[impfstoff][date]);
      impfungen.push(deutschland_impfungen[impfstoff][date]);
    }
    $(".content").append($("<h3>").text("Lieferung mit " + impfstoff));
    var $div = $("<div>", { class: "chart" });
    $(".content").append($div);
    var $canvas = $("<canvas>", { id: "deutschland_" + impfstoff });
    $div.append($canvas);
    var myChart = new Chart($canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Lagerbestand " + " " + impfstoff,
            borderColor: "red",
            fill: false,
            data: lager,
          },
          {
            label: "Impfungen pro Tag mit " + impfstoff,
            borderColor: "green",
            data: impfungen,
          },
          {
            label: "Lieferungen pro Tag mit " + impfstoff,
            type: "bar",
            backgroundColor: "orange",
            fill: false,
            data: lieferungen,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

      },
    });
  }); // foreach
  */
}); // ajax
