path = "~"
basePath = "resources"

getPath = () => path.replace("~", "") + "/";

function resplvePath(oldPath, newPath) {
    if (newPath.startsWith("/"))
        return newPath

    if (newPath.startsWith("..")) {
        newPath = newPath.substring(2)
        oldPath = oldPath.split("/")
        oldPath.pop()
        oldPath = oldPath.join("/")
        return resplvePath(oldPath, newPath)
    }

    if (newPath.startsWith(".")) {
        newPath = newPath.substring(1)
        return resplvePath(oldPath, newPath)
    }

    if (oldPath.endsWith("/"))
        return oldPath + newPath
    else
        return oldPath + "/" + newPath
}

function help() {
    return $("#help")[0].innerHTML;
}

async function cd(newPath) {
    toPath = resplvePath(path.replace("~", ""), newPath) + "/";

    const response = await fetch(basePath + toPath);

    if (!response.ok)
        if (response.status == 404)
            throw "cd: " + newPath + ": No such directory"
        else
            throw "cd: " + newPath + ": " + (await response).statusText

 
    path = resplvePath(path, newPath);
    return "";
}

async function ls() {
    const response = await fetch(basePath + getPath());

    if (!response.ok)
        if (response.status == 404)
            throw "ls: cannot access '" + getPath() + "': No such file or directory"
        else
            throw "ls: cannot access '" + getPath() + "': " + response.statusText

    return await response.text();
}

async function cat(file) {
    const response = await fetch(basePath + resplvePath(getPath(), file));

    if (!response.ok)
        if (response.status == 404)
            throw "cat: " + file + ": No such file or directory"
        else
            throw "cat: " + file + ": " + response.statusText

    return response.text();
}

commandHandlers = {
    "help": help,
    "cd": cd,
    "ls": ls,
    "cat": cat
}

$('#terminal').terminal(commandHandlers, {
    greetings: $("#greetings")[0].innerHTML,
    prompt: (setPath) => setPath(path + " $ ")
});