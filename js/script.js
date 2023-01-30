const DESC = "Desc";
const TITLE = "Title";
const SUB_TITLE = "SubTit";
const NO_ICO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xNS4yNDYgMTdjLS45MjcgMy43MDEtMi41NDcgNi0zLjI0NiA3LS42OTktMS0yLjMyLTMuMjk4LTMuMjQ2LTdoNi40OTJ6bTcuNjY0IDBjLTEuNTU4IDMuMzkxLTQuNjUgNS45MzMtOC4zODYgNi43MzMgMS4zMTUtMi4wNjggMi4yNDItNC4zNjIgMi43NzctNi43MzNoNS42MDl6bS0yMS44MiAwaDUuNjA5Yy41MzkgMi4zODYgMS40NyA0LjY3OCAyLjc3NyA2LjczMy0zLjczNi0uOC02LjgyOC0zLjM0Mi04LjM4Ni02LjczM3ptMTQuNTUtMmgtNy4yOGMtLjI5LTEuOTg1LS4yOS00LjAxNCAwLTZoNy4yODFjLjI4OCAxLjk4Ni4yODggNC4wMTUtLjAwMSA2em0tOS4yOTkgMGgtNS45NjJjLS4yNDgtLjk1OC0uMzc5LTEuOTY0LS4zNzktM3MuMTMxLTIuMDQxLjM3OS0zaDUuOTYyYy0uMjYzIDEuOTg4LS4yNjMgNC4wMTIgMCA2em0xNy4yOCAwaC01Ljk2M2MuMjY1LTEuOTg4LjI2NS00LjAxMi4wMDEtNmg1Ljk2MmMuMjQ3Ljk1OS4zNzkgMS45NjQuMzc5IDNzLS4xMzIgMi4wNDItLjM3OSAzem0tOC4zNzUtOGgtNi40OTJjLjkyNS0zLjcwMiAyLjU0Ni02IDMuMjQ2LTcgMS4xOTQgMS43MDggMi40NDQgMy43OTkgMy4yNDYgN3ptLTguNTQ4LS4wMDFoLTUuNjA5YzEuNTU5LTMuMzkgNC42NTEtNS45MzIgOC4zODctNi43MzMtMS4yMzcgMS45NC0yLjIxNCA0LjIzNy0yLjc3OCA2LjczM3ptMTYuMjEyIDBoLTUuNjA5Yy0uNTU3LTIuNDYyLTEuNTEzLTQuNzUtMi43NzgtNi43MzMgMy43MzYuODAxIDYuODI5IDMuMzQzIDguMzg3IDYuNzMzeiIvPjwvc3ZnPg==";

const DARK_LANG_ICON = "";
const LIGHT_LANG_ICON = "";
const DARK_WEB_ICON = "";
const LIGHT_WEB_ICON = "";

loadCards();

function markLanguage(){
    var lang = document.getElementById("lang-selector");
    var currentLang = getLanguage();
    lang.value = currentLang;
}

function init(){
    markLanguage();
    switchLanguage();
}

function getLanguage(){
    var lang = localStorage.getItem("lang");
    if(lang != null){
        return lang;
    }

    try {
        lang = document.webL10n.getLanguage();
        if(lang != null){
            return lang.substring(0,2);
        }
    } catch (error) {
        
    }


    return "cs";
}

function validateTheme(){
    var html = document.getElementsByTagName("html");
    switch (html.dataset.theme) {
        case "dark":
            
            break;
        case "light":

            break;
        default:

            break;
    }
}

function parseINIString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}

function switchLanguage(){
    var lang = document.getElementById("lang-selector");
    document.webL10n.setLanguage(lang.value);
    localStorage.setItem("lang",lang.value);
}

function loadCards(){
    var data = loadLinks();
    var list = document.getElementById("linklist");
    data.forEach(element => {
        var name = element[0];
        var image = element[1][0] == "null" ? NO_ICO : element[1][0];
        var link = element[1][1];
        list.appendChild(buildCard(name,image,link));
    });
}

function loadLinks(){
    var file = requestData();
    if(file === false){
        renderError();
    }
    var result = parseINIString(file);
    return Object.keys(result.links).map(name => [name,result.links[name].split("|")]);
}

function buildCard(name,imgUrl,targetUrl){
    var article = document.createElement("article");
    var header = document.createElement("header");
    var hgroup = document.createElement("hgroup");
    var title = document.createElement("h2");
    var subtitle = document.createElement("h3");
    var imageSpan = document.createElement("span");
    var image = document.createElement("img");
    var desc = document.createElement("p");
    var button = document.createElement("button");
    var footer = document.createElement("footer");

    imageSpan.innerHTML = name;
    imageSpan.classList.add("title");
    imageSpan.dataset.l10nId = name + TITLE;

    image.setAttribute("width","28px");
    image.setAttribute("src",imgUrl);
    image.classList.add("icon");

    title.appendChild(imageSpan);
    title.appendChild(image);

    subtitle.dataset.l10nId = name + SUB_TITLE;
    subtitle.innerHTML = name;

    hgroup.appendChild(title);
    hgroup.appendChild(subtitle);

    header.appendChild(hgroup);

    desc.dataset.l10nId = name + DESC;
    desc.innerHTML = name;

    button.onclick = function(){window.open(targetUrl,'_blank')};
    button.dataset.l10nId = "button";
    button.classList.add("outline");

    footer.appendChild(button);

    article.appendChild(header);
    article.appendChild(desc);
    article.appendChild(footer);
    
    return article;
}

function requestData(){
    var source = document.querySelector('link[type="application/l10n"]');
    var url = source.href;
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url,false);
    if (xhr.overrideMimeType) {
        xhr.overrideMimeType('text/plain; charset=utf-8');
    }
    xhr.send(null);

    if(xhr.status == 200){
        return xhr.responseText;
    }
    return false;
}

function renderError(){
    var body = document.getElementById("linklist");
    var modal = document.createElement("dialog");
    modal.setAttribute("open",'');
    var modalBody = document.createElement("article");
    var header = document.createElement("header");
    var close = document.createElement("a");
    close.href = "#close";
    close.ariaLabel = "Close";
    close.classList.add("close");
    header.innerHTML = "Error";
    //header.appendChild(close);
    modalBody.appendChild(header);
    var text = document.createElement("p");
    text.innerHTML = "Error obtaining data."
    modalBody.appendChild(text);
    modal.appendChild(modalBody);
    body.appendChild(modal);
}