var vis_step = 0;
var max_vis_step = 0;
function next_vis_step() {
    if (vis_step < max_vis_step)
    vis_step += 1;
}

function prev_vis_step() {
    vis_step -=1;
}

function get_kmp_strings() {
    var search_pattern = document.getElementById("search_pattern").value;
    var search_text = document.getElementById("search_text").value;
   
    var [found, steps] = kmp_search(search_pattern, search_text);


    document.getElementById("KMP").innerHTML = found;
    let list = document.getElementById("KMP-Steps");
    list.innerHTML = "";
    for (i = 0; i < steps.length; ++i) {
        let li = document.createElement('li');
        li.innerText = steps[i];
        list.appendChild(li);
    }

    // document.getElementById("KMP").innerHTML = "Pattern: " + search_pattern + " Text:" + search_text;

}


function kmp_search(pattern, text) {
    var F = kmp_failure_function(pattern);
    var s = 0;
    var i = 0;

    var steps = []
    var found = []
    
    while (s <= text.length - pattern.length) {
        steps.push( [s,i])
        if(text[s+i] === pattern[i]) {
            i = i + 1;
            if (i === pattern.length) {
                found.push(s);
                return [found, steps];
            }
        } else {
            s = s + i - F[i];
            i = Math.max(F[i], 0)
        }
    }
    return [-1, steps];
}

function kmp_failure_function(pattern) {
    var F = [-1,0];
    var s = 2;
    var c = 0;

    while (s < pattern.length) {
        if (pattern[c] = pattern[s-1]) {
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