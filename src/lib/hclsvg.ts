export class Hclsvg {

	tag: any;
	proceed: boolean;
	canvas = {
		width: 0,
		height: 0
	}
	mouseX = 0;
	mouseY = 0;
	mousePos = {
		x:0,
		y:0
	}
	mousePosOld = {
		x:0,
		y:0
	}
	selectedElement = {
		id: null,
		tag: null,
		dragstart: null,
		ondrag: null,
		dragend: null,
		onclick: null
	}
	draggables = [];
	clickables = [];
	lastId = 0;
	imgLoading = 0;


	constructor(
			id: any
	) {
		this.tag = document.getElementById(id);
		if(!this.tag) {
			console.log('hclsvg error: can not find svg tag named "'+id+'"');
			this.proceed = false;
			return;
		}
		if(this.tag.tagName !== 'svg') {
			console.log('hclsvg error: tag "'+id+'" must be <svg ...></svg>');
			this.proceed = false;
			return;
		}
		this.proceed = true;

		document.body.addEventListener('mousemove', (e) => {
			this.onMouseMove(e)
		});
		document.body.addEventListener('mousedown', (e) => {
			this.onMouseDown(e)
		});
		document.body.addEventListener('mouseup', (e) => {
			this.onMouseUp(e)
		});
		document.body.addEventListener('click', (e) => {
			this.onClick(e)
		});
	}

	onMouseMove(e) {

		const bbox = this.tag.getBoundingClientRect();
			this.mousePos = {
				x: e.clientX,
				y: e.clientY
			}

			if(
				(this.selectedElement.tag && this.selectedElement.tag.style.cursor === 'move') &&
				(e.clientX > bbox.left && e.clientX < bbox.left+bbox.width &&
				e.clientY > bbox.top && e.clientY< bbox.top+bbox.height)
			) {
				if(this.selectedElement.tag) {
					const dx = this.mousePos.x - this.mousePosOld.x;
					const dy = this.mousePos.y - this.mousePosOld.y;
					let group = this.selectedElement.tag.parentNode;
					let gx = parseInt(group.getAttribute('x'));
					let gy = parseInt(group.getAttribute('y'));
					group.setAttribute('x', gx+dx)
					group.setAttribute('y', gy+dy)
				}
				if(this.selectedElement.ondrag) {
					this.selectedElement.ondrag(this.selectedElement.tag.getBoundingClientRect());
				}
			}
			this.mousePosOld = this.mousePos;

	}
	onMouseDown(e: any) {
		this.selectedElement.tag = e.target;
		if (this.selectedElement.tag.style.cursor === 'move') {
			const id = this.selectedElement.tag.getAttribute('id');
			for(const item of this.draggables) {
				if(item.id === id) {
					this.selectedElement = item;
					if(this.selectedElement.dragstart) {
						this.selectedElement.dragstart(this.selectedElement.tag.getBoundingClientRect());
					}
					break;
				}
			}
		}
	}
	onMouseUp(e: any) {
		this.selectedElement.tag = e.target;
		if (this.selectedElement.tag.style.cursor === 'move') {
			const id = this.selectedElement.tag.getAttribute('id');
			for(const item of this.draggables) {
				if(item.id === id) {
					this.selectedElement = item;
					if(this.selectedElement.dragend) {
						this.selectedElement.dragend(this.selectedElement.tag.getBoundingClientRect());
					}
					break;
				}
			}
			this.selectedElement = {
				id: null,
				tag: null,
				dragstart: null,
				ondrag: null,
				dragend: null,
				onclick: null
			};
		}
	}

	onClick(e: any) {
		if (this.selectedElement.tag && this.selectedElement.tag.style.cursor === 'pointer') {
			this.selectedElement.tag = e.target;
			const id = this.selectedElement.tag.getAttribute('id');
			for(const item of this.clickables) {
				if(item.id === id) {
					this.selectedElement = item;
					if(this.selectedElement.onclick) {
						this.selectedElement.onclick(this.selectedElement.tag.getBoundingClientRect());
						this.selectedElement = {
							id: null,
							tag: null,
							dragstart: null,
							ondrag: null,
							dragend: null,
							onclick: null
						};
								}
					break;
				}
			}
		}

	}

	makeDraggable(element?: any, params?: any) {
		if(!element) {
			console.log('Hclsvg error: you must give an element to make draggable');
			return;
		}
		element.style.cursor = 'move';
		this.draggables.push({
			id: element.getAttribute('id'),
			tag : element,
			dragstart: params && params.dragstart ? params.dragstart : null,
			ondrag: params && params.ondrag ? params.ondrag : null,
			dragend: params && params.dragend ? params.dragend : null
		})
	}

	disableDraggable(element?: any) {
		if(!element) {
			console.log('Hclsvg error: you must give an element to disable draggable');
			return;
		}
		element.style.cursor = 'default';
	}

	makeClickable(element?: any, params?: any) {
		if(!element) {
			console.log('Hclsvg error: you must give an element to be cliked');
			return;
		}

		element.style.cursor = 'pointer';
		this.clickables.push({
			id: element.getAttribute('id'),
			tag : element,
			onclick: params && params.onclick ? params.onclick : null
		})

	}

	disableClickable(element?: any) {
		if(!element) {
			console.log('Hclsvg error: you must give an element to disable clickable');
			return;
		}
		element.style.cursor = 'default';
	}



	//========================================================================

	setCommon(item: any, params: any) {
		item.setAttributeNS(null,'stroke', params.stroke ? params.stroke.toString() : '#000');
		item.setAttributeNS(null,'stroke-width', params.strokeWidth ? params.strokeWidth.toString() : '1');
		item.setAttributeNS(null,'stroke-opacity', params.strokeOpacity ? params.strokeOpacity.toString() : '1');
		item.setAttributeNS(null,'stroke-linecap', params.strokeLinecap ? params.strokeLinecap.toString() : '');
		item.setAttributeNS(null,'stroke-dasharray', params.strokeDasharray ? params.strokeDasharray.toString() : '');
		item.setAttributeNS(null,'transform', params.transform ? params.transform.toString() : '');
		item.setAttributeNS(null,'fill-opacity', params.fillOpacity ? params.fillOpacity.toString() : params.fill ? 1 : 0);
		return item;
	}

	setCanvasSize(size: any) {
		if(this.proceed) {
			this.tag.setAttribute('width', size.width);
			this.tag.setAttribute('height', size.height);
			this.canvas = {
				width: size.width,
				height: size.height
			}
		}
	}

	rect(params?: any) {
		if(this.proceed) {

			params = params ? params : {
				x: 1,
				y: 1,
				width: 50,
				height: 50,
				stroke: 'rgb(0,0,0)',
				strokeWidth: 1,
				strokeOpacity: 1,
				fill: 'none',
				fillOpacity:0,
				rx: 0,
				ry: 0
			};

			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg','rect');

			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,'x', params.x ? params.x.toString() : '0');
			item.setAttributeNS(null,'y', params.y ? params.y.toString() : '0');
			item.setAttributeNS(null,'width', params.width ? params.width.toString() : '50');
			item.setAttributeNS(null,'height', params.height ? params.height.toString() : '50');
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : 'none');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	circle(params?: any) {
		if(this.proceed) {

			params  = params ? params : {
				cx: 50,
				cy: 50,
				r: 30,
				fill: 'rgb(0,255,0)',
				stroke: 'rgb(255,0,255)',
				strokeWidth: 1
			}

			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg','circle');
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,'cx', params.cx.toString());
			item.setAttributeNS(null,'cy', params.cy.toString());
			item.setAttributeNS(null,'r', params.r.toString());
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : 'none');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	line(params?: any) {
		if(this.proceed) {

			params  = params ? params : {
					x1: 0,
					y1: 0,
					x2: 20,
					y2: 20,
					stroke: 'rgb(255,0,255)',
					strokeWidth: 2
			}

			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg','line');
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,'x1', params.x1 ? params.x1.toString() : '0');
			item.setAttributeNS(null,'y1', params.y1 ? params.y1.toString() : '0');
			item.setAttributeNS(null,'x2', params.x2 ? params.x2.toString() : '10');
			item.setAttributeNS(null,'y2', params.y2 ? params.y2.toString() : '10');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
		const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	arc(params?: any) {
		if(this.proceed) {

			params = params ? params : {
					cx: 60,
					cy: 60,
					r: 50,
					startAngle: 0,
					endAngle: 180,
					stroke: '#000',
					strokeWidth: 1,
					fill: 'none'
			};

			const start = this.polarToCartesian(params.cx, params.cy, params.r, params.endAngle);
			const end = this.polarToCartesian(params.cx, params.cy, params.r, params.startAngle);
			const largeArcFlag = params.endAngle - params.startAngle <= 180 ? '0' : '1';
			const d = [
					"M", start.x, start.y,
					"A", params.r, params.r, 0, largeArcFlag, 0, end.x, end.y
			].join(" ");
			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg','path');
			item.setAttributeNS(null,'d', d);
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : 'none');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	text(params?: any) {
		if(this.proceed) {

			params = params ? params : {
					x: 80,
					y: 80,
					dx: 0,
					dy: 0,
					textAnchor: 'start',
					rotate : 0,
					text: 'Hello World !',
					stroke: 'rgb(255,0,255)',
					strokeWidth: 1,
					strokeOpacity: 1,
					fill: 'rgb(255,200,200)',
					fillOpacity:1,
					fontSize: 32
			}

			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg',"text");
			//item.style.fontFamily='arial, helvetica'
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,"x", params.x ? params.x.toString() : '0');
			item.setAttributeNS(null,"y", params.y ? params.y.toString() : '0');
			item.setAttributeNS(null,"dx", params.dx ? params.dx.toString() : '0');
			item.setAttributeNS(null,"dy", params.dy ? params.dy.toString() : '0');
			item.setAttributeNS(null,"rotate", params.rotate ? params.rotate.toString() : '0');
			item.setAttributeNS(null,"text-anchor", params.textAnchor ? params.textAnchor.toString() : 'start');
			item.setAttributeNS(null,"font-size", params.fontSize ? params.fontSize.toString() : '16');
			item.setAttributeNS(null,"font-family", params.fontFamily ? params.fontFamily.toString() : 'arial,helvetica');
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : '#000');
			item = this.setCommon(item, params);
			var textNode = document.createTextNode(params.text ? params.text : '');
			item.appendChild(textNode);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	polyline(params?: any) {
		if(this.proceed) {

			params = params ? params : {
					points: [[0,0], [100,100], [50,75]],
					stroke: '#000',
					strokeWidth: 1,
					fill: 'none'
			}
			let str = '';
			for(const point of params.points) {
					str += point[0]+','+point[1]+' ';
			}
			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg',"polyline");
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,"points", str);
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : 'none');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	polygon(params?: any) {
		if(this.proceed) {

			params = params ? params : {
					points: [[0,0], [100,100], [50,75]],
					stroke: '#000',
					strokeWidth: 1,
					fill: 'none'
			}
			let str = '';
			for(const point of params.points) {
					str += point[0]+','+point[1]+' ';
			}

			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,"points", str);
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : 'none');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}

	path(params?: any) {
		if(this.proceed) {
			const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
			let item = document.createElementNS('http://www.w3.org/2000/svg',"path");
			item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
			this.lastId++;
			item.setAttributeNS(null,"d", params.path ? params.path : '');
			item.setAttributeNS(null,'fill', params.fill ? params.fill.toString() : 'none');
			item = this.setCommon(item, params);
			group.appendChild(item);
			const bbox = group.getBBox();
			group.setAttributeNS(null,"x", bbox.x.toString());
			group.setAttributeNS(null,"y", bbox.y.toString());
			this.tag.appendChild(group);
			return item;
		}
	}


	image(params?: any) {

		if(this.proceed) {

			this.imgLoading++;

			return new Promise(resolve => {

				const group = document.createElementNS('http://www.w3.org/2000/svg',"svg");
				let item = document.createElementNS('http://www.w3.org/2000/svg',"image");
				item.setAttributeNS(null,'id', '_hclsvg_'+this.lastId.toString());
				this.lastId++;
				item.setAttributeNS("http://www.w3.org/1999/xlink", "href", params.src ? params.src : '');
				item.setAttributeNS(null,'x', params.x ? params.x.toString() : '0');
				item.setAttributeNS(null,'y', params.y ? params.y.toString() : '0');
				item.setAttributeNS(null,'width', params.width ? params.width.toString() : '0');
				item.setAttributeNS(null,'height', params.height ? params.height.toString() : '0');
				//===========================================================================

				const canvas = document.createElement("canvas");

				const ctx = canvas.getContext("2d");
				ctx.canvas.width = parseInt(this.tag.getAttribute('width'));
				ctx.canvas.height = parseInt(this.tag.getAttribute('height'));

				const svgString = new XMLSerializer().serializeToString(item);
				const svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
				const url = self.URL.createObjectURL(svg);

				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.src = item.getAttribute('href');

				img.onload = () => {

					ctx.drawImage(img, 0, 0);
					const png = canvas.toDataURL("image/png");
					item.setAttributeNS("http://www.w3.org/1999/xlink", "href", png);
					group.appendChild(item);
					const bbox = group.getBBox();
					group.setAttributeNS(null,"x", bbox.x.toString());
					group.setAttributeNS(null,"y", bbox.y.toString());
					this.tag.appendChild(group);
					this.imgLoading--;
					resolve(item);
				};
				img.onerror = () => {
					this.imgLoading--;
				}
			});
		}
	}
	//================================================

	remove(element?: any) {
		if(!element) {
			console.log('Hclsvg error: you must give an element to remove');
			return;
		}
		this.tag.removeChild(element.parentNode);
	}

	rotate(element?: any, params?: any) {

		if(!element) {
			console.log('Hclsvg error: you must give an element to rotate');
			return;
		}
		params = params ? params : {
			angle: 0
		}


		const previousTransform = element.getAttribute('transform') ? element.getAttribute('transform') : '';

		let cx = 0;
		let cy = 0;

		if(isNaN(params.cx) || isNaN(params.cy)) {
			const bbox = element.getBBox()
			cx = bbox.x + bbox.width/2;
			cy = bbox.y + bbox.height/2;
		}
		else {
			cx = params.cx;
			cy = params.cy;
		}

		element.setAttributeNS(null,'transform', previousTransform+' rotate('+params.angle+' '+cx+' '+cy+')');
	}

	translate(element?: any, params?: any) {

		params = params ? params : {
			dx: 0,
			dy: 0
		}
		let group = element.parentNode;
		let gx = parseInt(group.getAttribute('x'));
		let gy = parseInt(group.getAttribute('y'));
		group.setAttribute('x', gx+(params.dx ? params.dx : 0));
		group.setAttribute('y', gy+(params.dy ? params.dy : 0))

	}

	scale(element?: any, params?: any) {

		const previousTransform = element.getAttribute('transform') ? element.getAttribute('transform') : '';

		if(!element) {
			console.log('Hclsvg error: you must give an element to scale');
			return;
		}
		params = params ? params : {
			x: 0,
			y: 0
		}

		let x = isNaN(params.x) ? 1 : params.x;
		let y = isNaN(params.y) ? x : params.y;

		const bbox = element.getBBox();
		const dx = bbox.x + bbox.width/2
		const dy = bbox.y + bbox.height/2

		element.setAttributeNS(null,'transform', previousTransform+' scale('+x+','+y+') translate('+dx+','+dy+')');
	}

	exportPng() {
		return new Promise(resolve => {

			if(this.imgLoading) {
				let loading = setInterval(()=> {
					console.log(this.imgLoading)
					if(!this.imgLoading) {
						clearInterval(loading);
						let canvas = document.createElement("canvas");

						const ctx = canvas.getContext("2d");
						ctx.canvas.width = parseInt(this.tag.getAttribute('width'));
						ctx.canvas.height = parseInt(this.tag.getAttribute('height'));

						const svgString = new XMLSerializer().serializeToString(this.tag);

						var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

						var url = self.URL.createObjectURL(svg);
						var img = new Image();
						img.crossOrigin = 'anonymous';
						img.src = url;

						img.onload = () => {
							ctx.drawImage(img, 0, 0);
							var png = canvas.toDataURL("image/png");
							resolve(png);
						};
					}
				}, 200);
			}
		});
	}

	exportSvg() {
		return new XMLSerializer().serializeToString(this.tag).replace(/_ng[^ ]+/, '');
	}

}
