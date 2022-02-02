/*

    Copyright 2022 Mafee

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

const output = document.querySelector(".output");
const lbl = document.querySelector(".label");
const unitsel = document.querySelector(".unit select");
let unit = "cm";
let mode = 0;
let mouse = {x: 0, y: 0};
let roundoff = 4;
const shapelist = [];
const outpara = output.querySelector("p");
const ui = document.querySelector(".ui");
const app = document.querySelector(".app");
const inputs = Array.from(document.querySelectorAll(".inputs div input"));
const addShape = (id, element, inputs, onperimeter, onarea) => {
    shapelist.push({
        "id": id,
        "element": element,
        "inputs": inputs,
        "onperimeter": onperimeter,
        "onarea": onarea
    });

    console.log(`[!] Loaded Shape: ${id}`);
};
let autocalc = true;

let graddeg = 0;
setInterval(() => {
    if(graddeg < 360){
        document.body.style.backgroundImage = `linear-gradient(${graddeg}deg, red, purple)`;
        graddeg++;
    } else {
        graddeg = 0;
    }
}, 20);

lbl.style.display = "none";
unitsel.value = unit;

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

const showlbl = (elem, text, elembased) => {
    lbl.style.display = "block";
    if(elembased){
        lbl.style.top = `${elem.getBoundingClientRect().bottom + 10}px`;
        lbl.style.left = `${elem.getBoundingClientRect().left}px`;
    } else {
        lbl.style.top = `${mouse.y + 10}px`;
        lbl.style.left = `${mouse.x + 10}px`;
    }

    lbl.textContent = text;
};

const hidelbl = () => {
    lbl.textContent = "";
    lbl.style.display = "none";
};


console.log("%cWelcome to Mafee Console", `font-weight: 600; padding: 2vh; font-size: 1.5em; background-color: lime; color: black;`);

let selectedShape = "square";
const shapes = Array.from(document.querySelectorAll(".shape"));
const initshapes = () => {
selectedShape = "square";
shapes.map(s => {
    s.addEventListener("mouseenter", () => {
        
        if(s.classList.contains("selected")){
            lbl.textContent = `${(s.classList[0].slice(0, 1).toUpperCase() + s.classList[0].slice(1, 99)).replaceAll("-", " ")} - Selected`;
        } else {
            lbl.textContent = `${(s.classList[0].slice(0, 1).toUpperCase() + s.classList[0].slice(1, 99)).replaceAll("-", " ")} - Click to select`;
        }

        lbl.style.display = "block";
        lbl.style.top = `${s.getBoundingClientRect().bottom + 10}px`;
        lbl.style.left = `${s.getBoundingClientRect().left + 20 - s.getBoundingClientRect().width / 2}px`;
    });

    s.addEventListener("mouseleave", (e) => {
        lbl.style.display = "none";
        lbl.textContent = "";
    });

    s.addEventListener("click", (e) => {
        if(!s.classList.contains("selected")){
            selectedShape = s.classList[0];
            shapes.map(r => r.classList.remove("selected"));
            s.classList.add("selected");
            inputs[0].focus();
        } else {
            shapes.map(r => r.classList.remove("selected"));
            s.classList.remove("selected");
            selectedShape = "";
            refreshInputs();
        }
        console.log(`Selected Shape: ${selectedShape}`);
    });

});
};

const refreshInputs = () => {
    shapelist.map((s, ind) => {
        if(selectedShape == s.element.classList[0]){
            inputs.map(e => e.style.display = "none");
            s.inputs.map(i => {
                inputs[i.index].placeholder = i.placeholder;
                inputs[i.index].style.display = "block";
            });
            
            shapes.map(s => s.classList.remove("selected"));
            s.element.classList.add("selected");
        }
    });

    if(!shapelist.map(s => s.element.classList[0]).includes(selectedShape)){
        inputs.map(x => x.style.display = "none");
        inputs[0].style.display = "block";
        inputs[0].placeholder = "[No Shape Selected]";
        selectedShape = "";
    }
};

inputs.map(i => i.value = "");
refreshInputs();
setInterval(refreshInputs, 100);

// Square
addShape("square", shapes[0], [
    {placeholder: "Side", index: 0}
], () => {
    outpara.textContent = (
        parseInt(inputs[0].value) * 4
    )
}, () => {
    outpara.textContent = (
        parseInt(inputs[0].value) * parseInt(inputs[0].value)
    )
});

// Rectangle
addShape("rectangle", shapes[1], [
    {placeholder: "Length", index: 0},
    {placeholder: "Breadth", index: 1}
], () => {
    outpara.textContent = (
        2 * (parseInt(inputs[0].value) + parseInt(inputs[1].value))
    )
}, () => {
    outpara.textContent = (
        parseInt(inputs[0].value) * parseInt(inputs[1].value)
    )
});

// Circle
addShape("circle", shapes[2], [
    {placeholder: "Radius", index: 0}
], () => {
    outpara.textContent = (
        (2 * Math.PI * parseInt(inputs[0].value)).toFixed(roundoff)
    );
}, () => {
    outpara.textContent = (
        (Math.PI * parseInt(inputs[0].value) * parseInt(inputs[0].value)).toFixed(roundoff)
    );
});

// Equilateral Triangle
addShape("equilateral-triangle", shapes[3], [
    {placeholder: "Side", index: 0}
], () => {
    outpara.textContent = (
        parseInt(inputs[0].value) * 3
    )
}, () => {
    outpara.textContent = (
        (Math.sqrt(3)/4) * (parseInt(inputs[0].value) * parseInt(inputs[0].value))
    ).toFixed(4);
});

addShape("hexagon", shapes[4], [
    {placeholder: "Side", index: 0}
], () => {
    outpara.textContent = (
        (parseInt(inputs[0].value) * 8)
    )
}, () => {
    outpara.textContent = (
        (3 * Math.sqrt(3) * (parseInt(inputs[0].value) * parseInt(inputs[0].value))) / 2
    )
});

addShape("parallelogram", shapes[5], [
    {placeholder: "Base", index: 0},
    {placeholder: "Side", index: 1},
    {placeholder: "[Height]", index: 2}
], () => {
    outpara.textContent = (
        2 * (parseInt(inputs[0].value) + parseInt(inputs[1].value))
    )
}, () => {
    outpara.textContent = (
        parseInt(inputs[0].value) * parseInt(inputs[2].value)
    )
});

initshapes();
refreshInputs();

inputs.map(i => {
    i.addEventListener("mouseenter", () => {
        lbl.textContent = i.placeholder;
        lbl.style.display = "block";
        lbl.style.top = `${i.getBoundingClientRect().bottom + 5}px`;
        lbl.style.left = `${i.getBoundingClientRect().left + 5}px`;
    });

    i.addEventListener("mouseleave", () => {
        lbl.textContent = "";
        lbl.style.display = "none";
    });
});

const calcbtn = document.querySelector(".calcbtn");
calcbtn.addEventListener("mouseenter", () => {
   showlbl(calcbtn, "Calculate!"); 
});

calcbtn.addEventListener("mouseleave", () => {
   hidelbl();
});

const modesel = {
    perimeter: document.querySelector(".mode .perimeter"),
    area: document.querySelector(".mode .area")
};

modesel.perimeter.addEventListener("click", () => {
    mode = 0;
    modesel.perimeter.classList.remove("active");
    modesel.area.classList.remove("active");
    modesel.perimeter.classList.add("active");
});

modesel.area.addEventListener("click", () => {
    mode = 1;
    modesel.perimeter.classList.remove("active");
    modesel.area.classList.remove("active");
    modesel.area.classList.add("active");
});

modesel.perimeter.addEventListener("mouseenter", () => showlbl(modesel.perimeter, "Set Mode to Perimeter mode."))
modesel.perimeter.addEventListener("mouseleave", () => hidelbl())
modesel.area.addEventListener("mouseenter", () => showlbl(modesel.perimeter, "Set Mode to Area mode."))
modesel.area.addEventListener("mouseleave", () => hidelbl())
modesel.perimeter.parentElement.querySelector(".modetxt").addEventListener("mouseenter", () => showlbl(unitsel, "Select a Mode!"));
modesel.perimeter.parentElement.querySelector(".modetxt").addEventListener("mouseleave", () => hidelbl())

unitsel.addEventListener("mouseenter", () => showlbl(modesel.perimeter.parentElement.querySelector(".modetxt"), "Select a Unit!"));
unitsel.addEventListener("mouseleave", () => hidelbl())

output.addEventListener("mouseenter", () => showlbl(output, "Calculated Output Here!"))
output.addEventListener("mouseleave", () => hidelbl());

window.addEventListener("click", () => hidelbl())
unitsel.addEventListener("change", () => unit = unitsel.value);

// Calculation Part!

calcbtn.addEventListener("click", () => {
    if(shapes.map(x => x.classList.contains(selectedShape).toString()).includes("true")){
        if(inputs.filter(r => r.style.getPropertyValue("display") == "block").filter(i => i.value !== "").length == inputs.filter(r => r.style.getPropertyValue("display") == "block").length){
            if(mode == 0){
                shapelist.map(s => {
                    if(selectedShape == s.element.classList[0]){
                        s.onperimeter();
                    }
                });
            } else {
                shapelist.map(s => {
                    if(selectedShape == s.element.classList[0]){
                        s.onarea();
                    }
                });
            }

            outpara.textContent = (mode == 0) ? `${outpara.textContent}${unit}` : `${outpara.textContent}${unit}²`;
        } else {
            outpara.textContent = "Please Enter all the measurements!";
        }
    } else {
        outpara.textContent = "You can't Calculate Without a Shape Selected";
    }
});

const shapeprev = document.querySelector(".shapeprev");
shapeprev.parentElement.style.display = "none";
const refreshShapePreview = () => {
    if(selectedShape == "square"){
        shapeprev.style.width = `${inputs[0].value}cm`;
        shapeprev.style.height = `${inputs[0].value}cm`;
        shapeprev.style.borderRadius = "0";
    }

    if(selectedShape == "rectangle"){
        shapeprev.style.width = `${inputs[0].value}cm`;
        shapeprev.style.height = `${inputs[1].value}cm`; 
        shapeprev.style.borderRadius = "0";
    }

    if(selectedShape == "circle"){
        shapeprev.style.width = `${inputs[0].value}cm`;
        shapeprev.style.height = `${inputs[0].value}cm`; 
        shapeprev.style.borderRadius = "50%";
    }
};

shapeprev.addEventListener("click", (e) => {
    if(e.target.className == "refresh"){
        shapeprev.parentElement.style.display = "block";
        refreshShapePreview();
    } else {
        shapeprev.parentElement.requestFullscreen();
    }
});

// [C] Mafee7 UUID.js

const uuid = (length, dashes) => {
    var o = "";
    for(let i = 0; i < length; i++) {
      if(Math.floor(Math.random() * 2) == 0){
        o += Math.floor(Math.random() * 10);
      } else {
        var l = "abcdefghijklmnopqrstuvwxyz".split("")[Math.floor(Math.random() * 25)]
        if(Math.floor(Math.random() * 2) == 0){
          o += l.toLowerCase();
        } else {
          o += l.toUpperCase();
        }
      }
  
      if((i + 1) % 15 === 0 && dashes){
        o += "-";
      }
  
    }
  
    return o;
  };
  
  // For No Dashes: uuid(20);
  // For Dashes uuid(20, true); 

const feedback = document.querySelector(".feedback");
feedback.addEventListener("click", () =>{
    let fdtext = prompt("Enter Your Feedback!");
    if(fdtext){
        let headers = new Headers();
        headers.append("text", fdtext.toString());
        headers.append("auth", uuid(80));
        let req = new Request("https://mafeeperimeterandareacalcibackend.magee6.repl.co/feedback", {
        method: "GET",
            "headers": headers
        });

        fetch(req).then(async (r) => {
            console.log(await r.text());
            alert("Feedback Sent!");
        }).catch(er => {
            console.error(er);
            alert("An error occured while sending your feedback :(");
        })
    } else {
        alert("You didn't enter your feedback! Feedback Cancelled.");
    }
});

feedback.addEventListener("mouseenter", () => showlbl(feedback, "Give your valuable feedback, report bugs!"));
feedback.addEventListener("mouseleave", () => hidelbl());

const shortcutlist = document.querySelector(".shortcut-list");
const shorcutsbtn = document.querySelector(".shortcuts");

shorcutsbtn.addEventListener("mouseenter", () => showlbl(shorcutsbtn, "List all keyboard shortcuts!"));
shorcutsbtn.addEventListener("mouseleave", () => hidelbl());

const githubbtn = document.querySelector(".github");

githubbtn.addEventListener("mouseenter", () => showlbl(githubbtn, "Take a look at our Github!"));
githubbtn.addEventListener("mouseleave", () => hidelbl());

shortcutlist.style.display = "none";
shorcutsbtn.addEventListener("click", () => {
    shortcutlist.style.display = "block";
});

githubbtn.addEventListener("click", () => {
    location.href = "https://github.com/Mafee6/MafeePerimeterAndAreaCalci";
});

window.addEventListener("load", () => shr());

setTimeout(hidelbl, 800);

try {
    eval(atob("Y29uc29sZS5sb2coYXRvYignVkhKNWFXNW5JSFJ2SUhsdmFXNXJJSE52YldVZ1kyOWtaVDhnU1hSeklHVmhjMmxsY2lCb1pYSmxJQzBnYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDAxaFptVmxOaTlOWVdabFpWQmxjbWx0WlhSbGNrRnVaRUZ5WldGRFlXeGphU0VvWTI5d2VYSnBaMmgwWldRcENtbG1JSGx2ZFNCbWFXNWtJR0Z1ZVNCaWRXZHpJSGx2ZFNCallXNGdjbVZ3YjNKMElHbDBJR2hsY21VNklHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOU5ZV1psWlRZdlRXRm1aV1ZRWlhKcGJXVjBaWEpCYm1SQmNtVmhRMkZzWTJrdmFYTnpkV1Z6SVE9PScpKQ=="));
    // yes a secret code..
} catch {console.log("Github: https://github.com/Mafee6/MafeePerimeterAndAreaCalci")}