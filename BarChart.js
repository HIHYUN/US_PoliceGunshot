function sort_key(arr, key) {
    var want_keyData = arr.map(function (data) {
        var obj = {};
        obj['name'] = data['City'];
        obj['value'] = data[key];
        return obj;
    });
    return want_keyData[0];
}

// 중복제거
function getunify(arr) {
    var Arr = arr.filter((item, index) => {
        const i = JSON.stringify(item);
        return index === arr.findIndex(obj => {
            return JSON.stringify(obj) === i;
        })
    });
    return Arr;
}


///// BAR CHART
function BarChart(data, str) {

    var margin = ({ top: 30, right: 0, bottom: 70, left: 40 });
    var height = 200; //200
    var width = 300; //300
    var color = '#adabc7';// '#adabc7' 연보라 킵; //'#656698';//"#b2b2b2"; 콘크리트 // '#cebebe' 베이지 //'#9fb1bc';  밝은 회색  //'#646496 ' 연보라  // '#5B5760' 검정빛 회색


    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);


    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y));

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .style("font-size", "13px")
        .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(-100));


    d3.selectAll('#' + str)
        .remove();

    const svg = d3.select(".bar_chart")
        .append("svg")
        .attr('id', str)
        .attr("viewBox", [0, 0, width, height]);

    svg.append('g')
        .attr("fill", color)
        .attr("transform", `translate(${x.bandwidth() * 0.4},0)`)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("height", 0)
        .attr("width", x.bandwidth() * 0.2)
        .attr("x", (d, i) => x(i))
        .attr("y", y(0))
        .transition().duration(1500)
        .delay((d, i) => i * 100)
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value));



    if (str == 'Violence') {
        svg.append('g')
            .append('text').text("Violence Crime Rate (1k)")
            .style("font-weight", "bold")
            .attr('x', margin.left)
            .attr('y', 12);
    }
    else if (str == 'Murder') {
        svg.append('g')
            .append('text').text("Murder Crime Rate (100k)")
            .style("font-weight", "bold")
            .attr('x', margin.left)
            .attr('y', 12);
    }
    else if (str == 'Killed') {
        svg.append('g')
            .append('text').text("Killed by Police")
            .style("font-weight", "bold")
            .attr('x', margin.left)
            .attr('y', 12);
    }



    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);


    return svg.node();
}


function RaceBarChart(data) {
    
    var margin = ({ top: 50, right: 0, bottom: 70, left: 100 });
    var height = 300;//200;
    var width = 300; //300;

    var race_color = {
        "Black": "#8A5A44",
        "Pacific Islander": "#D4A373",
        "Hispanic": "#E6B8A2",
        "Asian": "#FEC89A",
        "White": "#FFB5A7",
        "Native American": "#A44A3F",
        "Unknown": "#dee2e6",
    };


    var formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");

    var series = d3.stack()
        .keys(data[0].columns.slice(1))
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d));


    var color = d3.scaleOrdinal(Object.keys(race_color), Object.values(race_color)).unknown("#dee2e6");


    var y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.08);
    var x = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .range([margin.left, width - margin.right]);

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove());
    var xAxis = g => g
        .attr("transform", `translate(0,${margin.top + 3})`)
        .call(d3.axisTop(x).ticks(width / 100, "s"))
        .call(g => g.selectAll(".domain").remove());

    d3.selectAll('#Race')
        .remove();

    const svg = d3.select(".bar_chart")
        .append("svg")
        .attr('id', 'Race')
        .attr("viewBox", [0, 0, width, height]);

    svg.append('g')
        .append('text').text("Race Population")
        .style("font-weight", "bold")
        .attr('x', 50)
        .attr('y', 12);

    svg.append("g")
        .call(xAxis)
        .style("font-size", "13px");

    svg.append("g")
        .call(yAxis)
        .style("font-size", "13px");

    svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", (d, i) => y(d.data.name))
        .attr("height", y.bandwidth())
        .attr("x", margin.left)
        .transition().duration(1500)
        .delay((d, i) => i * 100)
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("x", d => x(d[0]));

    return svg.node();
}

// 인종별 인구수 데이터 정렬
function get_racepopu(data) {

    var obj = new Object();

    obj['name'] = data['City'];
    obj['Total'] = data['Total'];
    obj['Black'] = data['Black'];
    obj['White'] = data['White'];
    obj['Asian'] = data['Asian'];
    obj['Pacific Islander'] = data['Asian/Pacific Islander'];
    obj['Hispanic'] = data['Hispanic'];
    obj['American Indian'] = data['American Indian'];
    obj['Hawaiian'] = data['Hawaiian'];
    obj['Other'] = data['Other'];

    obj['columns'] = ['name',
        'Asian',
        'Black',
        'White',
        'Pacific Islander',
        'Hispanic',
        'American Indian',
        'Hawaiian',
        'Other'];

    return obj;
}

function getselectedBar() {
    var cur_check = document.getElementsByName("Checkbox");
    var SelectedArray = [];
    var Optionlist = [];
    var ArrViolence = [];
    var ArrMurder = [];
    var ArrKilled = [];
    var RacePopulation = [];



    for (var i = 0; i < cur_check.length; i++) {
        if (cur_check[i].checked == true) {
            if (SelectedArray.length == 3) {
                var SelectedArray = [];
                var Optionlist = [];
                var ArrViolence = [];
                var ArrMurder = [];
                var ArrKilled = [];
                var RacePopulation = [];
                for (var i = 0; i < c.length; i++) {
                    cur_check[i].checked = false;
                }
            }
            SelectedArray.push(cur_check[i].id);
            Optionlist.push(cur_check[i].className);
        }
    }


    d3.json("https://gist.githubusercontent.com/HIHYUN/14cb9537607afeee5d290593d6b90199/raw/ebe91ec7c00ef07424f33237e14a2d1ecf6fdf98/Tendency.json")
        .then(function (data) {
            const sort_violence = Sorting(JSON.parse(JSON.stringify(data)), "Violent Crime Rate").map(d => d.City);
            const sort_murder = Sorting(JSON.parse(JSON.stringify(data)), "Murder Rate").map(d => d.City);
            

            for (selected of SelectedArray) {
                var Data = data.filter(x => { return x['City'] == selected; });
                var Violence_rate = sort_key(Data, ['Violent Crime Rate']);
                var Murder_rate = sort_key(Data, ['Murder Rate']);
                var Killed_count = sort_key(Data, ['All People Killed by Police (1/1/2013-12/31/2019)']);
                var Killed_per_Arrest = sort_key(Data, ['Killings by Police per 10k Arrests']);

                ArrViolence.push(Violence_rate);
                ArrMurder.push(Murder_rate);
                ArrKilled.push(Killed_count);
                RacePopulation.push(get_racepopu(Data[0]));
            }
            ArrViolence = getunify(ArrViolence);
            ArrMurder = getunify(ArrMurder);
            ArrKilled = getunify(ArrKilled);
            RacePopulation = getunify(RacePopulation);

            var namebox = document.getElementById('Select_namebox');
            if (namebox.firstChild) {
                while (namebox.firstChild) {
                    namebox.removeChild(namebox.firstChild);
                };
            }
            
            for (var i = 0; i < SelectedArray.length; i++) {
    
                var violence_rank = sort_violence.indexOf(SelectedArray[i]);
                var murder_rank = sort_murder.indexOf(SelectedArray[i]);

                if (Optionlist[i] == "High Justified Option") {
                    var li = document.createElement("li");
                    li.id = "High Justified Option";
                    li.style = "border-left: 0.4rem solid #007f5f";
                    document.getElementById("Select_namebox").appendChild(li);

                    var span1 = document.createElement('span');
                    span1.innerHTML = SelectedArray[i];
                    li.appendChild(span1);

                    var span2 = document.createElement('span');
                    li.appendChild(span2);
                    var div1 = document.createElement('div');
                    switch (violence_rank) {
                        case 1:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".st";
                            break;
                        case 2:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".nd";
                            break;
                        case 3:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".rd";
                            break;
                        default:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".th";
                            break;
                    }
                    span2.appendChild(div1);


                    var div2 = document.createElement('div');
                    switch (murder_rank) {
                        case 1:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".st";
                            break;
                        case 2:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".nd";
                            break;
                        case 3:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".rd";
                            break;
                        default:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".th";
                            break;
                    }
                    span2.appendChild(div2);

                }
                else if (Optionlist[i] == "High OverReaction Option") {
                    var li = document.createElement("li");
                    li.id = "High OverReaction Option";
                    li.style = "border-left: 0.4rem solid #800000";
                    document.getElementById("Select_namebox").appendChild(li);

                    var span1 = document.createElement('span');
                    span1.innerHTML = SelectedArray[i];
                    li.appendChild(span1);

                    var span2 = document.createElement('span');
                    li.appendChild(span2);
                    var div1 = document.createElement('div');
                    switch (violence_rank) {
                        case 1:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".st";
                            break;
                        case 2:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".nd";
                            break;
                        case 3:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".rd";
                            break;
                        default:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".th";
                            break;
                    }
                    span2.appendChild(div1);


                    var div2 = document.createElement('div');
                    switch (murder_rank) {
                        case 1:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".st";
                            break;
                        case 2:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".nd";
                            break;
                        case 3:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".rd";
                            break;
                        default:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".th";
                            break;
                    }
                    span2.appendChild(div2);
                }

                else if (Optionlist[i] == "High Killed by Police Option") {
                    var li = document.createElement("li");
                    li.id = "High Killed by Police Option";
                    li.style = "border-left: 0.4rem solid #002642";
                    document.getElementById("Select_namebox").appendChild(li);

                    var span1 = document.createElement('span');
                    span1.innerHTML = SelectedArray[i];
                    li.appendChild(span1);

                    var span2 = document.createElement('span');
                    li.appendChild(span2);
                    var div1 = document.createElement('div');
                    switch (violence_rank) {
                        case 1:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".st";
                            break;
                        case 2:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".nd";
                            break;
                        case 3:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".rd";
                            break;
                        default:
                            div1.innerHTML = "Violence Crime " + violence_rank + ".th";
                            break;
                    }
                    span2.appendChild(div1);


                    var div2 = document.createElement('div');
                    switch (murder_rank) {
                        case 1:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".st";
                            break;
                        case 2:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".nd";
                            break;
                        case 3:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".rd";
                            break;
                        default:
                            div2.innerHTML = "Murder Crime " + murder_rank + ".th";
                            break;
                    }
                    span2.appendChild(div2);
                }
            }
        if(SelectedArray.length ==0) {
            d3.selectAll("#Violence").remove();
            d3.selectAll("#Murder").remove();
            d3.selectAll("#Killed").remove();
            d3.selectAll("#Race").remove();
            return;
        }
        BarChart(ArrViolence, 'Violence');
        BarChart(ArrMurder, 'Murder');
        BarChart(ArrKilled, 'Killed');
        RaceBarChart(RacePopulation);
        });
}

/*
var SelectedArray = [];
var Optionlist = [];
var ArrViolence = [];
var ArrMurder = [];
var ArrKilled = [];
var RacePopulation = [];

function getselectedBar() {
    d3.json("https://gist.githubusercontent.com/HIHYUN/14cb9537607afeee5d290593d6b90199/raw/ebe91ec7c00ef07424f33237e14a2d1ecf6fdf98/Tendency.json")
        .then(function (data) {

            const sort_violence = Sorting(JSON.parse(JSON.stringify(data)), "Violent Crime Rate").map(d => d.City);
            const sort_murder = Sorting(JSON.parse(JSON.stringify(data)), "Murder Rate").map(d => d.City);


            //re co
            if (SelectedArray.length == 3) {
                SelectedArray = [];
                Optionlist = [];
                ArrViolence = [];
                ArrMurder = [];
                ArrKilled = [];
                RacePopulation = [];


                var namebox = document.getElementById('Select_namebox');
                while (namebox.firstChild) {
                    namebox.removeChild(namebox.firstChild);
                };
            }

            var selectid = document.getElementById("options_listbox");
            var selectText = selectid.options[selectid.selectedIndex].value;
            var soption = selectid.options[selectid.selectedIndex].id;
            if (!(SelectedArray.includes(selectText))) {
                SelectedArray.push(selectText);
                Optionlist.push(soption);
            }

            for (selected of selectedArray) {
                var Data = data.filter(x => { return x['City'] == selected; });
                var Violence_rate = sort_key(Data, ['Violent Crime Rate']);
                var Murder_rate = sort_key(Data, ['Murder Rate']);
                var Killed_count = sort_key(Data, ['All People Killed by Police (1/1/2013-12/31/2019)']);
                var Killed_per_Arrest = sort_key(Data, ['Killings by Police per 10k Arrests']);

                ArrViolence.push(Violence_rate);
                ArrMurder.push(Murder_rate);
                ArrKilled.push(Killed_count);
                RacePopulation.push(get_racepopu(Data[0]));
            }
            ArrViolence = getunify(ArrViolence);
            ArrMurder = getunify(ArrMurder);
            ArrKilled = getunify(ArrKilled);
            RacePopulation = getunify(RacePopulation);


            for (var i = 0; i < selectedArray.length; i++) {
                var namebox = document.getElementById('Select_namebox');
                if (namebox.firstChild) {
                    while (namebox.firstChild) {
                        namebox.removeChild(namebox.firstChild);
                    };
                }


                for (var j = 0; j <= i; j++) {
                    var violence_rank = sort_violence.indexOf(selectedArray[j]);
                    var murder_rank = sort_murder.indexOf(selectedArray[j]);
                    if (Optionlist[j] == "High Justified Option") {
                        var li = document.createElement("li");
                        li.id = "High Justified Option";
                        li.style = "border-left: 0.4rem solid #007f5f";
                        document.getElementById("Select_namebox").appendChild(li);

                        var span1 = document.createElement('span');
                        span1.innerHTML = selectedArray[j];
                        li.appendChild(span1);

                        var span2 = document.createElement('span');
                        li.appendChild(span2);
                        var div1 = document.createElement('div');
                        switch (violence_rank) {
                            case 1:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".st";
                                break;
                            case 2:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".nd";
                                break;
                            case 3:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".rd";
                                break;
                            default:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".th";
                                break;
                        }
                        span2.appendChild(div1);


                        var div2 = document.createElement('div');
                        switch (murder_rank) {
                            case 1:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".st";
                                break;
                            case 2:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".nd";
                                break;
                            case 3:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".rd";
                                break;
                            default:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".th";
                                break;
                        }
                        span2.appendChild(div2);

                    }
                    else if (Optionlist[j] == "High OverReaction Option") {
                        var li = document.createElement("li");
                        li.id = "High OverReaction Option";
                        li.style = "border-left: 0.4rem solid #800000";
                        document.getElementById("Select_namebox").appendChild(li);

                        var span1 = document.createElement('span');
                        span1.innerHTML = selectedArray[j];
                        li.appendChild(span1);

                        var span2 = document.createElement('span');
                        li.appendChild(span2);
                        var div1 = document.createElement('div');
                        switch (violence_rank) {
                            case 1:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".st";
                                break;
                            case 2:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".nd";
                                break;
                            case 3:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".rd";
                                break;
                            default:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".th";
                                break;
                        }
                        span2.appendChild(div1);


                        var div2 = document.createElement('div');
                        switch (murder_rank) {
                            case 1:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".st";
                                break;
                            case 2:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".nd";
                                break;
                            case 3:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".rd";
                                break;
                            default:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".th";
                                break;
                        }
                        span2.appendChild(div2);
                    }

                    else if (Optionlist[j] == "High Killed Option") {
                        var li = document.createElement("li");
                        li.id = "High Killed Option";
                        li.style = "border-left: 0.4rem solid #002642";
                        document.getElementById("Select_namebox").appendChild(li);

                        var span1 = document.createElement('span');
                        span1.innerHTML = selectedArray[j];
                        li.appendChild(span1);

                        var span2 = document.createElement('span');
                        li.appendChild(span2);
                        var div1 = document.createElement('div');
                        switch (violence_rank) {
                            case 1:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".st";
                                break;
                            case 2:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".nd";
                                break;
                            case 3:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".rd";
                                break;
                            default:
                                div1.innerHTML = "Violence Crime " + violence_rank + ".th";
                                break;
                        }
                        span2.appendChild(div1);


                        var div2 = document.createElement('div');
                        switch (murder_rank) {
                            case 1:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".st";
                                break;
                            case 2:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".nd";
                                break;
                            case 3:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".rd";
                                break;
                            default:
                                div2.innerHTML = "Murder Crime " + murder_rank + ".th";
                                break;
                        }
                        span2.appendChild(div2);
                    }
                }
            }

            BarChart(ArrViolence, 'Violence');
            BarChart(ArrMurder, 'Murder');
            BarChart(ArrKilled, 'Killed');
            RaceBarChart(RacePopulation);
        });

}*/
