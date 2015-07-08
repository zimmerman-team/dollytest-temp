function startComparison(){
    dollymap.refresh();
}

function DatapoolMap(){
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

    this.keywords = ['',''];
    this.to = '';
    this.totime = '';
    this.from = '';
    this.fromtime = '';
    this.excludeUsers = [];

    this.countTweets = 0;
    this.countRetweets = 0;
    this.countMentions = 0;
    this.countUsers = {};
    this.loaded = 0;


    if (typeof standard_basemap !== 'undefined') {
        this.basemap = standard_basemap;
    }

    this.set_map = function(div_id, zoomposition, no_dragging){

        var mapoptions = {
            attributionControl: false,
            scrollWheelZoom: false,
            zoom: 11,
            minZoom: 9,
            maxZoom:15,
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
            maxZoom: 15
        }).addTo(this.map);

        this.heat = [];

        this.heat[0] = L.heatLayer([], {
            minOpacity: .5,
            radius: 18,
            blur: 25,
            gradient: {0.5: 'rgba(0,255,255,0.1)', 0.7: 'rgba(0,153,255,0.1)', 1: 'rgba(51,102,255,0.1)'}
        }).addTo(this.map);

        this.heat[1] = L.heatLayer([], {
            minOpacity: .5,
            radius: 18,
            blur: 25,
            gradient: {0.5: 'rgba(204,204,0,0.1)', 0.7: 'rgba(255,102,0,0.1)', 1: 'rgba(204,0,0,0.1)'}
        }).addTo(this.map);
    };

    this.resetData = function(){
        this.countTweets = 0;
        this.countRetweets = 0;
        this.countMentions = 0;
        this.countUsers = {};
        this.loaded = 0;

        this.heat[0].setLatLngs([]);
        this.heat[1].setLatLngs([]);
    }

    this.refresh = function(data, heatmapId){
        


        if(data){
            this.reDraw(data, heatmapId);
        } else{
            this.resetData();
            this.getData(data, 0);
            this.getData(data, 1);
        }
    };

    this.createUrl = function(heatmapId){

        var url = 'get_data.php?parameters=';

        var parameters = [];


        parameters.push('search='+this.keywords[heatmapId]);

        var start = 'start='+this.from
        if (this.fromtime != ''){
            start += 'T'+this.fromtime;
        }
        parameters.push(start);
        var end = 'end='+this.to
        if (this.totime != ''){
            end += 'T'+this.totime;
        }

        parameters.push(end);

        parameters = parameters.join('&');
        parameters = encodeURIComponent(parameters);
        url += parameters;
        return url;
    }


    this.getData = function(url, heatmapId){
        var url = this.createUrl(heatmapId);
        var that = this;
        jQuery.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function(data){
                that.refresh(data, heatmapId);
                tweetData[heatmapId] = data;
            }
        });
    };

    this.reDraw = function(data, heatmapId){

        for (var i = 0;i< data.length;i++){
            this.heat[heatmapId].addLatLng([data[i]['fields']['latitude'], data[i]['fields']['longitude']]);

            this.countTweets++;


            if (data[i]['fields']['text'].substring(0, 2) == "RT") {
                this.countRetweets++;
            }

            if (data[i]['fields']['text'].charAt(0) == "@") {
                this.countMentions++;
            }

            this.countUsers[data[i]['fields']['u_id']] = true;
        }

        this.loaded++;
        if(this.loaded == 2){

            jQuery('#count-tweets').text(this.countTweets);
            jQuery('#count-retweets').text(this.countRetweets);
            jQuery('#count-mentions').text(this.countMentions);
            jQuery('#count-users').text(Object.keys(this.countUsers).length);

            linechart.refresh();

            this.loaded = 0;
        }
    }

}


var dollymap = new DatapoolMap();
dollymap.set_map('heatmap');




jQuery("#go").click(function(){
    dollymap.keywords[0] = jQuery("#keyword-0").val();
    dollymap.keywords[1] = jQuery("#keyword-1").val();
    dollymap.from = jQuery("#from").val();
    dollymap.fromtime = jQuery("#fromtime").val();
    dollymap.to = jQuery("#to").val();
    dollymap.totime = jQuery("#totime").val();
    dollymap.refresh();
});








var DatapoolLinechart = function(){


    this.chart = null;

    this.init = function(){
        this.chart = nv.models.cumulativeLineChart()
          .x(function(d) { return d[0] })
          .y(function(d) { return d[1] })
          .color(d3.scale.category10().range())
          .useInteractiveGuideline(true)
          ;

        this.chart.xAxis
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d))
              });
            // .tickValues([1078030800000,1122782400000,1167541200000,1251691200000])

        this.chart.yAxis
            .tickFormat(d3.format(',.1'));

        d3.select('#linechart svg')
            .datum([{'key': 'First series', 'values': [[]], 'color': '#4fbdbe'},{'key': 'Second series', 'values': [[]], 'color': '#ee3b24'}])
            .call(this.chart);

        nv.utils.windowResize(this.chart.update);
    }

    this.reformatData = function(){

        console.log(tweetData);

        var data = [[],[]];
        if (tweetData[0].length > 0){
            for(var i = 0; i < tweetData[0].length;i++){
                data[0][i] = [tweetData[0][i]['fields']['create_at'], 1];    
            }
        }

        if(tweetData[1].length > 0){
            for(var i = 0; i < tweetData[1].length;i++){
                data[1][i] = [tweetData[1][i]['fields']['create_at'], 1];    
            }
        }
        return data;
    }

    this.refresh = function(){
        console.log('refresh called');
        var data = this.reformatData();

        d3.select('#linechart svg')
            .datum([{'key': 'First series', 'values': data[0], 'color': '#4fbdbe'},{'key': 'Second series', 'values': data[1], 'color': '#ee3b24'}])
            .call(this.chart);

    }
}

var tweetData = [[],[]];
var linechart = new DatapoolLinechart();
linechart.init();