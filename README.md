# Hclsvg

Light and easy to use graphic library for Angular : 
- line, rectangle, circle, arc, polyline, polygon, text, path, image
- translate, rotate, scale, remove all shapes
- make shapes draggable or clickable, including callbacks
- export complete SVG code or corresponding PNG image

Author :  hcl@oceanvirtuel.com

## Installation

```bash
npm install hclsvg
```

## Documentation

### Setup
Typical use in xxxx.component.ts
```
import { Component, OnInit } from '@angular/core';
import { Hclsvg } from 'hclsvg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {

    const draw = new Hclsvg('mysvg')
    draw.setCanvasSize({width: 400, height: 300})
    draw.rect({
	  x: 50,
	  y: 30,
	  width: 250,
	  height: 80,
      stroke: '#c00',
      strokeWidth: 3,
      fill: '#008',
      fillOpacity: 0.3
    });
    
  }
}
```
The component's HTML template shall include this code somewhere:
```
<svg id="mysvg"></svg>
```


### Methods

#### *Common parameters*

Each shape drawn in SVG has a common set of parameters, as the style of the stroke for instance. Therefore each Hclsvg method that generates a shape can receive one or many of the following parameters. **They are not mandatory**, if one of them is not present, a default value will be used :
```
stroke:          string  //either 'none', 'rgb(...)', '#...', 'rgba(...)'
strokeWidth:     number  //in pixels
strokeOpacity:   string  //from 0 transparent to 1 opaque
strokeLinecap:   string  //SVG syntax for the stroke-linecap ('butt', 'round', 'square')
strokeDasharray: string  //SVG syntax for the stroke-dasharray, e.g. '20,10,5,5,5,10'
transform:       string  //svg transform string, e.g. 'rotate(45, 200,100)'
fill:            string  //either 'none', 'rgb(...)', '#...', 'rgba(...)'
fillOpacity:     number  //from 0 transparent to 1 opaque
```

In addition to this, each SVG element requires some dedicated parameters. These last are described in the following list of methods. **They are not mandatory**, if one of them is not present, a default value will be used.

#### *setCanvasSize()*
```
draw.setCanvasSize() ({ 
	width: number, //in pixels
	height:number  //in pixels
})
```

#### *line()*
```
draw.line({
	x1: number,          //left position of start point in pixels
	y1: number,          //top position of the start point in pixels
	x2: number,          //left position of end point in pixels
	y2: number,          //top position of the end point in pixels
	[common parameters]
})
```

#### *polyline()*
```
draw.polyline({
	points: array, //Array of arrays of pixels [ [x0,y0], [x1,y1], ...]
	[common parameters]
})
```

#### *polygon()*
```
draw.polygon({
	points: array, //Array of arrays of pixels [ [x0,y0], [x1,y1], ...]
	[common parameters]
})
```

#### *rect()*
```
draw.rect({
	x: number,            //left position in pixels
	y: number,            //top position in pixels
	width: number,        //in pixels
	height: number,       //in pixels
	[common parameters]
})
```
#### *circle()*
```
draw.circle({
	cx: number,            //left position of the center in pixels
	cy: number,            //top position of the center in pixels
	r: number,             //radius in pixels
	[common parameters]
})
```
#### *arc()*
```
draw.arc({
	cx: number,            //left position of the center in pixels
	cy: number,            //top position of the center in pixels
	r: number,             //radius in pixels
	startAngle: number,    //from -360 to 360
	endAngle: number,      //from -360 to 360
	[common parameters]
})
```

#### *path()*
```
draw.path({
	path: string,          //value of the attribute d of a path SVG tag
	[common parameters]
})
```

#### *text()*
```
draw.text({
	x: number,             //left position in pixels
	y: number,             //top position in pixels
	textAnchor: string     //'start', 'middle' or 'end'
	fontSize: number       //in pixels
	fontFamily: string     //the name of the HTML fonts
	text:                  //the text to be displayed
	[common parameters]
})
```

#
#### *image()*
Because the image is loaded over an asynchronous process, it can be accessed after the return of a promise (use of .then(...)).
All imported images are translated into a base64 url image. 
You will be able to export an imported image only if the provider of the image allows your cross origin.
```
draw.image({
	x: number,        //left position in pixels
	y: number,        //top position in pixels
	width: number,    //in pixels
	height: number,   //in pixels
	src: string       //the src attribute of the image (url, data/image, ...)
	[common parameters]
}).then( (image) => {
	const myimage = image;
});
```

#### *translate()*
```
let myrect = draw.rect({...});

draw.translate(myrect, {
	dx: number,            //x shift in pixels
	dy: number,            //y shift in pixels
})
```

#### *rotate()*
```
let myrect = draw.rect({...});

//To rotate around the center of the chape
draw.rotate(myrect, {angle: 45});

//To rotate from a different axis
draw.rotate(myrect, {
	angle: number   //rotation angle from -360 to 360
	cx: number,     //x coordonate of the center of rotation in pixels
	cy: number,     //y coordonate of the center of rotation in pixels
})
```

#### *scale()*
```
let myrect = draw.rect({...});

draw.scale(myrect, {
	x: number,  //scale factor on x axis
	y: number,  //scale factor on y axis, equal to x scale factor if omitted
})
```

#### *remove()*
```
let myrect = draw.rect({...});

draw.remove(myrect);
```

#### *makeClickable()*

```
let myrect = draw.rect({...});

//if you provide a callback
draw.makeClickable(myrect, {
   onclick: this.onClick,  //callback on click
})

//The parameter bbox passed to the callback 
//is the getBoundingClientRect of myrect
onClick(bbox) {
   console.log(bbox)
   //do whatever you want here ...
}
```

#### *disableClickable()*

```
draw.disableClickable(myrect);
```

#### *makeDraggable()*

```
let myrect = draw.rect({...});

//if you do not provide any callback
draw.makeDraggable(myrect) 

//if you provide callbacks
draw.makeDraggable(myrect, {
   dragstart: this.dragStart,  //callback on drag start, optional
   ondrag: this.onDrag,        //callback when dragging, optional
   dragend: this.dragEnd       //callback on drag end, optional
})

//The parameter bbox passed to the callbacks 
//is the getBoundingClientRect of myrect
dragStart(bbox) {
   console.log(bbox)
   //do whatever you want here ...
}
onDrag(bbox) {
   console.log(bbox)
   //do whatever you want here ...
}
dragEnd(bbox) {
   console.log(bbox)
   //do whatever you want here ...
}
```

#### *disableDraggable()*
```
let myrect = draw.rect({...});

//Set draggable
draw.makeDraggable(myrect, {
   dragstart: this.dragStart,  //callback on drag start
   ondrag: this.onDrag,        //callback when dragging
   dragend: this.dragEnd       //callback on drag end
})

...

//Unset draggable
draw.disableDraggable(myrect);
```

#### *exportSvg()*
```
const svg_code = draw.exportSvg();
```

#### *exportPng()*
```
//Require to install the npm module "file-saver"
import { saveAs } from 'file-saver';

...

//The function exportPng returns a promise containing 
//the PNG image as a Base64 URL format
draw.exportPng().then( (image) => {
	
	//image can be used as the src of an <img> tag,
	//eg. <img [attr.src]="imgSrc" />,
	//referenced in the component's HTML template
	this.imgSrc = image;
	
	//image can be dowloaded
	saveAs(image, 'myimage.png');
});
```













## Dev infos

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

### Code scaffolding

Run `ng generate component component-name --project hclsvg` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project hclsvg`.
> Note: Don't forget to add `--project hclsvg` or else it will be added to the default project in your `angular.json` file. 

### Build

Run `ng build hclsvg` to build the project. The build artifacts will be stored in the `dist/` directory.

### Publishing

After building your library with `ng build hclsvg`, go to the dist folder `cd dist/hclsvg` and run `npm publish`.

### Running unit tests

Run `ng test hclsvg` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
