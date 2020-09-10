'use strict'

class Elem1 {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  enqueue(val) {
    const el = new Elem1(val);
    if (this.length === 0) {
      this.head = el;
      this.tail = el;
      this.length += 1;
    } else {
      this.tail.next = el;
      this.tail = el;
      this.length += 1;
    }
  }

  dequeue() {
    let res = new Elem1(null);
    if (this.length !== 0) {
      res = this.head;
      this.head = this.head.next;
      res.next = null;
      this.length -= 1;
    }
    return res.data;
  }
}

let bfscount = 1;

const BFS = (st) => {
  let cameFrom = new Map();
  let queue = new Queue();
  let v = null;
  st.bfs = bfscount;
  queue.enqueue(st);
  while (!queue.isEmpty()) {
    v = queue.dequeue();
    if ((checkNode(v) || checkDist(st, v)) && v !== st) {
      break;
    }
    for (let incid of v.incidence) {
      if (mesh[incid.i][incid.j].bfs !== bfscount) {
        mesh[incid.i][incid.j].bfs = bfscount;
        if (checkDef(mesh[incid.i][incid.j], st)) {
          cameFrom.set(mesh[incid.i][incid.j], v);
          queue.enqueue(mesh[incid.i][incid.j]);
        }
      }
    }
  }
  return makeRoute(cameFrom, st, v);
}

const checkDef = (node, st) => {
  return heuristic(node, mesh[player.walkXBlock][player.walkYBlock]) * Math.sqrt(2) > heuristic(st, mesh[player.walkXBlock][player.walkYBlock]);
}

const checkNode = (node) => {
  let res = true;
  for (let incid of node.incidence) {
    res = res && !player.vis(mesh[incid.i][incid.j].x, mesh[incid.i][incid.j].y, 1);
  }
  return (!player.vis(node.x, node.y, 1) && res && dist(player.realXCenter, node.x, player.realYCenter, node.y) > 20);
}

const checkDist = (st, node) => {
  return Math.sqrt(Math.pow(st.x - node.x, 2) + Math.pow(st.y - node.y, 2)) > 500;
}

class Elem2 {
  constructor(val, k) {
    this.data = val;
    this.cost = k;
  }
}

class PriorityQueue {
  constructor() {
    this.heap = [];
    this.count = 0;
  }

  isEmpty() {
    return this.count === 0;
  }

  enqueue(val, k) {
    let i = this.count;
    this.count += 1;
    this.heap.push(new Elem2(val, k));
    while (i > 0 && this.heap[Math.floor((i - 1) / 2)].cost > this.heap[i].cost) {
      let tmp = this.heap[Math.floor((i - 1) / 2)];
      this.heap[Math.floor((i - 1) / 2)] = this.heap[i];
      this.heap[i] = tmp;
      i = Math.floor((i - 1) / 2);
    }
  }

  dequeue() {
    let res = this.heap[0].data;
    this.count -= 1;
    if (this.count > 0) {
      this.heap[0] = this.heap[this.count];
      this.heap.pop();
      this.heapify(0, this.count);
    } else {
      this.heap.pop();
    }
    return res;
  }

  heapify(i, n) {
    let l, r, j;
    for(;;) {
      l = 2 * i + 1;
      r = l + 1;
      j = i;
      if (l < n && this.heap[i].cost > this.heap[l].cost) {
        i = l;
      }
      if (r < n && this.heap[i].cost > this.heap[r].cost) {
        i = r;
      }
      if (i === j) {
        break;
      }
      let tmp = this.heap[i];
      this.heap[i] = this.heap[j];
      this.heap[j] = tmp;
    }
  }
}

const A_Star = (start, goal, bot) => {
  let prQueue = new PriorityQueue();
  let cur = null;
  prQueue.enqueue(start, 0);
  let cameFrom = new Map();
  let costSoFar = new Map();
  costSoFar.set(start, 0);
  while (!prQueue.isEmpty()) {
    cur = prQueue.dequeue();
    if (cur === goal) {
      break;
    }
    for (let incid of cur.incidence) {
      let newCost = costSoFar.get(cur) + findCost(mesh[incid.i][incid.j], bot);
      if ((!costSoFar.has(mesh[incid.i][incid.j]) || newCost < costSoFar.get(mesh[incid.i][incid.j]))) {
        costSoFar.set(mesh[incid.i][incid.j], newCost);
        let priority = newCost + heuristic(mesh[incid.i][incid.j], goal);
        prQueue.enqueue(mesh[incid.i][incid.j], priority);
        cameFrom.set(mesh[incid.i][incid.j], cur);
      }
    }
  }
  return makeRoute(cameFrom, start, goal);
}

const makeRoute = (cF, s, g) => {
  let cur = g;
  let route = [];
  route.push(cur);
  cur.used = true;
  while (cur !== s) {
    cur = cF.get(cur);
    route.push(cur);
    cur.used = true;
  }
  return route;
}

const findCost = (elem, bot) => {
  let danger = elem.def;
  if (player.vis(elem.x, elem.y, 0) && bot.seesPlayer) {
    danger += 200;
  }
  if (elem.used) {
    danger += 100;
  }
  return danger;
}

const heuristic = (block1, block2) => {
  return Math.round(Math.sqrt(Math.pow(block1.x - block2.x, 2) +  Math.pow(block1.y - block2.y, 2)));
}

const vision = (sx, sy, tx, ty) => {
  let XBlock = (sx - (sx % worldTileSize)) / worldTileSize;
  let YBlock = (sy - (sy % worldTileSize)) / worldTileSize;
  if (mesh[XBlock][YBlock].color !== 1) {
    let vx = sx - mesh[XBlock][YBlock].x;
    let vy = sy - mesh[XBlock][YBlock].y;
    let blocks = [];
    if (vx > 0) {
      if (vy > 0) {
        blocks.push(mesh[XBlock][YBlock]);
        blocks.push((YBlock + 1 > mesh[0].length - 1 ||
                     mesh[XBlock][YBlock + 1].color === 1) ? {x: mesh[XBlock][YBlock].x,
                                                              y: (YBlock + 1) * blockSize + blockCenter,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock][YBlock + 1]);
        blocks.push((XBlock + 1 > mesh.length - 1 ||
                     mesh[XBlock + 1][YBlock].color === 1) ? {x: (XBlock + 1) * blockSize + blockCenter,
                                                              y: mesh[XBlock][YBlock].y,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock + 1][YBlock]);
        blocks.push((YBlock + 1 > mesh[0].length - 1 ||
                     XBlock + 1 > mesh.length - 1 ||
                     mesh[XBlock + 1][YBlock + 1].color === 1) ? {x: (XBlock + 1) * blockSize + blockCenter,
                                                                  y: (YBlock + 1) * blockSize + blockCenter,
                                                                  vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock + 1][YBlock + 1]);
      } else {
        blocks.push((YBlock - 1 < 0 ||
                     mesh[XBlock][YBlock - 1].color === 1) ? {x: mesh[XBlock][YBlock].x,
                                                              y: (YBlock - 1) * blockSize + blockCenter,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock][YBlock - 1]);
        blocks.push(mesh[XBlock][YBlock]);
        blocks.push((XBlock + 1 > mesh.length - 1 ||
                     YBlock - 1 < 0 ||
                     mesh[XBlock + 1][YBlock - 1].color === 1) ? {x: (XBlock + 1) * blockSize + blockCenter,
                                                                  y: (YBlock - 1) * blockSize + blockCenter,
                                                                  vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock + 1][YBlock - 1]);
        blocks.push((XBlock + 1 > mesh.length - 1 ||
                     mesh[XBlock + 1][YBlock].color === 1) ? {x: (XBlock + 1) * blockSize + blockCenter,
                                                              y: mesh[XBlock][YBlock].y,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock + 1][YBlock]);
      }
    } else {
      if (vy > 0) {
        blocks.push((XBlock - 1 < 0 ||
                     mesh[XBlock - 1][YBlock].color === 1) ? {x: (XBlock - 1) * blockSize + blockCenter,
                                                              y: mesh[XBlock][YBlock].y,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock - 1][YBlock]);
        blocks.push((XBlock - 1 < 0 ||
                     YBlock + 1 > mesh[0].length - 1 ||
                     mesh[XBlock - 1][YBlock + 1].color === 1) ? {x: (XBlock - 1) * blockSize + blockCenter,
                                                                  y: (YBlock + 1) * blockSize + blockCenter,
                                                                  vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock - 1][YBlock + 1]);
        blocks.push(mesh[XBlock][YBlock]);
        blocks.push((YBlock + 1 > mesh[0].length - 1 ||
                     mesh[XBlock][YBlock + 1].color === 1) ? {x: mesh[XBlock][YBlock].x,
                                                              y: (YBlock + 1) * blockSize + blockCenter,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock][YBlock + 1]);
      } else {
        blocks.push((XBlock - 1 < 0 ||
                     YBlock - 1 < 0 ||
                     mesh[XBlock - 1][YBlock - 1].color === 1) ? {x: (XBlock - 1) * blockSize + blockCenter,
                                                                  y: (YBlock - 1) * blockSize + blockCenter,
                                                                  vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock - 1][YBlock - 1]);
        blocks.push((XBlock - 1 < 0 ||
                     mesh[XBlock - 1][YBlock].color === 1) ? {x: (XBlock - 1) * blockSize + blockCenter,
                                                              y: mesh[XBlock][YBlock].y,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock - 1][YBlock]);
        blocks.push((YBlock - 1 < 0 ||
                     mesh[XBlock][YBlock - 1].color === 1) ? {x: mesh[XBlock][YBlock].x,
                                                              y: (YBlock - 1) * blockSize + blockCenter,
                                                              vision: mesh[XBlock][YBlock].vision} :
                                                                          mesh[XBlock][YBlock - 1]);
        blocks.push(mesh[XBlock][YBlock]);
      }
    }

    let visDist = [];
    for (let i = 0; i < 4; i++) {
      let degRad = Math.acos((tx - blocks[i].x) /
                   Math.sqrt(Math.pow((tx - blocks[i].x), 2) +
                             Math.pow((ty - blocks[i].y), 2)));
      if (ty < blocks[i].y) {
        degRad = 2 * Math.PI - degRad;
      }
      let deg = degRad * 180 / Math.PI / 5;
      let deg1 = Math.floor(deg);
      let deg2 = Math.ceil(deg) % 72;
      visDist.push(blocks[i].vision[deg1] + (blocks[i].vision[deg2] - blocks[i].vision[deg1]) * (deg - deg1));
    }
    let tempRes1 = ((blocks[3].x - sx) * visDist[0] + (sx - blocks[0].x) * visDist[2]) / 10;
    let tempRes2 = ((blocks[3].x - sx) * visDist[1] + (sx - blocks[0].x) * visDist[3]) / 10;
    let res = ((blocks[3].y - sy) * tempRes1 + (sy - blocks[0].y) * tempRes2) / 10;
    let dist = Math.sqrt(Math.pow((tx - mesh[XBlock][YBlock].x), 2) +
                         Math.pow((ty - mesh[XBlock][YBlock].y), 2));
    return res > dist;
  } else {
    return false;
  }
}
