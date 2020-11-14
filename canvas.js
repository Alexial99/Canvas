let self;
class Chart {
    constructor(axisNameX, axisNameY, coordinates, colorLine, id, size, showAxisValues) {
        this.axisNameX = axisNameX;
        this.axisNameY = axisNameY;
        this.coordinates = coordinates;
        this.colorLine = colorLine;
        this.id = id;
        this.width = size[0];
        this.height = size[1];
        this.showAxisValues = showAxisValues;
        self = this;
        this.createCanvas();

        //this.createChart(); ///Object.keys(object).length
    }

    createCanvas() {

        let element = document.getElementById(this.id);
        element.innerHTML = ` <canvas id="canvasOn${this.id[0].toUpperCase() + this.id.slice(1)}" height="${this.height} " width="${this.width}"> </canvas> `;
        let canvas = document.getElementById("canvasOn" + (this.id[0].toUpperCase() + this.id.slice(1)));
        // console.log(canvas);
        let elementInitialCoordinates = this.rotateCanvas(canvas);

        //  console.log (scaling);
        this.createChart(canvas, elementInitialCoordinates)

    }

    scalingCanvas() {
        let sizeGapOgAxis = 50;
        let width =sizeGapOgAxis*Math.floor((this.width - 36) / sizeGapOgAxis);
        let height = sizeGapOgAxis*Math.floor((this.height - 36) / sizeGapOgAxis);
       // console.log(width);
        let allArray = [];
        for (let key in this.coordinates) {
            allArray = allArray.concat(this.coordinates[key]);
        }
        let maxCoordinateX = maxNumberOfArr(0);
        let maxCoordinateY = maxNumberOfArr(1);
        let minCoordinateX = minNumberOfArr(0);

        function maxNumberOfArr(axis) {
            let number = 0;
            for (let subArr of allArray) {
                if (number < Number(subArr[axis])) {
                    number = Number(subArr[axis]);
                }
            }
            return number;
        }
        function minNumberOfArr(axis) {
            let number = 0;
            for (let subArr of allArray) {
                if (number > Number(subArr[axis])&&(Number(subArr[axis])!=0)) {
                    number = Number(subArr[axis]);
                }
            }
            return number;
        }


        function depthComparatorInverse(left, right) {
            if (left[0] < right[0]) {
                return -1;
            }
            if (right[0] < left[0]) {
                return 1;
            }
            if (left[1] < right[1]) {
                return -1;
            }
            if (right[1] < left[1]) {
                return 1;
            }
            return 0;
        }

        let arrCoordinates=Object.assign(this.coordinates);


       for(let key in arrCoordinates){
           arrCoordinates[key].sort(depthComparatorInverse);
       //    alert ( arrCoordinates[key]);

        }

        let scalingFactorX = scaleOfAxis(width, maxCoordinateX);
        let scalingFactorY = scaleOfAxis(height, maxCoordinateY);
        //alert([height, maxCoordinateY]);

        function scaleOfAxis(axis, maxCoordinate) {
            if (axis - 21 < maxCoordinate) {
                let x = maxCoordinate / (axis - 21);
                if ((String(x).slice(String(x).indexOf('.') + 1, String(x).indexOf('.') + 2)) < 5) {
                    x = Number(Math.trunc(x) + "." + 5);
                } else {
                    x = Math.ceil(x);

                }
                return 1 / x;
            }
            else if ((axis - 21 > maxCoordinate)&&((  (axis - 21) /maxCoordinate)>1.5)){
                let x =  (axis - 21) /maxCoordinate;
                if ((String(x).slice(String(x).indexOf('.') + 1, String(x).indexOf('.') + 2)) < 5) {
                    x = Number(Math.trunc(x) + "." + 5);
                } else {
                   // x = Math.ceil(x);
                    x=Number(x.toFixed(1));
                }
                return  x;
            } else {
                return 1;
            }
        }

        // console.log([maxCoordinateX,maxCoordinateY]);
        //console.log(scalingFactorX);
//console.log(scalingFactorY);
        /* let lengthHeight= String(this.height-21).length - 1;
         let lengthWidth= String(this.width-21).length - 1;*/

        return [scalingFactorX, scalingFactorY,sizeGapOgAxis,[maxCoordinateX,maxCoordinateY],width,minCoordinateX,arrCoordinates];
    }


    createChart(canvas, elementInitialCoordinates) {
        let scalingWheel=1;
        let ctx = canvas.getContext('2d');
        let scaling = this.scalingCanvas();
        let min = this.axisDrawing(ctx, canvas, scaling,scalingWheel);

        let scale=scaling[1];
        scaling[8]=min[2];
        let coordinates =scaling[6];
        for (let key in coordinates) {
            // console.log(this.coordinates[key]);
            this.lineDrawing(coordinates[key], canvas, elementInitialCoordinates, ctx, this.colorLine[key], scaling,scalingWheel,scale);
        }
        //this.createScrollbar(scaling[4],scaling[4]);

    }

    axisDrawing(ctx, canvas, scaling,scalingWheel) {
      //  console.log(scaling);
        let sizeOfInterval = scaling[2];
       // console.log("scaling[2]:" ,scaling[2],scalingWheel);
        let numberDivisionsX = Math.floor((this.width - 36) / sizeOfInterval);
       // console.log(numberDivisionsX);
        let numberDivisionsY = Math.floor((this.height - 36) / sizeOfInterval);
        ctx.beginPath();

        ctx.font = "14px serif";
        ctx.fillText(this.axisNameY, -50 + this.width, -57 + canvas.getBoundingClientRect().top, [50]);

        ctx.rotate(90 * Math.PI / 180);
        ctx.fillText(this.axisNameX, -55 + this.width, -75 + canvas.getBoundingClientRect().top, [50]);
        ctx.strokeStyle='black';
        ctx.rotate(-90 * Math.PI / 180);
        ctx.lineWidth = 1;
        ctx.moveTo(36, 35);
        ctx.lineTo(36, sizeOfInterval*numberDivisionsX +36);
        ctx.moveTo(35, 36);
        ctx.lineTo(sizeOfInterval*numberDivisionsY+36, 36);
        ctx.stroke();
        let point=[];
        divisionsDrawing(numberDivisionsX, ctx, "x", this.showAxisValues, scaling);
        divisionsDrawing(numberDivisionsY, ctx, "y", this.showAxisValues, scaling);

        function divisionsDrawing(number, ctx, axis, showAxisValues, scaling) {
            let i = 0;
            let axisCoordinate = 0;
    //        alert(sizeOfInterval);
            while (i < number) {
                i++;
                axisCoordinate = axisCoordinate + sizeOfInterval;
                if (axis === "y") {
                    ctx.moveTo(axisCoordinate + 35, 32);
                    ctx.lineTo(axisCoordinate + 35, 40);

                    if ((showAxisValues)) {
                        ctx.fillText(String(Math.round(axisCoordinate / scaling[1])), 6 + axisCoordinate + 19, -41 + canvas.getBoundingClientRect().top, [50]);

                    }
                } else {
                    ctx.moveTo(32, axisCoordinate + 35);
                    ctx.lineTo(40, axisCoordinate + 35);

                    if ((showAxisValues)) { //&&(i!=number)
                        point.push(Math.round(axisCoordinate / scaling[0]/scalingWheel));
                        ctx.rotate(90 * Math.PI / 180);
                        ctx.fillText(String(Math.round(axisCoordinate / scaling[0]/scalingWheel)), 6 + axisCoordinate + 19, -91 + canvas.getBoundingClientRect().top, [50]);
                    /*    console.log(axisCoordinate);
                        console.log(scaling[1]);
                        console.log(scalingWheel);
*/
                        ctx.rotate(-90 * Math.PI / 180);
                    }
                }

                ctx.stroke();

            }

        }

   //      console.log(point); //300.23
        // let String(this.height-20).length - 2;
        //console.log();
        return [scaling[2],[numberDivisionsX,numberDivisionsY],point[0]]
    }

    rotateCanvas(canvas) {

        let canvasT = canvas.getBoundingClientRect().top;
        let canvasL = canvas.getBoundingClientRect().left;

        canvas.style.transform = 'rotate(-90deg)';
        return [canvasT, canvasL];

    }

    lineDrawing(arr, canvas, elementInitialCoordinates, ctx, color, scaling,scalingWheel,scale) {
  //      console.log(canvas);
       // let ctx =canvas.getContext('2d');
   //     ctx.strokeStyle = null;
        ctx.beginPath();
//console.log([scaling[0],scaling[1]]);
        /*let ctx= canvas.getContext('2d');*/
        ctx.moveTo(Number(arr[0][1]*scaling[1] + 37) /*/scaling[1]*/, Number(arr[0][0]*scalingWheel*scaling[0] + 37))//scaling[0]));
        ctx.strokeStyle = color;
        //    console.log(ctx.strokeStyle);
        ctx.arc(Number(arr[0][1]*scaling[1] + 37) /*/scaling[1]*/, Number(arr[0][0]*scaling[0]*scalingWheel + 37), 2, 0, Math.PI * 2, true);//scaling[0]

        let arrTwo = arr.slice(1, arr.length);
                                                     //   let circle = new Path2D(); // const !!!
        for (let subarray of arrTwo) {
            ctx.lineTo(Number(subarray[1]*scaling[1] + 37)/*/scaling[1]*/, Number(subarray[0]*scalingWheel*scaling[0]) + 37);/*scaling[0]*/
            ctx.arc(Number(subarray[1]*scaling[1] + 37)/*/scaling[1]*/, Number(subarray[0]*scalingWheel*scaling[0] + 37), 2, 0, Math.PI * 2, true);/*/scaling[0]*/
        }

        ctx.stroke();

        // canvas.onmousemove = hitHandler;
        canvas.thisParam = [canvas, elementInitialCoordinates, scaling, scalingWheel,scale];
        canvas.onmousemove = this.newHitHandler;
        canvas.onmousewheel = this.scalingPath;

    }

    createScrollbar(width,trumbWidth,left,thisData){

       console.log("hi");
        let element = document.getElementById("scrollbar");
        element.innerHTML = " <div id='track' class='scrollbar-track' style='width:"+width+"px; left:"+(left+36)+"px;position: fixed;'><button id='scrollButton' class='scrollbar-thumb' style='width:"+trumbWidth+"px;position: relative;left=1px'></button></div>";
        let scrollButton= document.getElementById("scrollButton") ;
        scrollButton.thisParam=[thisData];
        scrollButton.onmousedown=this.moveButton;
      //  scrollButton.onmouseup=this.close;
}
/*close(e){
       // e.target.onmousedown -=self.moveButton;
       // e.target.onmousemove -=self.moveButton;
    }*/
moveButton(e){
    console.log(e.target);
    window.onmouseup=close;

    e.target.onmousemove=getCoordinateX;
   // let ox= e.clientX;
    //let leftButton=e.target.thisParam[3];

    let slider = document.getElementById('track');
    let item = e.target;
   // let result = document.getElementById('result');
    let sliderClientCoords = slider.getBoundingClientRect();
    let sliderCoords = {};
    sliderCoords.top = sliderClientCoords.top + pageYOffset;
    sliderCoords.left = sliderClientCoords.left + pageXOffset;

    let itemClientCoords = item.getBoundingClientRect();
    let itemCoords = {};
    itemCoords.top = itemClientCoords.top + pageYOffset;
    itemCoords.left = itemClientCoords.left + pageXOffset;
    let right = slider.offsetWidth - item.offsetWidth;
    let shiftX = e.pageX - itemCoords.left;
  //  e.target.thisParam=[right,sliderCoords.left,shiftX]
 //   console.log(e.target.style.left);
    function close() {
        e.target.onmousemove -=getCoordinateX;
        // e.target.onmousedown -=self.moveButton;
        e.target.onmouseup -=this;
        // self.createScrollbar(e.target.thisParam[0],e.target.thisParam[1],e.target.thisParam[2], e.target.thisParam[3])
    }
   function getCoordinateX(e) {
      //  let x = e.clientX;
     //   console.log([e.target.thisParam[0], leftButton + e.target.thisParam[1]]);
     //   let maxLength = e.target.thisParam[0] - leftButton + e.target.thisParam[1];


        let newLeft = e.pageX - sliderCoords.left - shiftX;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > right) newLeft = right;
        item.style.left = newLeft + 'px';
        let result =Math.round(newLeft / right * 100);  //процент прокрутки.
        e.target.thisParam[1]=result;
       /* let elem = document.getElementById("scrollButton");
       let event = new Event("onmousedown");
       elem.dispatchEvent(event);*/
       //console.log(result);

       // console.log(e);
       let thisData = e.target.thisParam[0];
       let scaling=thisData[3],canvas=thisData[0],elementInitialCoordinates=thisData[2];
       let scale=thisData[4],ctx=thisData[1],maxNumberOfArr=scaling[3];

     //  ctx.scale(1/scaling[0], 1/scaling[1]);
       //  console.log(scaling[3]);
       ctx.clearRect(0, 0, maxNumberOfArr[0]*scaling[0]+100, maxNumberOfArr[1]*scaling[1]+100);
       console.log(    maxNumberOfArr);
       let k=maxNumberOfArr[0]/100*e.target.thisParam[1];

       let rectSize = self.axisDrawing(ctx, canvas, [scaling[0],scaling[1],scaling[2]],scale);


//alert(rectSize[1][0]*rectSize[0]);

        ctx.rect(36, 36,rectSize[1][0]*rectSize[0],rectSize[1][1]*rectSize[0]);
       ctx.clip();
       ctx.fillStyle='black';
       //   console.log(ctx.fillStyle);
     //  ctx.scale(scaling[0],scaling[1]);
       ctx.translate(0, -k);
let coordinates=scaling[6];
       for (let key in coordinates) {
           // console.log(this.coordinates[key]);
           self.lineDrawing(coordinates[key], canvas, elementInitialCoordinates, ctx, self.colorLine[key], scaling,scale,scale);
       }
       ctx.translate(0, k);
    }

}

/*
     getCoordinateX(e) {

let right=e.target.thisParam[0];
let sliderCoords=e.target.thisParam[1];
let shiftX=e.target.thisParam[2];
        let newLeft = e.pageX - sliderCoords - shiftX;
         console.log(newLeft);
        if (newLeft < 0) newLeft = 0;
        if (newLeft > right) newLeft = right;

        e.target.style.left = newLeft + 'px';
        let result =Math.round(newLeft / right * 100);  //процент прокрутки.
        e.target.thisParam[1]=result;
        console.log(result);

        // console.log(e);

    }*/

   /*  getCoordinateX(e) {
    console.log(e.target.thisParam);*/
        //  let x = e.clientX;
        //   console.log([e.target.thisParam[0], leftButton + e.target.thisParam[1]]);
        //   let maxLength = e.target.thisParam[0] - leftButton + e.target.thisParam[1];



        // console.log(e);
/*
    }*/

scalingPath(e){

    let canvas = e.target.thisParam[0];
    let ctx = canvas.getContext('2d');
    let elementInitialCoordinates = e.target.thisParam[1];
        let scaling=e.target.thisParam[2];
        let scale=e.target.thisParam[4];
     let maxNumberOfArr=scaling[3];

  //  console.log(scaling[1]);
   // console.log(scale);
        // wheelDelta не даёт возможность узнать количество пикселей
        let delta = e.deltaY || e.detail || e.wheelDelta;

        let info = document.getElementById(this.id);
    //    console.log(delta);
        if (delta > 0){ if(scale-0.05>0.8){scale -= 0.05;}}
        else scale += 0.05;
  //  console.log(maxNumberOfArr);
       // ctx.scale(1/scaling[0], 1/scaling[1]);

    if( scaling[8] >1 ){
    ctx.clearRect(0, 0, this.height,this.width );

    self.axisDrawing(ctx, canvas, scaling, scale);
//console.log(scale);
    ctx.fillStyle = 'black';
    //  ctx.scale(scaling[0],scaling[1]);
//alert("ffgghygfjr");
     let coordinates = scaling[6];
  //   console.log(scaling[6]);
    for (let key in coordinates) {
        // console.log(this.coordinates[key]);
        self.lineDrawing(coordinates[key], canvas, elementInitialCoordinates, ctx, self.colorLine[key], scaling, scale, scale);
    }
    let widthTrumb;
    if (scale < 1.5) {
        widthTrumb = scaling[4] / 1.5;
    } else if ((scale => 1.5) && (scale < 2)) {
        widthTrumb = scaling[4] / 2;
    } else if ((scale => 2) && (scale < 2.5)) {
        widthTrumb = scaling[4] / 3;
    } else if ((scale => 2.5) && (scale < 3)) {
        widthTrumb = scaling[4] / 4;
    } else {
        widthTrumb = scaling[4] / 5;
    }
    //  console.log(widthTrumb);

    self.createScrollbar(scaling[4], widthTrumb, elementInitialCoordinates[1], [canvas, ctx, elementInitialCoordinates, scaling, scale]);
    //  info.innerHTML = +info.innerHTML + delta;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}

}


    newHitHandler(event) {
//console.log(event.target.thisParam);
//ctx,canvas,elementInitialCoordinates
        /*let ctx=event.target.thisParam[0];*/

        let canvas = event.target.thisParam[0];
        let ctx = canvas.getContext('2d');
        let elementInitialCoordinates = event.target.thisParam[1];
        let scaling = event.target.thisParam[2];

        let canvasT = canvas.getBoundingClientRect().top;
        let canvasL = canvas.getBoundingClientRect().left;
        //   console.log(canvasT);

        let canvasX, canvasY;
        canvasX = event.clientX - elementInitialCoordinates[1];
        canvasY = event.clientY - elementInitialCoordinates[0];
        /*console.log(canvasX);*/
        let canvasYElemPage = canvasX;
        canvasX = canvasY;
        let canvasXElemPage = this.height - canvasX;
        let coordinates=scaling[6];
        /*if (ctx.isPointInPath(canvasXElemPage, canvasYElemPage)) {*/
        // console.log(self.coordinates);
        for (let key in coordinates) {
            for (let subarray of coordinates[key]) {

                if (((Number(subarray[1] * scaling[1]+ 37) - 1.5)  <= Number(canvasXElemPage)) && (Number(canvasXElemPage) <= (Number(subarray[1]* scaling[1] + 37) + 1.5) )) {
                    if (((Number(subarray[0]* event.target.thisParam[3]* scaling[0] + 37) - 1.5)  <= canvasYElemPage) && (canvasYElemPage <= (Number(subarray[0]*event.target.thisParam[3]* scaling[0] + 37 + 1.5) ))) {
                        console.log('yes');
                        //  console.log(subarray);

                        let point = document.createElement('div');
                        point.className = "pointHints";
                        point.style.left = (event.clientX - 6) + "px";
                        point.style.top = (event.clientY - 6) + "px";
                        canvas.after(point);

                        let span = document.createElement('span');
                        span.className = "coordinateHint";
                        span.style.left = (event.clientX + 5) + "px";
                        span.style.top = (event.clientY + 5) + "px";
                        span.innerHTML = " ( " + subarray[0] + "," + subarray[1] + " )  ";
                        canvas.after(span);

                        point.onmouseout = deleteFunc;

                        function deleteFunc() {
                            setTimeout(() => span.remove(), 1000);
                            point.remove();
                        }
                    }
                }
            }
        }
    }

}
