//SOURCE FILES FOR LAYERS//
          var parcelSource = new ol.source.GeoJSON({
              url:'Epsom/Parcel14.geojson'
            });

          var zoneSource = new ol.source.GeoJSON({
            url:'Epsom/Zoning_pol.geojson'
          });

          var waterSource = new ol.source.GeoJSON({
            url:'Epsom/Water_pol.geojson'
          });

          var femaSource = new ol.source.GeoJSON({
            url:'Epsom/FEMA_Area.geojson'
          });

          var mapExtent = parcelSource.getExtent();

  //CREATE LAYERS FROM EACH SOURCE TO BE ADDED TO MAP//
      //Parcels layer
          var parcelsStyleCache = {};
          var parcels = new ol.layer.Vector({
            preload: Infinity,
            source:parcelSource,
            class: 'Parcels',
            style: function(feature, resolution) {
              var text = resolution*2000 < 5500 ? feature.get('pidLabel') : '';
                if (!parcelsStyleCache[text]) {
                  parcelsStyleCache[text] =[
                      new ol.style.Style({
                        stroke: new ol.style.Stroke({
                          color: 'rgba(0, 0, 0, 1)',
                          width: 1 
                        })
                        ,
                        text: new ol.style.Text({
                          font: '12px Calibri,sans-serif',
                          text: text,
                          fill: new ol.style.Fill({
                            color: '#000'
                          })
                        })
                        ,
                        zIndex: 2
                      })
                      ,
                      new ol.style.Style({
                        stroke: new ol.style.Stroke({
                          color: 'rgba(255, 255, 255, 1)',
                          width: 4
                        }),
                        fill: new ol.style.Fill({
                          color: 'rgba(156, 198, 182, 0.1)'
                        }),
                        zIndex: 1
                      })
                  ];
                }
                return parcelsStyleCache[text];
            }
          });
      //Zoning layer
          var rcStyleCache = {};
          var rlcStyleCache = {};
          var zoning = new ol.layer.Vector({
            preload: Infinity,
            source:zoneSource,
            class: 'Zoning',
            style: function(feature, resolution) {
              var text = resolution*2000 < 5500 ? feature.get('Zone_Label') : '';
              if(feature.get('Zone_Label') === 'R/C'){
                    var rcStyleCache = [
                        new ol.style.Style({
                              text: new ol.style.Text({
                                font: '200px Calibri,sans-serif',
                                text: text,
                                fill: new ol.style.Fill({
                                  color: 'rgba(215, 127, 44, .7)'
                                })
                              })
                              ,
                              zIndex: 2
                            }),
                        new ol.style.Style({
                              stroke: new ol.style.Stroke({
                                color: 'rgba(215, 127, 44, 1)',
                                width: 4,
                                lineDash: [9]
                              }),
                              fill: new ol.style.Fill({
                                color: 'rgba(215, 127, 44, 0.2)'
                              }),
                              zIndex: 1
                        })
                    ];
                return rcStyleCache;
              }
              if(feature.get('Zone_Label') === 'R/LC'){
                  var rlcStyleCache = [
                      new ol.style.Style({
                           text: new ol.style.Text({
                              font: '200px Calibri,sans-serif',
                              text: text,
                              fill: new ol.style.Fill({
                                color: 'rgba(215, 54, 44, 0.5)'
                              })
                            })
                            ,
                            zIndex: 2 
                      }),
                      new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'rgba(215, 54, 44, 1)',
                              width: 4,
                              lineDash: [9]
                            }),
                            fill: new ol.style.Fill({
                              color: 'rgba(215, 54, 44, 0.2)'
                            }),
                            zIndex: 1
                      })
                  ];
                return rlcStyleCache;
              }
            }          
          });
      //Flood Plain layer
          var fema = new ol.layer.Vector({
            preload: Infinity,
            source:femaSource,
            class: 'FEMA',
            visible: false,
            style: function(feature, resolution) {
              if(feature.get('FLD_ZONE') === 'AE'){
                    var rcStyleCache = [
                        new ol.style.Style({
                              stroke: new ol.style.Stroke({
                                color: 'rgba(38, 174, 199, 1)',
                                width: 4,
                                lineDash: [15]
                              }),
                              fill: new ol.style.Fill({
                                color: 'rgba(38, 174, 199, 0.6)'
                              }),
                              zIndex: 1
                        })
                    ];
                return rcStyleCache;
              }
              if(feature.get('FLD_ZONE') === '.2 pct'){
                  var rlcStyleCache = [
                      new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'rgba(0, 86, 199, 1)',
                              width: 4,
                              lineDash: [6]
                            }),
                            fill: new ol.style.Fill({
                              color: 'rgba(0, 86, 199, 0.6)'
                            }),
                            zIndex: 1,
                      })
                  ];
                return rlcStyleCache;
              }
            }          
          });
      //Town Boundary
          var townboundary = new ol.layer.Vector({
            source: new ol.source.GeoJSON({
              url:'Epsom/Town_Area.geojson'
            }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: 'color: rgba(156, 198, 182, 1);',
                width: 6
              }),
              fill: new ol.style.Fill({
                color: 'rgba(156, 198, 182, 0)'
              }),
              text: new ol.style.Text({
                color: 'black'
              })
            })
          });
      //Scale Control
          var scaleLineControl = new ol.control.ScaleLine({
                  target:'pos',
                  units:'us'
                });

  //CREATE THE MAP AND LOAD LAYERS
          var map = new ol.Map({
                target: 'map',
                layers: [
                  new ol.layer.Tile({
                    preload: Infinity,
                    // source: new ol.source.OSM()
                    source: new ol.source.MapQuest({layer: 'sat'})
                  }),
                  zoning,
                  fema,
                  parcels
                  ],
                view: new ol.View({
                  center: [-7941268, 5343917],
                  // center: [0,0],
                  // center: mapCenter,
                  zoom: 12
                }),
                controls: [
                // new ol.control.MousePosition({
                //   target:'pos'
                // }),
                scaleLineControl
                ],
                renderer: 'canvas'
          });
  //SELECTION SCRIPTS AND DISPLAY INFORMATION
          var highlight;
    //SELECTION BY PARCEL CLICK
          map.on('singleclick', function(evt) {
              displayFeatureInfo(evt.pixel);
          });

          var highlight;
          var displayFeatureInfo = function(pixel) {
            var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
              return feature;
            });

            var info = document.getElementById('info');
            if (feature) {
              info.innerHTML = '<p>' + feature.get('TownName') + ': ' + feature.get('PID') + '</p>';
            } else {
              info.innerHTML = 'No Selection Info';
            }

            if (feature !== highlight) {
              if (highlight) {
                featureMapSelectOverlay.removeFeature(highlight);
              }
              if (feature) {
                featurePIDSelectOverlay.getFeatures().clear();
                featureMapSelectOverlay.addFeature(feature);
                setTheCenter();
              }
              highlight = feature;
            }
          };

          var selectedFeatureStyleCache = {};
          var featureMapSelectOverlay = new ol.FeatureOverlay({
            map: map,
            style: function (feature, resolution) {
              var text = resolution < 5500 ? feature.get('pidLabel') : '';
                if(!selectedFeatureStyleCache[text]){
                  selectedFeatureStyleCache[text] = [new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: 'rgba(20, 174, 246, 1)',
                        width: 3
                      }),
                      zIndex: 2
                    }),

                    new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 1)',
                        width: 8
                      }),
                      text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({
                          color: '#000'
                        }),
                        stroke: new ol.style.Stroke({
                          color: '#fff',
                          width: 3
                        }),
                        text: text
                      }),
                      zIndex: 1
                    })
                ];
              }
              return selectedFeatureStyleCache[text];
            }
          });

    //SELECTION BY PID SELECT
          var selectedPIDFeatureStyleCache = {};
          var featurePIDSelectOverlay = new ol.FeatureOverlay({
            map: map,
            style: function (feature, resolution) {
              var text = resolution < 5500 ? feature.get('pidLabel') : '';
                if(!selectedPIDFeatureStyleCache[text]){
                  selectedPIDFeatureStyleCache[text] = [new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: 'rgba(20, 174, 246, 1)',
                        width: 3
                      }),
                      zIndex: 2
                    }),

                    new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 1)',
                        width: 8
                      }),
                      text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        text: text,
                        fill: new ol.style.Fill({
                          color: '#000'
                        }),
                        stroke: new ol.style.Stroke({
                          color: '#fff',
                          width: 3
                        })
                      }),
                      zIndex: 1
                    })
                ];
              }
              return selectedPIDFeatureStyleCache[text];
            }
          });


        //clear features from overlayers and add PID selected feature to overlay
        //will have to add support for multiple selection ie: queries
          function selectedFeature (id) {
            var PID = id;
            if (!PID) {
              return
            } else {
              featurePIDSelectOverlay.getFeatures().clear();
              var data = parcelSource.getFeatures();
                for (var i = 0; i < data.length; i++) {
                  if (PID === data[i].p.PID) {
                      featureMapSelectOverlay.getFeatures().clear();
                      featurePIDSelectOverlay.addFeature(data[i]);
                  } 
                  data[i];
                };
              setTheCenter();
            };
          };


        //after selection from map or PID list, get the feature, calculate center, zoom to feature
        //added pan effect for map selection and zoom+pan effect for PID selection
          var setTheCenter = function (){
            if (this.featurePIDSelectOverlay.getFeatures().getArray().length > 0){
                  console.log('have selected a PID');
                  var cordinate = this.featurePIDSelectOverlay.getFeatures().getArray()[0].p.geometry.extent;
                  var cord1 = cordinate[0];
                  var cord2 = cordinate[1];
                  var newCenterX = ((cordinate[0] + cordinate[2])/2);
                  var newCenterY = ((cordinate[1] + cordinate[3])/2);
                  var duration = 2000;
                  var pan = ol.animation.pan({
                    duration: duration,
                    source: map.getView().getCenter()
                  });
                  var bounce = ol.animation.bounce({
                    duration: duration,
                    resolution: 4 * map.getView().getResolution()
                  });
                  map.beforeRender(pan, bounce);
                  if(map.getView().getResolution() < 3) {
                    map.getView().setCenter([newCenterX, newCenterY]);
                  } else {
                    map.getView().setResolution(map.getView().getResolution()/4);
                    map.getView().setCenter([newCenterX, newCenterY]);

                  }
            } 
            if (this.featureMapSelectOverlay.getFeatures().getArray().length > 0){
                  console.log('have selection');
                  var cordinate = this.featureMapSelectOverlay.getFeatures().getArray()[0].p.geometry.extent;
                  var cord1 = cordinate[0];
                  var cord2 = cordinate[1];
                  var newCenterX = ((cordinate[0] + cordinate[2])/2);
                  var newCenterY = ((cordinate[1] + cordinate[3])/2);
                  var duration = 2000;
                  var pan = ol.animation.pan({
                    duration: duration,
                    source: map.getView().getCenter()
                  });
                  var zoom = ol.animation.zoom({
                    duration: duration,
                    resolution: map.getView().getResolution()
                  });
                  map.beforeRender(pan, zoom);
                  if (map.getView().getResolution() < 3) {
                    map.getView().setCenter([newCenterX, newCenterY]);
                  } else {
                    map.getView().setResolution(map.getView().getResolution() / 2);
                    map.getView().setCenter([newCenterX, newCenterY]);
                  }
            }
          };
  //LEGEND INTERACTION
        //PARCELS
          var parcelLegend = new ol.dom.Input(document.getElementById( 'parcelLegend'));
            parcelLegend.bindTo('checked', parcels, 'visible');
        //ZONING
          var zoneLegend = new ol.dom.Input(document.getElementById( 'zoneLegend'));
            zoneLegend.bindTo('checked', zoning, 'visible');
        //FEMA
          var femaLegend = new ol.dom.Input(document.getElementById( 'femaLegend'));
            femaLegend.bindTo('checked', fema, 'visible');
  //SCALE INTERACTION
        var scaleUnits = function (){
        //Get the current units of the scale control
          var current = scaleLineControl.getUnits();
        //Switch between units on click
          switch (current){
            case 'us':
              scaleLineControl.setUnits('metric');
              // var current = 'metric';
              break;
            case 'metric':
              scaleLineControl.setUnits('imperial');
              // var current = 'imperial';
              break;
            case 'imperial':
              scaleLineControl.setUnits('us');
              // var current = 'degrees';
              break;
          }
        };
