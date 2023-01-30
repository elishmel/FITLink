const DESC = "Desc";
const TITLE = "Title";
const SUB_TITLE = "SubTit";

loadCards();

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

function switchLanguage(lang){
    document.webL10n.setLanguage(lang);
}

function loadCards(){
    var data = loadLinks();
    var list = document.getElementById("linklist");
    data.forEach(element => {
        list.appendChild(buildCard(element[0],element[1][0],element[1][1]));
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

    article.appendChild(header);
    article.appendChild(desc);
    
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