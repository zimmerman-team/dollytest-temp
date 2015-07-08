
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
            continuousWorld: 'false',
            zoomControl: 'true'
        }

        if(no_dragging){
            mapoptions.dragging = false;
        }

        // if(zoomposition || zoomposition == null){
        //     mapoptions.zoomControl = false;
        // }

        jQuery("#"+div_id).css("min-height", "450px");
        this.map = L.map('heatmap', mapoptions).setView([-1.292066, 36.821946], 11);

        if (zoomposition){
            new L.Control.Zoom({ position: zoomposition }).addTo(this.map);
        }

        this.tl = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+this.basemap+'/{z}/{x}/{y}.png', {
            maxZoom: 12
        }).addTo(this.map);

        this.heat = [];

        this.heat[0] = L.heatLayer([], {
            radius: 18,
            blur: 25,
            gradient: {0.5: 'rgba(0,255,255,0.1)', 0.7: 'rgba(0,153,255,0.1)', 1: 'rgba(51,102,255,0.1)'}
        }).addTo(this.map);

        this.heat[1] = L.heatLayer([], {
            radius: 18,
            blur: 25,
            gradient: {0.5: 'rgba(204,204,0,0.1)', 0.7: 'rgba(255,102,0,0.1)', 1: 'rgba(204,0,0,0.1)'}
        }).addTo(this.map);
    };

    this.refresh = function(data){
        if(data){
            this.reDraw(data);
        } else{
            this.getData();
        }

    };


    this.getData = function(url){
        this.refresh(dollyData);
    };

    this.reDraw = function(data){

        for (var i = 0;i< 500;i++){
            this.heat[0].addLatLng([data[i]['fields']['latitude'], data[i]['fields']['longtitude']]);
        }

        for (var i = 500;i< data.length;i++){
            this.heat[1].addLatLng([data[i]['fields']['latitude'], data[i]['fields']['longtitude']]);
        }
        
    }

}


var dollymap = new OipaMap();

dollymap.set_map('heatmap');
dollymap.refresh();
console.log(dollyData);