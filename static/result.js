DATA = [];
function cmp(a,b){
    a = parseFloat(a.precipitation);
    b = parseFloat(b.precipitation);
    if(a< b){
        return -1;
    }
    return 1;
}
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
            let chart_width = document.body.clientWidth * 0.4;
            let chart_height = chart_width * 0.5;
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
            DATA.sort(cmp);
        }
    });
}
function calc_c(p,n){
    let tmp = 1;
    console.log(p);
    console.log(n);
    console.log("!");
    for(let i=p;i>p-n;i--){
        tmp *= i;
    }
    for(let i=2;i<=n;i++){
        tmp /= i;
    }
    return tmp;
}
function pow(a,b){
    let ans = a;
    for(let i=1;i<=b;i++){
        ans *= a;
    }
    return ans;
}
function query_probality(){
    let total_day = DATA.length - 1;
    let tar = $('#query_day').val();
    let range = $('#choose_day').val();
    let tar_precipitation = parseInt($('#tar_precipitation').val());
    let find = 0;
    while(parseInt(DATA[find].precipitation) < tar_precipitation){
        find++;
    }
    let success_prob = parseFloat((find/total_day).toFixed(5));
    let tmpp= calc_c(parseInt(range),parseInt(tar));
    let ans = Math.pow(success_prob,tar) * calc_c(range,tar) * Math.pow(1-success_prob,range-tar);
    console.log(Math.pow(success_prob,tar) );
    console.log(Math.pow(1-success_prob,range-tar))
    console.log(find);
    $("#prob_ans").html(ans.toFixed(4));
}
function init(){
    // init probability selection
    for(let i=1;i<=31;i++){
        let tmp = "<option value='" + i.toString() + "'>" + i.toString() + "</option>";
        $('#choose_day').append(tmp);
        $('#query_day').append(tmp);
    }
    $('#query').click(load_data);
    $('#query_prob').click(query_probality);
}
$(document).ready(init,false);