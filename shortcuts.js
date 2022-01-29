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

const shr = (() => {
let shortcuts = [];
const shortcut = (name, key, onpress) => {
    shortcuts.push({
        "name": name,
        "key": key,
        "trigger": onpress,
    })
};

window.addEventListener("keydown", e => {
    if(e.key && !e.shiftKey && !e.ctrlKey && e.target.tagName.toString().toLowerCase() != "input"){
        shortcuts.map(s => {
            if(e.key == s.key){
                s.trigger(e);
                e.preventDefault();
            }
        });
    }
});

shapelist.map((x, i) => {
    shortcut(x.element.classList[0], i + 1, () => {
        selectedShape = x.id,
        refreshInputs();
    });
});

shortcut("Calculate!", "=", () => {
    calcbtn.click();
});

shortcut("Mode: Perimeter", "p",() => {
    modesel.perimeter.click();
});

shortcut("Mode: Area", "a", () => {
    modesel.area.click();
});

shortcut("Focus First Measurement", "b", () => {
    inputs[0].focus();
});

shortcut("Unfocus All Measurements", "n", () => {
    inputs.map(x => x.blur());
});

shortcut("Feedback!", "f", () => {
    feedback.click();
})

shortcut("Shortcuts", "/", () => {
    shortcutlist.style.display = "block";
})

let curunit = unitsel.selectedIndex;
shortcut("Next Unit", "u", () => {
    if(curunit >= unitsel.querySelectorAll("option").length) {
        curunit = 0;
    }  else {
        unitsel.selectedIndex = curunit;
        unit = unitsel.value;
        curunit++;
        inputs.map(x => x.addEventListener("keydown", () => {
            refreshShapePreview();
            if(autocalc){
                calcbtn.click();
            }
        }));
        
        unitsel.focus();
    }
});

shortcut("Toggle Autocalc", "t", () => {
    if(autocalc) {
        autocalc = false;
        alert(`AutoCalc set to ${autocalc}`);
    } else {
        autocalc = true;
        alert(`AutoCalc set to ${autocalc}`);
    }
});

shortcut("Github", "g", () => {
    githubbtn.click();
});

shortcut("Close Shortcut List / ShapePreview", "Escape",  () => {
    shapeprev.style.display = "none";
    shortcutlist.style.display = "none";
})

console.log(`[!] Shortcuts JS loaded.`);

inputs.map(i => {
    i.addEventListener("keyup", (e) => {
        if(e.key.toLowerCase() == "enter"){
            calcbtn.click();
            e.preventDefault();
        }

        if(autocalc) {
            calcbtn.click();
        }
    });
})


shortcuts.map(s => {
    let elem = document.createElement("p");
    elem.innerHTML = `<span class='key'>${s.key}</span> - ${s.name}`
    shortcutlist.appendChild(elem);
});

});