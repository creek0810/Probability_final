function load_file(){
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
        var data_str = "";        
        var data_json = JSON.parse(this.result);
        var key = Object.keys(data_json[0]);
        for(var i=0;i<data_json.length;i++){
            data_str += "<tr>";
            for(var j=0;j<key.length;j++){
                data_str += "<td>" + data_json[i][key[j]] + "</td>";
            }
            data_str += "</tr>";
        }
        $("#data").html(data_str);
    };
}
function init(){
}
$(document).ready(init,false)