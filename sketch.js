const h = 4;
const w = 4;
const screen_w = 400;
const screen_h = 400;
const radius = 0.5;

let start;
let head;
let frontier;
// list of coordinates in the order they were visited
let snailTrail;
// grid of true and false values (whether a specific cell is visited)
let visited;
let filledCounter = 0;

function inBounds(pos) {
    return (pos.x < w) && (pos.y < h) && (pos.x >= 0) && (pos.y >= 0);
}

function hasNotBeenVisited(pos) {
    return !visited[pos.x][pos.y];
}

function flood(reachable, pos) {
    if (reachable.find(e => e.x === pos.x && e.y === pos.y)) {
        return;
    }
    reachable.unshift(pos);
    validAdjacents(pos).forEach((adjacent) => flood(reachable, adjacent))
}

function noIsolatedNodes(new_head) {
    const reachable = [];
    flood(reachable, new_head);
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (!visited[i][j] && !reachable.find(e => e.x === i && e.y === j)) {
                return false;
            }
        }
    }
    return true;
}

function allAdjacents(pos) {
    return [{ x: pos.x, y: pos.y - 1 }, { x: pos.x, y: pos.y + 1 }, { x: pos.x - 1, y: pos.y }, { x: pos.x + 1, y: pos.y }];
}

function validAdjacents(pos) {
    return shuffle(allAdjacents(pos).filter(inBounds).filter(hasNotBeenVisited));
}

function backtrack() {
    unvisit();
    while (frontier.length !== 0) {
        let adjacents = frontier.pop();
        if (adjacents.length !== 0) {
            return adjacents;
        } else {
            unvisit()
        }
    }
    return undefined;
}

function visit(pos) {
    snailTrail.push(pos);
    visited[pos.x][pos.y] = true;
    filledCounter++;
    if (filledCounter === w * h) {
        noLoop();
        console.log("Spent ", (new Date()).getTime() / 1000 - start);
        console.log("FINISHED :)")
    }
}

function unvisit() {
    const pos = snailTrail.pop();
    visited[pos.x][pos.y] = false;
    filledCounter--;
    head = snailTrail[snailTrail.length - 1];
}

function update() {
    let adjacents = validAdjacents(head);
    adjacents = adjacents.filter(noIsolatedNodes)
    if (adjacents.length === 0) {
        adjacents = backtrack();
        if (adjacents === undefined) {
            console.log("Spent ", (new Date()).getTime() / 1000 - start);
            console.log("Could not find complete path. RESTARTING !");
            restart();
            return;
        }
    }
    head = adjacents.pop();
    frontier.push(adjacents);
    visit(head);
}

function restart() {
    start = (new Date()).getTime() / 1000;
    head = {x: int(random(0, w)), y: int(random(0, h))}
    frontier = [];
    snailTrail = [];
    visited = [];
    filledCounter = 0;

    for (let i = 0; i < w; i++) {
        col = [];
        for (let j = 0; j < h; j++) {
            col.push(false);
        }
        visited.push(col);
    }
    visit(head);
}

function setup() {
    restart();
    createCanvas(screen_w, screen_h);
}

function draw() {
    update();
    background("rgb(62,18,95)");
    fill("rgb(255,141,190)");
    stroke("rgb(255,141,190)");
    strokeWeight(0);
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (visited[i][j]) {
                circle((i + 0.5) * screen_w / w, (j + 0.5) * screen_h / h, screen_w / w * radius);
            }
        }
    }
    strokeWeight(10);
    let prev_pos = snailTrail[0];
    for (let i = 0; i < snailTrail.length; i++) {
        const cur_pos = snailTrail[i];
        line((prev_pos.x + 0.5) * screen_w / w, (prev_pos.y + 0.5) * screen_h / h, (cur_pos.x + 0.5) * screen_w / w, (cur_pos.y + 0.5) * screen_h / h);
        prev_pos = cur_pos;
    }
}