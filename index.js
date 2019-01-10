var data_json,key;
var data_query;
function load_table(){
    var data_str = '<tr>';        
    for(var i=0;i<data_json.length;i++){
        data_str += "<tr>";
        for(var j=0;j<key.length;j++){
            data_str += "<td>" + data_json[i][key[j]] + "</td>";
        }
        data_str += "</tr>";
    }
    $("#data").html(data_str);
}
function sort(cur_id){
    var type = cur_id.split("-");
    type =  parseInt(type[1]);
    data_json.sort(function(a,b){
        return a[key[type]] - b[key[type]];
    });
    load_table();
}
function load_file(){
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
        var list_str = "";
        var heading_str = "";
        data_json = JSON.parse(this.result);
        key = Object.keys(data_json[0]);
        heading_str += "<tr>";
        for(var i=0;i<key.length;i++){
            if(typeof(data_json[0][key[i]]) == "number"){
                list_str += '<option value="' + i.toString() + '">' + key[i] + "</option>";
            }
            heading_str += "<td id='type-" + i.toString()  + "'>" + key[i] + "</td>";
        }
        heading_str += "</tr>";
        $("#heading").html(heading_str);
        $("#select").html(list_str);
        $("#select2").html(list_str);
        load_table();
        $('thead td').click(function(){
            sort(this.id);
        })
    };
}
function query(){
    var key_word = $("#key_word").val();
    var schema = $("#select").val();
    var data_str = "<tr>";
    for(var i=0;i<key.length;i++){
        data_str += "<td>" + key[i] + "</td>";
    }
    data_str += "</tr>";
    for(var i=0;i<data_json.length;i++){
        if(data_json[i][key[schema]] == key_word){
            data_str += "<tr>";
            for(var j=0;j<key.length;j++){
                data_str += "<td>" + data_json[i][key[j]] + "</td>";
            }
            data_str += "</tr>";
        }
    }
    $("#data").html(data_str);
}
function init(){
    $("#query").click(query);
}
$(document).ready(init,false)