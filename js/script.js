const DESC = "Desc";
const TITLE = "Title";
const SUB_TITLE = "SubTit";
const NO_ICO = "./img/globe.svg";

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
    loadTheme();
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

function themeSwitch(){
    var target = document.getElementById("theme-switch");
    var currentTheme = getTheme();
    if(currentTheme == "dark"){
        applyScheme("light");
    } else {
        applyScheme("dark");
    }
}

function loadTheme(){
    var th = localStorage.getItem("picoPreferedColorScheme");
    if(th != null){
        applyScheme(th);
    }
}

function getTheme(){
    var th = localStorage.getItem("picoPreferedColorScheme");
    if(th != null){
        return th;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyScheme(scheme) {
    document.querySelector("html").setAttribute("data-theme", scheme),
    document.getElementById("theme-switch");
    localStorage.setItem("picoPreferedColorScheme",scheme);
}