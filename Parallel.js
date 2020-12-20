
var dispostion_color = {
  "Justified": "#007f5f",
  "Unreported": "#2b9348",
  "No Murder": "#55a630", // 무죄 판결
  "Acquitted": "#80b918", // 살인죄로 기소 그러나 무죄 판결
  "Dismissed": "#aacc00",  // 기소 기각, 사건 종료


  "Accidental": "#ffc300", //우발적 사고

  "Excusable": "#FF9696",//"#a71e34",  // 변명 여지 있음
  "Charged": "#FF5050",//"#a11d33",
  "Discipline": "#EB0000",//"#85182a", //행정 명령
  "Unjustified": "#B90000",//"#6e1423",
  "Murder": "#800000",//"#641220",

  "Investing": "#adb5bd", //조사 진행 중
  "Unknown": "#dee2e6",
};
var color = d3.scaleOrdinal(Object.keys(dispostion_color), Object.values(dispostion_color)).unknown("#dee2e6");
legend({ title: "Official Disposition Color", color });
var key_index = [4, 9, 12, 13, 14, 2, 17];
/*
var race_color = {
  "Black": "#8A5A44",
  "Pacific Islander": "#D4A373",
  "Hispanic": "#E6B8A2",
  "Asian": "#FEC89A",
  "White": "#FFB5A7",
  "Native American": "#A44A3F",
  "Unknown": "#dee2e6",
};
var color = d3.scaleOrdinal(Object.keys(race_color), Object.values(race_color)).unknown("#dee2e6");
legend({ title: "Race Color", color });
key_index = [4, 2, 12, 13, 14, 9, 17];
*/

// 원하는 State에 해당되는 피살자 추출
function Filter(data, key, name) {
  var result = data.filter(x => {
    return x[key] == name;
  });
  return result;
};


/*
// State => County 로 분류
function Groupby(arr,property) {
  return arr.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};
*/

// 데이터 원하는 key만 뽑은 뒤 Count 

function align_bykey(arr, keys, key_arr) {
  var want_keyData = arr.map(function (data) {
    var obj = {};
    for (const k of key_arr) {
      obj[keys[k]] = data[keys[k]];
    };
    return obj;
  });
  // 객체 중복 제거
  var filtered = want_keyData.filter(function (a) {
    var key = Object.keys(a).map(function (k) { return a[k]; }).join('|');
    if (!this[key]) {
      return this[key] = true;
    }
  }, Object.create(null));



  arr = [];
  for (var seted of filtered) {
    var obj = new Object;
    Object.assign(obj, seted);

    obj.value = 0;
    for (var element of want_keyData) {
      if (JSON.stringify(element) == JSON.stringify(seted)) {
        obj.value++;
      }
    }
    arr.push(obj);
  }
  var arr = arr.sort(function (a, b) {
    return b.value - a.value;
  });

  return arr;
};





// Sankey node and link Extract
function graph(data, keys) {

  let index = -1;
  const nodes = [];
  const nodeByKey = new Map;
  const indexByKey = new Map;
  const links = [];

  var article = keys.pop();

  for (const k of keys) {
    for (const d of data) {
      const key = JSON.stringify([k, d[k]]);
      if (nodeByKey.has(key)) continue;
      const node = { name: d[k] };
      nodes.push(node);
      nodeByKey.set(key, node);
      indexByKey.set(key, ++index);
    }
  }


  for (let i = 1; i < keys.length; ++i) {
    const a = keys[i - 1];
    const b = keys[i];
    const prefix = keys.slice(0, i + 1);
    const linkByKey = new Map;
    var urlobj = new Object;
    for (const d of data) {
      const names = prefix.map(k => d[k]);
      const key = JSON.stringify(names);
      const value = d.value || 1;
      const url = d[article];
      if (Object.keys(urlobj).includes(key)) {
        urlobj[key].push(url);
      }
      else { urlobj[key] = []; urlobj[key].push(url); }
      let link = linkByKey.get(key);
      if (link) { link.value += value; continue; }
      link = {
        source: indexByKey.get(JSON.stringify([a, d[a]])),
        target: indexByKey.get(JSON.stringify([b, d[b]])),
        names,
        value,
        URL: urlobj[key]
      };
      links.push(link);
      linkByKey.set(key, link);
    }
  }

  return { nodes, links };
};

function Sankey(node_link) {
  const CONTAIN_WIDTH = document.body.offsetWidth / 2; //960
  //const CONTAIN_HEIGHT = 300;
  //const CONTAIN_HEIGHT = document.body.offsetHeight /3 -50;  // 300

  var height_value = 0;
  for (k of node_link.links.filter(d => d.source == 0)) {
    height_value += k.value;
  }
  if (75 <= height_value) {
    var CONTAIN_HEIGHT = 300;
  }
  else if ((31 <= height_value && height_value < 75)) {
    var CONTAIN_HEIGHT = 250;
  }
  else if ((15 <= height_value && height_value < 31)) {
    var CONTAIN_HEIGHT = 200;
  }
  else if ((5 <= height_value && height_value < 15)) {
    var CONTAIN_HEIGHT = 150;
  }
  else {
    var CONTAIN_HEIGHT = 100;
  }

  // 인종 피부톤 별 차트색
  var color_obj = {
    "Black": "#8A5A44",
    "Pacific Islander": "#D4A373",
    "Hispanic": "#E6B8A2",
    "Asian": "#FEC89A",
    "White": "#FFB5A7",
    "Native American": "#A44A3F",
    "Unknown": "#dee2e6",


    "Justified": "#007f5f",
    "Unreported": "#2b9348",
    "Charged Acquitted": "#80b918", // 무죄 판결
    "Charged Murder and Acquitted": "#55a630", // 살인죄로 기소 그러나 무죄 판결
    "Charged, charges dismissed": "#aacc00",  // 기소 기각, 사건 종료

    "Accidental": "#ffc300", //우발적 사고 

    "Found Excusable": "#FF9696",//"#a71e34",  // 변명 여지 있음
    "Charged": "#FF5050",//"#a11d33",
    "Administrative discipline": "#EB0000",//"#85182a", //행정 명령
    "Unjustified": "#B90000",//"#6e1423",
    "Convicted Murder": "#800000",//"#641220",

    "Pending investigation": "#adb5bd",//"#a8dadc",//"#ecf8f8", //조사 진행 중
    "Unknown": "#dee2e6",
  }


  var color = d3.scaleOrdinal(Object.keys(color_obj), Object.values(color_obj)).unknown("#dee2e6");



  const svg = d3.select("#sankey_multiple").append("svg")
    .attr("id", "Sankey")
    .attr('width', CONTAIN_WIDTH)
    .attr('height', CONTAIN_HEIGHT)
    .style('margin-bottom', '10px');

  var sankey = d3.sankey()
    .nodeSort(null)
    .linkSort(null)
    .nodeWidth(4)
    .nodePadding(20)
    .extent([[0, 5], [CONTAIN_WIDTH, CONTAIN_HEIGHT - 5]]);

  const { nodes, links } = sankey({
    nodes: node_link.nodes.map(d => Object.assign({}, d)),
    links: node_link.links.map(d => Object.assign({}, d))
  });

  var node = svg.append("g").selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "nodesankey");

  var rect = node.append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => (d.y1 - d.y0))
    .attr("width", d => d.x1 - d.x0)
    .append("title")
    .text(d => `${d.name}\n${d.value.toLocaleString()}`);


  var link = svg.append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .join("path")
    .attr("class", "linksankey")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => color(d.names[1]))
    .attr("stroke-opacity", 0.8)
    .attr("stroke-width", function (d) { return Math.max(1, d.width); })
    .style("mix-blend-mode", "multiply");


  svg.append("g")
    .style("font", "11px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < CONTAIN_WIDTH / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < CONTAIN_WIDTH / 2 ? "start" : "end")
    .text(d => d.name)
    .append("tspan")
    .attr("fill-opacity", 0.7)
    .text(d => ` ${d.value.toLocaleString()}`);

  var tooltip = d3.select("body").append("div")
    .attr("id", "toolTip")
    .style("display", "none");

  var Explore = true;

  link.on("mouseover", function (d) {
    Explore = true;
    tooltip.style("display", "none");
    var data = d.target.__data__;
    var name = data.names;
    link.attr("cursor", "pointer");
    link.append("title")
      .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);
    link.transition()
      .duration(500)
      .style("opacity", .1);
    
    

    link.filter(function (s) {
      var includes = true;
      for (var i=0; i < name.length; i++) {
        if (!s.names.includes(name[i])) {
          includes = false;
        }
      }
      if (includes == true) {
        return s.names;
      }
    }).transition()
    .duration(500)
    .style("opacity", 1);
    
    
    for (var i = 1; i < data.names.length; i++) {
      var name = data.names.slice(0, i + 1);
      link.filter(function (s) {
        return JSON.stringify(name) == JSON.stringify(s.names);
        })
        .transition()
        .duration(500)
        .style("opacity", 1);
    }
  });
  link.on("mouseout", function (d) {
    if (Explore) {
      svg.selectAll(".linksankey").transition()
        .duration(700)
        .style("opacity", 1);
    }
  });

  link.on("dblclick", function (d) {
    d3.selectAll('#article')
      .remove();
    Explore = false;
    var URL = d.target.__data__['URL'];
    link.attr("cursor", "pointer");
    tooltip.style("left", (event.pageX - 30) + "px")
      .style("top", (event.pageY - 50) + "px")
      .style("display", "flex")
      .style("opacity", 0)
      .transition()
      .style("opacity", 1)
      .duration(300);

    tooltip.append("div")
      .attr("id", "article")
      .text("Article")
      .style("font-weight", "bold");

   
    var data = d.target.__data__;
    var name = data.names;

    link.transition()
      .duration(500)
      .style("opacity", .1);
    link.filter(function (s) {
      var includes = true;
      for (var i=0; i < name.length; i++) {
        if (!s.names.includes(name[i])) {
          includes = false;
        }
      }
      if (includes == true) {
        return s.names;
      }
    }).transition()
    .duration(500)
    .style("opacity", 1);
    
    
    for (var i = 1; i < data.names.length; i++) {
      var name = data.names.slice(0, i + 1);
      link.filter(function (s) {
        return JSON.stringify(name) == JSON.stringify(s.names);
        })
        .transition()
        .duration(500)
        .style("opacity", 1);
    }

    for (var i = 0; i < URL.length; i++) {
      tooltip.append("div")
        .attr("id", "article")
        .html("<a href =" + URL[i] + " target =" + "_blank" + ">" + "Case  " + JSON.stringify(i + 1) + "</a>");
    }
  });
  svg.on("click", function () { Explore = true; tooltip.style("display", "none") });
  //d3.select("body").on("click", function(){tooltip.style("display", "none");});
  svg.node();
};

function chartmode(clicked_id) {
  var cur_check = document.getElementsByName("Checkbox");
  var selectedArray = [];

  for (var i = 0; i <cur_check.length; i++) {
    if (cur_check[i].checked == true) {
      if (selectedArray.length == 3) {
        selectedArray = [];
        for (var i = 0; i < cur_check.length; i++) {
          cur_check[i].checked = false;
        }
        break;
      }
      selectedArray.push(cur_check[i].id);
    }
  }

  d3.json("https://gist.githubusercontent.com/HIHYUN/c32fd49b6affc577dd42a7462239c4c4/raw/f478cf664521964fa22b766c4dd15f3ff0114b03/Victims_2013_2019.json")
    .then(function (data) {
      const keys = Object.keys(data[0]);

      if (clicked_id == "focus_offical") {
        key_index = [4, 9, 12, 13, 14, 2, 17];

        var length = selectedArray.length;

        switch (length) {
          case 1:
            d3.selectAll('#Sankey')
              .remove();
            var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
            Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
            break;
          case 2:
            d3.selectAll('#Sankey')
              .remove();
            var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
            Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
            var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
            Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
            break;
          case 3:
            d3.selectAll('#Sankey')
              .remove();
            var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
            Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
            var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
            Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
            var Graph3 = align_bykey(Filter(data, 'City', selectedArray[2]), keys, key_index);
            Sankey(graph(Graph3, Object.keys(Graph3[0]).slice(0, -1)));
            break;

          default:
            d3.selectAll('#Sankey')
              .remove();
            break;
        }
      }
      else if (clicked_id == "focus_race") {
        key_index = [4, 2, 12, 13, 14, 9, 17];
        var length = selectedArray.length;

        switch (length) {
          case 1:
            d3.selectAll('#Sankey')
              .remove();
            var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
            Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
            break;
          case 2:
            d3.selectAll('#Sankey')
              .remove();
            var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
            Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
            var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
            Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
            break;
          case 3:
            d3.selectAll('#Sankey')
              .remove();
            var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
            Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
            var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
            Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
            var Graph3 = align_bykey(Filter(data, 'City', selectedArray[2]), keys, key_index);
            Sankey(graph(Graph3, Object.keys(Graph3[0]).slice(0, -1)));
            break;
          default:
            d3.selectAll('#Sankey')
              .remove();
            break;
        }
      }

    });

}


function getselectedSankey() {

  var c = document.getElementsByName("Checkbox");
  var selectedArray = [];

  for (var i = 0; i < c.length; i++) {
    if (c[i].checked == true) {
      if (selectedArray.length == 3) {
        selectedArray = [];
        for (var i = 0; i < c.length; i++) {
          c[i].checked = false;
        }
        break;
      }
      selectedArray.push(c[i].id);
    }
  }


  d3.json("https://gist.githubusercontent.com/HIHYUN/c32fd49b6affc577dd42a7462239c4c4/raw/f478cf664521964fa22b766c4dd15f3ff0114b03/Victims_2013_2019.json")
    .then(function (data) {
      const keys = Object.keys(data[0]);
      var length = selectedArray.length;


      switch (length) {
        case 1:
          d3.selectAll('#Sankey')
            .remove();
          var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
          Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
          break;
        case 2:
          d3.selectAll('#Sankey')
            .remove();
          var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
          Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
          var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
          Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
          break;
        case 3:
          d3.selectAll('#Sankey')
            .remove();
          var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
          Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
          var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
          Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
          var Graph3 = align_bykey(Filter(data, 'City', selectedArray[2]), keys, key_index);
          Sankey(graph(Graph3, Object.keys(Graph3[0]).slice(0, -1)));
          break;
        default:
          d3.selectAll('#Sankey')
            .remove();
          break;
      }
    });

}


/*
var selectedArray = [];
function getselectedSankey() {

  if (selectedArray.length == 3) {
    selectedArray = [];
    var cell = document.getElementById("Select_namebox");
    while (cell.hasChildNodes()) {
      cell.removeChild(cell.firstChild);
    }

    var selectid = document.getElementById("options_listbox");
    var selectText = selectid.options[selectid.selectedIndex].value;
    selectedArray.push(selectText);
  }

  else {
    var selectid = document.getElementById("options_listbox");
    var selectText = selectid.options[selectid.selectedIndex].value;
    selectedArray.push(selectText);
  };
  selectedArray = [...new Set(selectedArray)];



  d3.json("https://gist.githubusercontent.com/HIHYUN/c32fd49b6affc577dd42a7462239c4c4/raw/f478cf664521964fa22b766c4dd15f3ff0114b03/Victims_2013_2019.json")
    .then(function (data) {
      const keys = Object.keys(data[0]);
      var length = selectedArray.length;

      

      switch (length) {
        case 1:
          d3.selectAll('#Sankey')
            .remove();
          var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
          Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
          break;
        case 2:
          d3.selectAll('#Sankey')
            .remove();
          var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
          Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
          var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
          Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
          break;
        case 3:
          d3.selectAll('#Sankey')
            .remove();
          var Graph1 = align_bykey(Filter(data, 'City', selectedArray[0]), keys, key_index);
          Sankey(graph(Graph1, Object.keys(Graph1[0]).slice(0, -1)));
          var Graph2 = align_bykey(Filter(data, 'City', selectedArray[1]), keys, key_index);
          Sankey(graph(Graph2, Object.keys(Graph2[0]).slice(0, -1)));
          var Graph3 = align_bykey(Filter(data, 'City', selectedArray[2]), keys, key_index);
          Sankey(graph(Graph3, Object.keys(Graph3[0]).slice(0, -1)));
          break;
        default:
          break;
      }
    });

};*/


function get_legend(clicked_id) {
  if (clicked_id == "focus_offical") {
    var i = document.getElementById("Chart_context");
    i.innerHTML = "City -> Official Disposition of Death -> Armed -> Weapon -> Threat Level -> Race"

    var dispostion_color = {
      "Justified": "#007f5f",
      "Unreported": "#2b9348",
      "No Murder": "#55a630", // 무죄 판결
      "Acquitted": "#80b918", // 살인죄로 기소 그러나 무죄 판결
      "Dismissed": "#aacc00",  // 기소 기각, 사건 종료


      "Accidental": "#ffc300", //우발적 사고

      "Excusable": "#FF9696",//"#a71e34",  // 변명 여지 있음
      "Charged": "#FF5050",//"#a11d33",
      "Discipline": "#EB0000",//"#85182a", //행정 명령
      "Unjustified": "#B90000",//"#6e1423",
      "Murder": "#800000",//"#641220",

      "Investing": "#adb5bd", //조사 진행 중
      "Unknown": "#dee2e6",
    };

    var color = d3.scaleOrdinal(Object.keys(dispostion_color), Object.values(dispostion_color)).unknown("#dee2e6");
    legend({ title: "Official Disposition Color", color });
    key_index = [4, 9, 12, 13, 14, 2];
  }

  else if (clicked_id == "focus_race") {
    var i = document.getElementById("Chart_context");
    i.innerHTML = "City -> Race -> Armed -> Weapon -> Threat Level -> Official Disposition of Death"

    var race_color = {
      "Black": "#8A5A44",
      "Pacific Islander": "#D4A373",
      "Hispanic": "#E6B8A2",
      "Asian": "#FEC89A",
      "White": "#FFB5A7",
      "Native American": "#A44A3F",
      "Unknown": "#dee2e6",
    };
    var color = d3.scaleOrdinal(Object.keys(race_color), Object.values(race_color)).unknown("#dee2e6");
    legend({ title: "Race Color", color });
    key_index = [4, 2, 12, 13, 14, 9];


  }

}


function legend({

  color,
  title,
  tickSize = 0,
  width = 700,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues,

} = {}) {

  d3.selectAll('#Color_Legend')
    .remove();

  const svg = d3.select("#Chart_Color").append("svg")
    .attr('id', 'Color_Legend')
    .attr('margin', 10)
    .attr("width", width)
    .attr("height", height + 30)
    .attr("viewBox", [0, 0, width, height])
    .style("overflow", "visible")
    .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
      .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
      { range() { return [marginLeft, width - marginRight]; } });

    svg.append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
      = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
          : color.domain(); // scaleThreshold

    const thresholdFormat
      = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;

    x = d3.scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", marginTop)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
      .domain(color.domain())
      .rangeRound([marginLeft, width - marginRight]);


    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
      .attr("x", x)
      .attr("y", marginTop)
      .attr("width", Math.max(0, x.bandwidth() - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", color);

    tickAdjust = () => { };
  }

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
      .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
      .tickSize(tickSize)
      .tickValues(tickValues))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", marginLeft)
      .attr("y", marginTop + marginBottom - height - 6)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .attr("font-size", "13px")
      .text(title));


  return svg.node();
}
