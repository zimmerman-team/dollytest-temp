
function OipaMap(){
    this.map = null;
    this.selection = null;
    this.slider = null;
    this.basemap = "zimmerman2014.hmpkg505";
    this.tl = null;
    this.compare_left_right = null;
    this.circles = {};
    this.markers = [];
    this.vistype = "geojson";
    this.selected_year = null;

    if (typeof standard_basemap !== 'undefined') {
        this.basemap = standard_basemap;
    }

    this.set_map = function(div_id, zoomposition, no_dragging){

        var mapoptions = {
            attributionControl: false,
            scrollWheelZoom: false,
            zoom: 3,
            minZoom: 2,
            maxZoom:12,
            continuousWorld: 'false'
        }

        if(no_dragging){
            mapoptions.dragging = false;
        }

        if(zoomposition || zoomposition == null){
            mapoptions.zoomControl = false;
        }



        jQuery("#"+div_id).css("min-height", "400px");
        this.map = L.map('heatmap', mapoptions).setView([3.505, 18.00], 2);

        if (zoomposition){
            new L.Control.Zoom({ position: zoomposition }).addTo(this.map);
        }

        this.tl = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+this.basemap+'/{z}/{x}/{y}.png', {
            maxZoom: 12
        }).addTo(this.map);
    };

    this.refresh = function(data){

        if (!data){
            // get url
            var url = this.get_url();
            // get data
            this.get_data(url);
        } else {
            // show data
            this.show_data_on_map(data);
        }
    };


    this.get_data = function(url){
        return dollyData;
    };

}


var dollymap = new OipaMap();

dollymap.set_map('heatmap');
console.log('test');