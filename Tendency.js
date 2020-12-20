function Sorting(data, string) {
    var result = data.sort(function (a, b) {
        return b[string] - a[string];
    });
    return result;
};

d3.json("https://gist.githubusercontent.com/HIHYUN/14cb9537607afeee5d290593d6b90199/raw/ebe91ec7c00ef07424f33237e14a2d1ecf6fdf98/Tendency.json")
        .then(function (data) {

            const sort_justified = Sorting(JSON.parse(JSON.stringify(data)), "justified count").map(d => d.City);
            const sort_overreact = Sorting(JSON.parse(JSON.stringify(data)), "overreact count").map(d => d.City);
            const sort_killed = Sorting(JSON.parse(JSON.stringify(data)), "All People Killed by Police (1/1/2013-12/31/2019)").map(d => d.City);
            

            document.getElementById('High Justifed')
                .addEventListener("click", function () {
                    var checkbox = document.getElementById('check_boxs');
                    checkbox.style = "overflow:scroll";

                    var cur_check = document.getElementsByName("Checkbox");

                    var remember = [];
                    for (var i = 0; i < cur_check.length; i++) {
                        if (cur_check[i].checked == true) {
                            if (remember.length == 3) {
                                remember = [];
                                for (var i = 0; i <cur_check.length; i++) {
                                    cur_check[i].checked = false;
                                }
                                break;
                            }
                        remember.push(cur_check[i].id);
                        }
                    }
                    while (checkbox.firstChild) {
                        checkbox.removeChild(checkbox.firstChild);
                    }

                    for (var i = 0; i < sort_justified.length; i++) {
                        if (i >= 100) {
                            break;
                        };
                    
                        var div_parent = document.createElement("div");
                        var check = document.createElement("input");
                        var label = document.createElement("label");

                        div_parent.className = "Checklist";
                        div_parent.id = "High Justified Option";
                        
                        check.type = "checkbox";
                        check.className = "High Justified Option";
                        check.name = "Checkbox";
                        check.id = sort_justified[i];
                        check.addEventListener('click', getselectedSankey); 
                        check.addEventListener('click', getselectedBar); 
                        label.htmlFor = check.id;
                        label.innerHTML = (i + 1) + '. ' + sort_justified[i];

                        div_parent.appendChild(check);
                        div_parent.appendChild(label);
                        checkbox.appendChild(div_parent);
                        if(remember.includes(check.id)) {
                            check.checked =true;
                        }
                    }
            });

            document.getElementById('High OverReaction')
                .addEventListener("click", function () {
                    var checkbox = document.getElementById('check_boxs');
                    checkbox.style = "overflow:scroll";
                    var cur_check = document.getElementsByName("Checkbox");
                    var remember = [];
                    for (var i = 0; i < cur_check.length; i++) {
                        if (cur_check[i].checked == true) {
                        if (remember.length == 3) {
                            remember = [];
                            for (var i = 0; i < cur_check.length; i++) {
                                cur_check[i].checked = false;
                            }
                            break;
                        }
                        remember.push(cur_check[i].id);
                        }
                    }
                    while (checkbox.firstChild) {
                        checkbox.removeChild(checkbox.firstChild);
                    }
                    for (var i = 0; i < sort_overreact.length; i++) {
                        if (i >= 100) {
                            break;
                        };
                    
                        var div_parent = document.createElement("div");
                        var check = document.createElement("input");
                        var label = document.createElement("label");

                        div_parent.className = "Checklist";
                        div_parent.id = "High OverReaction Option";
                        
                        check.type = "checkbox";
                        check.className = "High OverReaction Option";
                        check.name = "Checkbox";
                        check.id = sort_overreact[i];
                        check.addEventListener('click', getselectedSankey); 
                        check.addEventListener('click', getselectedBar); 
                        label.htmlFor = check.id;
                        if (i >= 10 && i < 30) {
                            label.innerHTML = 10 + '. ' + sort_overreact[i];
                        }
                        else if ( i >= 30) {
                            label.innerHTML = 11 + '. ' + sort_overreact[i];
                        }
                        else {
                            label.innerHTML = (i + 1) + '. ' + sort_overreact[i];
                        }
                        

                        div_parent.appendChild(check);
                        div_parent.appendChild(label);
                        checkbox.appendChild(div_parent);
                        if(remember.includes(check.id)) {
                            check.checked =true;
                        }
                    }
            });

            document.getElementById('High Killed by Police')
                .addEventListener("click", function () {
                    var checkbox = document.getElementById('check_boxs');
                    checkbox.style = "overflow:scroll";
                    var cur_check = document.getElementsByName("Checkbox");
                    var remember = [];
                    for (var i = 0; i < cur_check.length; i++) {
                        if (cur_check[i].checked == true) {
                        if (remember.length == 3) {
                            remember = [];
                            for (var i = 0; i < cur_check.length; i++) {
                                cur_check[i].checked = false;
                            }
                            break;
                        }
                        remember.push(cur_check[i].id);
                        }
                    }
                    while (checkbox.firstChild) {
                        checkbox.removeChild(checkbox.firstChild);
                    }
                    for (var i = 0; i < sort_killed.length; i++) {
                        if (i >= 100) {
                            break;
                        };
                    
                        var div_parent = document.createElement("div");
                        var check = document.createElement("input");
                        var label = document.createElement("label");

                        div_parent.className = "Checklist";
                        div_parent.id = "High Killed by Police Option";
                        
                        check.type = "checkbox";
                        check.className = "High Killed by Police Option";
                        check.name = "Checkbox";
                        check.id = sort_killed[i];
                        check.addEventListener('click', getselectedSankey); 
                        check.addEventListener('click', getselectedBar); 
                        label.htmlFor = check.id;
                        label.innerHTML = (i + 1) + '. ' + sort_killed[i];

                        div_parent.appendChild(check);
                        div_parent.appendChild(label);
                        checkbox.appendChild(div_parent);
                        if(remember.includes(check.id)) {
                            check.checked =true;
                        }
                    }
            });

            

/*
            document.getElementById('High Justifed')
                .addEventListener("click", function () {
                    var listbox = document.getElementById('options_listbox');
                    while (listbox.firstChild) {
                        listbox.removeChild(listbox.firstChild);
                    }

                    for (var i = 0; i < sort_justified.length; i++) {
                        if (i >= 100) {
                            break;
                        };

                        var option = document.createElement("option");
                        option.selected;
                        option.value = sort_justified[i];
                        option.id = "High Justified Option";
                        option.innerHTML = (i + 1) + '. ' + sort_justified[i];
                        listbox.appendChild(option);
                    }
                });
            document.getElementById('High OverReaction')
                .addEventListener("click", function () {
                    var listbox = document.getElementById('options_listbox');
                    while (listbox.firstChild) {
                        listbox.removeChild(listbox.firstChild);
                    }

                    for (var i = 0; i < sort_overreact.length; i++) {
                        if (i >= 100) {
                            break;
                        };

                        var option = document.createElement("option");
                        option.selected;
                        option.value = sort_overreact[i];
                        option.id = "High OverReaction Option";
                        option.title =
                        option.innerHTML = (i + 1) + '. ' + sort_overreact[i];
                        listbox.appendChild(option);
                    }
                });
            document.getElementById('High Killed by Police')
                .addEventListener("click", function () {
                    var listbox = document.getElementById('options_listbox');
                    while (listbox.firstChild) {
                        listbox.removeChild(listbox.firstChild);
                    };

                    for (var i = 0; i < sort_killed.length; i++) {
                        if (i >= 100) {
                            break;
                        };

                        var option = document.createElement("option");
                        option.selected;
                        option.value = sort_killed[i];
                        option.id = "High Killed Option";
                        option.innerHTML = (i + 1) + '. ' + sort_killed[i];
                        listbox.appendChild(option);
                    };
                });*/
});

