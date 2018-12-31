DATA = [];
function load_data(){
    $.ajax({
        url:"/query", 
        data: {
            file_name:  $('#date').text(),
            city: $('#city').val()
        },
        success:function(data){
            data = data["data"];
            DATA = data;
            let chart_width = document.body.clientWidth / 2;
            let chart_height = document.body.clientWidth / 4;
            let humidity_chart = c3.generate({
                bindto: '#humidity_chart',
                size: {
                    width: chart_width,
                    height: chart_height
                },
                data: {
                    json: data,
                    keys: {
                        x: 'date',
                        value: ['humidity'],
                    },
                    types:{
                        humidity: 'line',
                    }
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        format: '%Y/%m/%d'
                    }
                }
            });
            let pre_chart = c3.generate({
                bindto: '#pre_chart',
                size: {
                    width: chart_width,
                    height: chart_height
                },
                data: {
                    json: data,
                    keys: {
                        x: 'date',
                        value: ['precipitation'],
                    },
                    type: 'bar'
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        format: '%Y/%m/%d'
                    }
                }
            });
            let humidity_scatter = c3.generate({
                bindto: '#humidity_scatter',
                size: {
                    width: chart_width,
                    height: chart_height
                },
                data: {
                    json: data,
                    xs:{
                        precipitation: 'humidity',
                    },
                    keys:{
                        value: ['humidity', 'precipitation']
                    },
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: 'Humidity',
                        tick: {
                            fit: false
                        }
                    },
                    y: {
                        label: 'Precipitation'
                    }
                }
            });
            let temp_scatter = c3.generate({
                bindto: '#temp_scatter',
                size: {
                    width: chart_width,
                    height: chart_height
                },
                data: {
                    json: data,
                    xs:{
                        precipitation: 'temp',
                    },
                    keys:{
                        value: ['temp', 'precipitation']
                    },
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: 'Temperature',
                        tick: {
                            fit: false
                        }
                    },
                    y: {
                        label: 'Precipitation'
                    }
                }
            })
            $('#humidity_coef').text(data[data.length-1]["humidity_coef"]);
            $('#temp_coef').text(data[data.length-1]["temp_coef"]);
            $('.pearson').show();
        }
    });
}
function init(){
    $('#query').click(load_data);
}
$(document).ready(init,false);