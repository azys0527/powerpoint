import { getElem, getElems, createElem } from "./utils";

const addSlideButton = getElem("add-slide");
const main = getElem("main");
const addTextButton = getElem("add-text");
const addRectButton = getElem("add-rect");
let selectedSlide = null;
let selectedSVG = null;
let selectedRect = null;
let selectedRectWidth = null;
let selectedRectHeight = null;
let selectedGroup = null;

function updateSlideCount() {
    const memos = getElems("slide-memo");
    for (let i = 0; i < memos.length; i++) {
        memos[i].textContent = `${i + 1}枚目/${memos.length}枚目`;
    }
}

function setSlideActive(slide) {
    const slides = getElems("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].children[0].classList.remove("active");
    }
    slide.children[0].classList.add("active");
    selectedSlide = slide;
}

function setSVGActive(svg) {
    const svgs = getElems("svg");
    for (let i = 0; i < svgs.length; i++) {
        svgs[i].classList.remove("active-svg");
    }
    svg.classList.add("active-svg");
    selectedSVG = svg;
}

function setRectActive(rect) {
    const mainrects = getElems("mainrect");
    for (let i = 0; i < mainrects.length; i++) {
        mainrects[i].classList.remove("active-rect");
    }
    rect.classList.add("active-rect");
    selectedRect = rect;
}

function setGroupActive(group) {
    const groups = getElems("g");
    for (let i = 0; i < groups.length; i++) {
        groups[i].classList.remove("active-group");
    }
    group.classList.add("active-group");
    selectedGroup = group;
}

function addSlide() {
    const slide = createElem("DIV");
    const workspace = createElem("DIV");
    const deleteSlideButton = createElem("BUTTON");
    const slidememo = createElem("p");
    slide.className = "slide";
    workspace.className = "workspace";
    deleteSlideButton.className = "delete-slide";
    deleteSlideButton.textContent = "✖️";
    slidememo.className = "slide-memo";
    if (selectedSlide == null) {
        main.appendChild(slide);
    } else {
        main.insertBefore(slide, selectedSlide.nextSibling);
    }
    slide.appendChild(workspace);
    workspace.appendChild(deleteSlideButton);
    workspace.appendChild(slidememo);

    deleteSlideButton.onclick = function () {
        slide.remove(workspace);
        updateSlideCount();
    };
    slide.onclick = function () {
        setSlideActive(slide);
    };
    updateSlideCount();
    setSlideActive(slide);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", 1.1);
    svg.setAttribute("baseProfile", "full");
    svg.setAttribute("width", "750px");
    svg.setAttribute("height", "530px");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 750 530");
    selectedSlide.children[0].appendChild(svg);
    setSVGActive(svg);
}

addSlideButton.onclick = addSlide;

function addText() {
    let x = 0;
    let y = 0;
    let sx = 0,
        sy = 0;
    const textarea = createElem("TEXTAREA");
    textarea.className = "textarea";
    selectedSlide.children[0].appendChild(textarea);
    textarea.draggable = true;
    let droppable = true;
    function update() {
        textarea.style.left = `${x}px`;
        textarea.style.top = `${y}px`;
    }

    textarea.ondragstart = (e) => {
        sx = e.x;
        sy = e.y;
        e.dataTransfer.dropEffect = "move";
    };

    textarea.ondragend = (e) => {
        if (!droppable) return;
        x += e.x - sx;
        y += e.y - sy;
        update();
    };

    selectedSlide.ondrop = () => { };
    selectedSlide.ondragleave = () => {
        droppable = false;
    };
    selectedSlide.ondragenter = () => {
        droppable = true;
    };
    selectedSlide.ondragover = (e) => {
        droppable = true;
        e.preventDefault();
    };
}

addTextButton.onclick = addText;

function addRect() {
    // x and y denote the top-left point of a rectangle.
    let x = 0;
    let y = 0;
    let rectangle_startx = 0;
    let rectangle_starty = 0;
    // sx and sy denote the start point of mousemove.
    let sx = 0,
        sy = 0;
    let holding = false;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "300");
    rect.setAttribute("height", "200");
    rect.setAttribute("fill", "blue");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.classList.add("mainrect");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("font-size", "30");
    text.setAttribute("x", "0");
    text.setAttribute("y", "0");
    text.setAttribute("stroke", "blue");
    text.setAttribute("fill", "black");
    selectedSVG.appendChild(group);
    setGroupActive(group);
    selectedGroup.appendChild(rect);
    selectedGroup.appendChild(text);

    rect.onmouseenter = () => { };

    rect.onclick = (e) => {
        setRectActive(rect);
        rectangle_startx = rect.getAttribute("x");
        rectangle_starty = rect.getAttribute("y");
        selectedRectWidth = Number(rect.getAttribute("width"));
        selectedRectHeight = Number(rect.getAttribute("height"));
        const knob1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        knob1.setAttribute("width", "5");
        knob1.setAttribute("height", "5");
        knob1.setAttribute("fill", "red");
        knob1.setAttribute("x", rect.getAttribute("x"));
        knob1.setAttribute("y", rect.getAttribute("y"));
        selectedGroup.appendChild(knob1);

        const knob2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        knob2.setAttribute("width", "5");
        knob2.setAttribute("height", "5");
        knob2.setAttribute("fill", "red");
        knob2.setAttribute(
            "x",
            String(Number(rect.getAttribute("x")) + Number(selectedRectWidth) - 5)
        );
        knob2.setAttribute("y", rect.getAttribute("y"));
        selectedGroup.appendChild(knob2);

        const knob3 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        knob3.setAttribute("width", "5");
        knob3.setAttribute("height", "5");
        knob3.setAttribute("fill", "red");
        knob3.setAttribute("x", rect.getAttribute("x"));
        knob3.setAttribute(
            "y",
            String(Number(rect.getAttribute("y")) + Number(selectedRectHeight) - 5)
        );
        selectedGroup.appendChild(knob3);

        const knob4 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        knob4.setAttribute("width", "5");
        knob4.setAttribute("height", "5");
        knob4.setAttribute("fill", "red");
        knob4.setAttribute(
            "x",
            String(Number(rect.getAttribute("x")) + Number(selectedRectWidth) - 5)
        );
        knob4.setAttribute(
            "y",
            String(Number(rect.getAttribute("y")) + Number(selectedRectHeight) - 5)
        );
        selectedGroup.appendChild(knob4);

        knob4.onmousedown = (e) => {
            sx = e.x;
            sy = e.y;
            knob4_startx = Number(knob4.getAttribute("x"));
            knob4_starty = Number(knob4.getAttribute("y"));
            console.log("knob4の初期位置は", knob4_startx, knob4_starty);
            selectedGroup.onmousemove = (event) => {
                mousex = event.x;
                mousey = event.y;
                knob4.setAttribute(
                    "transform",
                    `translate(${knob4_startx + mousex - sx},${knob4_starty + mousey - sy
                    })`
                );
                // x = rectangle_startx + mousex - sx;
                // y = rectangle_starty + mousey - sy;
                rect.setAttribute("width", String(selectedRectWidth + mousex - sx));
                rect.setAttribute("height", String(selectedRectHeight + mousey - sy));
                //console.log(selectedRectWidth,selectedRectHeight)
                console.log("active");
            };
        };

        knob4.onmouseup = (e) => {
            selectedGroup.onmousemove = null;
            console.log("finish");
        };
    };
    rect.onmousedown = (e) => {
        sx = e.x;
        sy = e.y;
        // rectangle_startx = Number(rect.getAttribute("x")) || 0
        // rectangle_starty = Number(rect.getAttribute("y")) || 0
        rectangle_startx = x;
        rectangle_starty = y;
        selectedGroup.onmousemove = (event) => {
            mousex = event.x;
            mousey = event.y;
            selectedGroup.setAttribute(
                "transform",
                `translate(${rectangle_startx + mousex - sx},${rectangle_starty + mousey - sy
                })`
            );
            x = rectangle_startx + mousex - sx;
            y = rectangle_starty + mousey - sy;
            // rect.setAttribute("x",`${rectangle_startx + mousex -sx}`)
            // rect.setAttribute("y",`${rectangle_starty + mousey -sy}`)
        };
    };

    rect.onmouseup = (e) => {
        selectedGroup.onmousemove = null;
    };

    // rect.onmousedown = (e) =>{
    //     sx = e.x;
    //     sy = e.y;
    //     rectangle_startx = rect.getAttribute("x")
    //     rectangle_starty = rect.getAttribute("y")
    //     selectedSVG.onmousemove = (event) =>{
    //         mousex = event.x;
    //         mousey = event.y;
    //         rect.setAttribute("x",String(Number(rectangle_startx) + mousex - sx))
    //         rect.setAttribute("y",String(Number(rectangle_starty) + mousey - sy))
    //     }
    //     }

    // rect.onmouseup = (e) =>{
    //     selectedSVG.onmousemove = null;
    // }
}

addRectButton.onclick = addRect;
