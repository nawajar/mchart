
function medicalChart() {
    this._svg = null;
    this.pill = (w, h , totalIndicatorLabel , startPoint , endPoint , valuePosition) => {

        var xPad = 20;
        var svg = getNode("svg", { width: w, height: h });
        var r = getNode('text', { x: '50%', y: '45%', fill: 'red', fontSize: '10px', textAnchor:"middle" });
        var textNode = document.createTextNode(totalIndicatorLabel);
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('rect', { x: '10%', y: '50%', width: w * 0.8, height: 10, fill: 'none', rx: 5, ry: 5, stroke: '#D3D3D3', strokeWidth: "1" });
        svg.appendChild(r);
        
        //console.log(w);
        var r = getNode('rect', { x: '25%', y: '50%', width: w * 0.5, height: 10, fill: '#D3D3D3', rx: 5, ry: 5 });
        svg.appendChild(r);

        var padLeftRight = w * 0.5 / 2;
        //console.log(padLeftRight);
        var startXRefRange = padLeftRight;
        var endXRefRange = w - padLeftRight;
        //console.log(startXRefRange , endXRefRange);

        var barWidth = endXRefRange - startXRefRange;
        console.log(barWidth);

        var rangeWidth = endPoint - startPoint;
        console.log(rangeWidth);

        var subRatio = barWidth / rangeWidth;
        console.log(subRatio);
        

        var circlePosition = 0;
        var isInrange = false;
        if(valuePosition <= startPoint) {
            var dif = startPoint - valuePosition;
            if(dif == 0) {
                circlePosition = startXRefRange - 5;
                isInrange = true;
            }else {
                circlePosition = padLeftRight - dif * subRatio - 5;
            }
        }

        if(valuePosition > startPoint) {
            var dif = valuePosition - startPoint;
            circlePosition = padLeftRight + (dif * subRatio) - 5;
            isInrange = true;
        }

        if(valuePosition > endPoint) {
            isInrange = false;
        }
        console.log(circlePosition);
       

        var r = getNode('text', { x: '50%', y: '58%', fill: '#A9A9A9', fontSize: '8px', width: '80%', textAnchor:"middle" });
        var textNode = document.createTextNode('Referance Range');
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('circle', { cx: circlePosition , cy: '55%', r: 5, fill: isInrange? 'blue': 'red', x: 90 , opacity: .5 });
        svg.appendChild(r);

        var r = getNode('text', { x: '25%', y: '70%', fill: 'black', fontSize: '8px', textAnchor:"middle" });
        var textNode = document.createTextNode(startPoint);
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('text', { x: '75%', y: '70%', fill: 'black', fontSize: '8px', textAnchor:"middle" });
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

    this.bar = (w, h , refRange,  data) => {

        const pad = 35;
        var svg = getNode("svg", { width: w, height: h });
        var xline = getNode('line', { x1: pad , y1: h-pad  , x2:w-pad ,y2:h-pad ,strokeWidth:1 , stroke: '#D3D3D3'  });
        svg.appendChild(xline);

        var r = getNode('text', { x: w-pad+10, y: h-pad, fill: 'black', fontSize: '6px', textAnchor:"right", dominantBaseline:"central" });
        var textNode = document.createTextNode('Date');
        r.appendChild(textNode);
        svg.appendChild(r);

        var xlineWidth = (w-pad) - pad - (10);
        var point = xlineWidth / data.length;
        var pointTemp = [];
        var index = 0;
        
        for(let i of data) {
            var isInRange = false;
            var x = index == 0 ? (pad) : x + point;
            var calYPoint = 0;
            var ylineHeight = (h - pad - 30) - (pad + 30);
            var barRatio = ylineHeight / (refRange[1] - refRange[0]);

            if(i.value <= refRange[0] ) {
                var dif = refRange[0] - i.value;
                if(dif == 0) {
                    calYPoint = h- pad - 30;
                    isInRange = true;
                }else{
                    calYPoint = h- pad - 30 + (barRatio * dif);
                }
            }

            if(i.value >= refRange[1]) {
                var dif = i.value - 15; 
                calYPoint = pad+ 30 - (barRatio * dif);
                if(dif === 0) {
                    isInRange = true;
                }
            }
            
            if(i.value > refRange[0] && i.value < refRange[1]) {
                var dif = 15 - i.value;
                calYPoint = pad + 30 + (barRatio * dif);
                isInRange = true;
            }
            
            pointTemp.push({
                x: x+10,
                y: calYPoint
            });
            
            var circle = getNode('circle', { 
                cx: x+ 10,
                cy: calYPoint,
                r: 2,
                fill: isInRange ? 'blue':'red'
            });
            svg.appendChild(circle);
            var r = getNode('text', { x: x+ 10, y: calYPoint + 5, fill: 'black', fontSize: '6px', textAnchor:"middle", dominantBaseline:"central" });
            var valueText = document.createTextNode(Number(i.value).toFixed(1));
            r.appendChild(valueText);
            svg.appendChild(r);

            var r = getNode('text', { x: x + 10, y: h-pad , 
                width: 20,
                fill: 'black', 
                width: 10, 
                textAnchor:"middle",
                style:"width:10px;height:40px;white-space: nomal;font-size:5px" 
            });
            var tspan1 = getNode('tspan', { x: x+10, 
                dy: '1.2em',
                fill: 'black', 
            });
            var tspan2 = getNode('tspan', { x: x+10, 
                dy: '1.2em',
                fill: 'black', 
            });
            var textNode1 = document.createTextNode(i.date.split(' ')[0]);
            var textNode2 = document.createTextNode(i.date.split(' ')[1] + i.date.split(' ')[2]);
            tspan1.appendChild(textNode1);
            tspan2.appendChild(textNode2);

            r.appendChild(tspan1);
            r.appendChild(tspan2);
            svg.appendChild(r);
            index +=1;
        }
        var next = 1;
        for (let p of pointTemp) {
            if(p.x && pointTemp[next]) {
                var xline = getNode('line', { x1: p.x , y1: p.y  , x2:pointTemp[next].x ,y2: pointTemp[next].y ,strokeWidth:1 , stroke: '#4682B4' ,strokeDasharray: next == 1 || next == 2 ? "2" : "0"  });
                svg.appendChild(xline);
            }
            next++;
        }

        var yline = getNode('line', { x1: pad , y1: pad + 30  , x2:pad ,y2:h-pad - 30 ,strokeWidth:1 , stroke: '#D3D3D3'  });
        svg.appendChild(yline);
        var r = getNode('text', { x: pad-30, y: h-pad - 30 , 
            width: 20,
            fill: 'black', 
            width: 10, 
            style:"font-size:5px" 
        });
        var textNode = document.createTextNode(refRange[0] + 'g/dL');
        r.appendChild(textNode);
        svg.appendChild(r);

        var r = getNode('text', { x: pad-30, y: pad  + 30, 
            width: 20,
            fill: 'black', 
            width: 10, 
            style:"font-size:5px" 
        });
        var textNode = document.createTextNode(refRange[1] + 'g/dL');
        r.appendChild(textNode);
        svg.appendChild(r);

        var rect = getNode('rect', { x: pad  , y: pad + 30   , width: w-pad -35, height: h-pad-30-35-30, fill: '#DCDCDC' , opacity: .3 });
        svg.appendChild(rect);

        for(let i=1; i <= w-pad * 2; i+=10) {
            var cross = getNode('line', { x1: pad + i + 10 , y1: pad  , x2:pad +i + 10 ,y2:h-pad  ,strokeWidth:.1 , stroke: '#D3D3D3'  });
            svg.appendChild(cross);
        }

        for(let i=1; i <= h-pad * 2; i+=10) {
            var crossx = getNode('line', { x1: pad , y1: pad + i + 10  , x2:w-pad ,y2:pad + i + 10 ,strokeWidth:.1 , stroke: '#D3D3D3'  });
            svg.appendChild(crossx);
        }

        this._svg = svg;
        return svg;
    }
}
