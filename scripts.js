var vis_step = 0;
var max_vis_step = 0;
var found; var steps; 
var search_pattern;
var search_text;
var failure_func;



let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑

function update_failure_func(){
    let table = document.createElement('table');
    let row1 =  table.insertRow()
    let row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.appendChild(document.createTextNode("P[]"));
    td2.appendChild(document.createTextNode("F[]"));
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < search_pattern.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.appendChild(document.createTextNode(search_pattern[i]));
        td2.appendChild(document.createTextNode(failure_func[i]));
    }
    table.id = "KMPFAILURE";
    document.getElementById("KMPFAILURE").replaceWith(table);
}

function update_vis() {
    let table = document.createElement('table');
    let kmp_s = steps[vis_step][0];
    let kmp_i = steps[vis_step][1];

    let row1 = table.insertRow();
    let row2 = table.insertRow();
    for (i = 0; i < search_text.length; i++) {
        td1 = row1.insertCell();
        td1.style="width: " +String(100/search_text.length) + "%";
        td2 = row2.insertCell();
        let text1 = "", text2 = "";
        if (kmp_s == i) {
            text1 = "s="+String(kmp_s);
            text2 = DARR;
        } 
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let row =  table.insertRow()

    for (i = 0; i <search_text.length; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(search_text[i]));
        if (i == kmp_s+kmp_i) {
            if (search_text[kmp_s + kmp_i] == search_pattern[kmp_i]) {
            td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
        } else if (i < kmp_i+kmp_s && i >= kmp_s) {
           td.style.backgroundColor = '#00FF00'; 
        }
    }

    row =  table.insertRow()
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < steps[vis_step][0]; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(""));
    }


    for (i = 0; i < search_pattern.length; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(search_pattern[i]));
        if (i == kmp_i) {
            if (search_text[kmp_s + kmp_i] == search_pattern[kmp_i]) {
            td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
        } else if (i < kmp_i) {
           td.style.backgroundColor = '#00FF00'; 
        }
        
        
    }

    row1 = table.insertRow();
    row2 = table.insertRow();
    for (i = 0; i < search_text.length; i++) {
        td1 = row1.insertCell();
        td1.style="width: " +String(100/search_text.length) + "%";
        td2 = row2.insertCell();
        let text1 = "", text2 = "";
        if (kmp_s + kmp_i == i) {
            text1 = UARR;
            text2 = "i="+String(kmp_i);
        } 
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let kmp_box = document.getElementById("KMPTABLE");
    table.id = "KMPTABLE";
    kmp_box.replaceWith(table);
}

const next_step_btn = document.getElementById("next-step-btn");
const prev_step_btn = document.getElementById("prev-step-btn");

function next_vis_step() {
    prev_step_btn.disabled = false;
    if (vis_step < max_vis_step) {
        vis_step += 1;
        update_vis();
    } 

    if (vis_step == max_vis_step) {
        next_step_btn.disabled = true;
    }   
}

function prev_vis_step() {
    next_step_btn.disabled = false;
    if (vis_step > 0) {
        vis_step -= 1;
        update_vis();
    } 
    if (vis_step == 0) {
        prev_step_btn.disabled = true;
    }    
}

function get_kmp_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
   
    [found, steps] = kmp_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;
    
    
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    update_vis();
    update_failure_func();
}


function kmp_search(pattern, text) {
    failure_func = kmp_failure_function(pattern);
    var s = 0;
    var i = 0;

    steps = []
    found = []
    
    while (s <= text.length - pattern.length) {
        steps.push( [s,i])
        console.log([s,i, failure_func[i]])
        if(text[s+i] == pattern[i]) {
            i = i + 1;
            if (i == pattern.length) {
                found.push(s);
                return [found, steps];
            }
        } else {
            
            s = s + i - failure_func[i];
            i = Math.max(failure_func[i], 0)
        }
    }
    return [found, steps];
}

function kmp_failure_function(pattern) {
    var F = [-1,0];
    var s = 2;
    var c = 0;

    while (s < pattern.length) {
        if (pattern[c] == pattern[s-1]) {
            c = c + 1;
            F[s] = c;
            s = s + 1;
        } else if (c > 0) {
            c = F[c]
        } else {
            F[s] = 0
            s = s + 1
            
        }
    }

    return F; 
}