

H5PEditor.widgets.locationPicker = H5PEditor.LocationPicker =(function($){



  function C(parent,field,params,setValue){
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;
  }




  C.prototype.appendTo = function($wrapper){

    var self = this;

    window.prevLat;
    window.prevLong;

    self.latitude = this.params?this.params.latitude:"";
    self.longitude = this.params?this.params.longitude:"";


    self.$wrapper = $wrapper;


    self.$button = $('<div>Latitude:<input id="input-lat" type="text" value='+(self.params!==undefined?self.params.latitude:"")+'  ></input>\
    Longitude:<input id="input-long" type="text" value='+(self.params!==undefined?self.params.longitude:"") +' ></input>\
    <button id="show-map-button"> show map </button></div>').appendTo($wrapper);

    self.$button.find('#input-lat').change(function(){
      var pattern = new RegExp('^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$');
      if(pattern.test(this.value)){
        self.latitude = this.value;
      }else{
         throw new Error('wrong latitude value');
      }

    });

    self.$button.find('#input-long').change(function(){
      var pattern = new RegExp('^[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$');
      if(pattern.test(this.value)){
        self.longitude = this.value;
      }else{
         throw new Error('wrong longitude value');
      }

    });



    self.$popup = $('<div id="popup-container" title="Location Picker" > <div id="map-container"></div><div class="input-box">\
    <label>Latitude</label><input type="text" id="us2-lat"/>\
    <label>Longitude</label><input type="text" id="us2-lon"/></div></div>').appendTo($wrapper);

    self.$popup.dialog({
        autoOpen: false,
        width: "100%",
        position: {
          my: 'top',
          at: 'top',
          of: self.$button
        },
        show: {
          effect: "blind",
          duration: 1000
        },
        hide: {
          effect: "explode",
          duration: 1000
        },
        model: true,
        buttons: {
          "Use Location": function(){
            window.prevLat = self.$popup.find('#us2-lat').val();
            window.prevLong= self.$popup.find('#us2-lon').val();


            self.$button.find('#input-lat').val(window.prevLat).trigger('change');
            self.$button.find('#input-long').val(window.prevLong).trigger('change');

            self.params = {'latitude': window.prevLat, 'longitude': window.prevLong};
            self.setValue(self.field,self.params);

              self.$popup.dialog('close');
          },
          Cancel: function() {
            self.$popup.dialog('close');
          }
        },
        close: function() {
          console.log("cancel pressed");
        }

      });







    self.$button.find('button').on('click', function(){
      self.$popup.dialog("open");
      if(window.google== undefined){


              $.ajax({
            type: "GET",
            url: 'http://maps.google.com/maps/api/js?sensor=false&libraries=places',
            async: false,
            dataType: "script",
            success: function(){
              console.log('first time loading');
              self.$popup.find('#map-container').locationpicker({
                location: {
                  latitude: (self.latitude)?parseFloat(self.latitude):((window.prevLat)?parseFloat(window.prevLat): 46.15242437752303),
                  longitude: (self.longitude)?parseFloat(self.longitude):((window.prevLong)?parseFloat(window.prevLong): 2.7470703125)
                },
                radius: 300,
                inputBinding: {
                    latitudeInput: self.$popup.find('#us2-lat'),
                    longitudeInput: self.$popup.find('#us2-lon')
                }
              });
            }
        });

        console.log('window loaded');

      }

      else{

       console.log('else part is loading');


       console.log(parseFloat(window.prevLat));
       console.log(parseFloat(window.prevLong));
       self.$popup.find('#map-container').locationpicker({
         location: {
             latitude: (self.latitude)?parseFloat(self.latitude):((window.prevLat)?parseFloat(window.prevLat): 46.15242437752303),
             longitude: (self.longitude)?parseFloat(self.longitude):((window.prevLong)?parseFloat(window.prevLong): 2.7470703125)
         },
         radius: 300,
         inputBinding: {
             latitudeInput: self.$popup.find('#us2-lat'),
             longitudeInput: self.$popup.find('#us2-lon')
         }
       });
      }


    });

  };





   C.prototype.validate = function () {

     var latPattern= new RegExp('^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$');
     var longPattern= new RegExp('^[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$');

     return this.params !== undefined && this.params.latitude !== undefined && this.params.longitude !== undefined &&
           latPattern.test(this.params.latitude) &&
           longPattern.test(this.params.longitude);

   }



  return C;
})(H5P.jQuery);
