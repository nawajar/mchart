
function medicalChart() {
    this._svg = null;
    this.pill = (w, h , totalIndicatorLabel , startPoint , endPoint , valuePosition) => {
        var svg = getNode("svg", { width: w, height: h });
        var r = getNode('text', { x: '50%', y: '45%', fill: 'red', fontSize: '10px', textAnchor:"middle" });
        var textNode = document.createTextNode(totalIndicatorLabel);
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('rect', { x: '10%', y: '50%', width: '80%', height: 10, fill: 'none', rx: 5, ry: 5, stroke: '#D3D3D3', strokeWidth: "1" });
        svg.appendChild(r);
        

        var r = getNode('rect', { x: '20%', y: '50%', width: '60%', height: 10, fill: '#D3D3D3', rx: 5, ry: 5 });
        svg.appendChild(r);

        var percantage = 0;
        if(valuePosition == 50 ) {
            percantage = valuePosition
        }else if (valuePosition < 50) {
            percantage = valuePosition + 12;
        }else if (valuePosition > 50) {
            percantage = valuePosition - 12;
        }
        //var percantage = valuePosition < 49 ? valuePosition + 12 : valuePosition - 12;
        //percantage = percantage < 180 ? percantage + 15 : percantage + 5;
        var r = getNode('circle', { cx: percantage + '%', cy: '55%', r: 5, fill: 'red', x: 90 });
        svg.appendChild(r);

        var r = getNode('text', { x: '50%', y: '58%', fill: '#A9A9A9', fontSize: '8px', width: '80%', textAnchor:"middle" });
        var textNode = document.createTextNode('Referance Range');
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('text', { x: '20%', y: '70%', fill: 'black', fontSize: '8px', textAnchor:"middle" });
        var textNode = document.createTextNode(startPoint);
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('text', { x: '80%', y: '70%', fill: 'black', fontSize: '8px', textAnchor:"middle" });
        var textNode = document.createTextNode(endPoint);
        r.appendChild(textNode);
        svg.appendChild(r);
        this._svg = svg;
        return svg;
    };

    this.toImg = () => {
        var xml = new XMLSerializer().serializeToString(this._svg);
        var svg64 = btoa(xml); //for utf8: btoa(unescape(encodeURIComponent(xml)))
        var b64start = 'data:image/svg+xml;base64,';
        var image64 = b64start + svg64;
        return image64;
    }

    function getNode(n, v) {
        n = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (var p in v)
            n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
        return n
    }

    this.bar = (w, h , refRang,  data) => {

        const pad = 35;
        var svg = getNode("svg", { width: w, height: h });
        var xline = getNode('line', { x1: pad , y1: h-pad  , x2:w-pad ,y2:h-pad ,strokeWidth:1 , stroke: '#D3D3D3'  });
        svg.appendChild(xline);

        var r = getNode('text', { x: w-pad, y: h-pad, fill: 'black', fontSize: '6px', textAnchor:"right", dominantBaseline:"central" });
        var textNode = document.createTextNode('Date');
        r.appendChild(textNode);
        svg.appendChild(r);

        var xlineWidth = (w-pad) - pad - (10);
        data = ['10 Jun 2020', '10 Jun 20', '10 Jun 20', '10 Jun 20', '10 Jun 20'];
        var point = xlineWidth / data.length;
        console.log(point);

        var index = 0;
        for(let i of data) {
            var x = index == 0 ? (pad) : x + point;
        
            var r = getNode('text', { x: x, y: h-pad , 
                width: 20,
                fill: 'black', 
                width: 10, 
                textAnchor:"middle",
                style:"width:10px;height:40px;white-space: nomal;font-size:5px" 
            });
            var tspan1 = getNode('tspan', { x: x, 
                dy: '1.2em',
                fill: 'black', 
            });
            var tspan2 = getNode('tspan', { x: x, 
                dy: '1.2em',
                fill: 'black', 
            });
            var textNode1 = document.createTextNode(i.split(' ')[0]);
            var textNode2 = document.createTextNode(i.split(' ')[1] + i.split(' ')[2]);
            tspan1.appendChild(textNode1);
            tspan2.appendChild(textNode2);

            r.appendChild(tspan1);
            r.appendChild(tspan2);
            svg.appendChild(r);
            index +=1;
        }

        var yline = getNode('line', { x1: pad , y1: pad + 30  , x2:pad ,y2:h-pad - 30 ,strokeWidth:1 , stroke: '#D3D3D3'  });
        svg.appendChild(yline);
        var refrange = [11.6 , 15];
        var r = getNode('text', { x: pad-30, y: h-pad - 30 , 
            width: 20,
            fill: 'black', 
            width: 10, 
            style:"font-size:5px" 
        });
        var textNode = document.createTextNode(refrange[0] + 'g/dL');
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('text', { x: pad-30, y: pad  + 30, 
            width: 20,
            fill: 'black', 
            width: 10, 
            style:"font-size:5px" 
        });
        var textNode = document.createTextNode(refrange[1] + 'g/dL');
        r.appendChild(textNode);
        svg.appendChild(r);

        var rect = getNode('rect', { x: pad  , y: pad + 30   , width: w-pad -30, height: h-pad-30-35-30, fill: '#DCDCDC' , opacity: .5 });
        svg.appendChild(rect);

        for(let i=1; i <= w-pad * 2; i+=10) {
            var cross = getNode('line', { x1: pad + i + 10 , y1: pad  , x2:pad +i + 10 ,y2:h-pad  ,strokeWidth:.1 , stroke: '#D3D3D3'  });
            svg.appendChild(cross);
        }

        for(let i=1; i <= h-pad * 2; i+=10) {
            var crossx = getNode('line', { x1: pad , y1: pad + i + 10  , x2:w-pad ,y2:pad + i + 10 ,strokeWidth:.1 , stroke: '#D3D3D3'  });
            svg.appendChild(crossx);
        }

       


        return svg;
    }
}
