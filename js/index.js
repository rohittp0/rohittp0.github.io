path = "~"
basePath = "resources"

command_cache = {};

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

    if (command_cache.cd && command_cache.cd[toPath]) {
        path = resplvePath(path, newPath);
        return "";
    }

    const response = await fetch(basePath + toPath);
    command_cache.cd = (command_cache.cd || {})

    if (!response.ok)
        if (response.status == 404) {
            command_cache.cd[toPath] = false
            throw "cd: " + newPath + ": No such directory"
        }
        else
            throw "cd: " + newPath + ": " + response.statusText

    command_cache.cd[toPath] = true;
    path = resplvePath(path, newPath);
    return "";
}

async function ls() {
    if (command_cache.ls && command_cache.ls[getPath()])
        return command_cache.ls[getPath()];

    const response = await fetch(basePath + getPath());

    if (!response.ok)
        if (response.status == 404)
            throw "ls: cannot access '" + getPath() + "': No such file or directory"
        else
            throw "ls: cannot access '" + getPath() + "': " + response.statusText

    command_cache.ls = command_cache.ls || {};
    command_cache.ls[getPath()] = await response.text();

    return command_cache.ls[getPath()];
}

async function cat(file) {
    file_path = resplvePath(getPath(), file);
    if (command_cache.cat && command_cache.cat[file_path])
        return command_cache.cat[file_path];

    const response = await fetch(basePath + file_path);

    if (!response.ok)
        if (response.status == 404)
            throw "cat: " + file + ": No such file or directory"
        else
            throw "cat: " + file + ": " + response.statusText

    command_cache.cat = command_cache.cat || {};
    command_cache.cat[file_path] = await response.text();

    return command_cache.cat[file_path]
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