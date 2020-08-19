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
  let incid = null;
  let cameFrom = new Map();
  //cameFrom.set(st, null);
  let queue = new Queue();
  let v = null;
  st.bfs = bfscount;
  console.log(bfscount);
  queue.enqueue(st);
  while (!queue.isEmpty()) {
    v = queue.dequeue();
    if ((checkNode(v) || checkDist(st, v)) && v !== st) {
      console.log("+");
      break;
    }
    for (incid of v.incidence) {
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
  return heuristic(node, mesh[player.XBlock][player.YBlock]) * Math.sqrt(2) + 10 > heuristic(st, mesh[player.XBlock][player.YBlock]);
}

const checkNode = (node) => {
  return (!player.vis(node.x, node.y) && mesh[player.XBlock][player.XBlock].x !== node.x && mesh[player.XBlock][player.XBlock].y !== node.y);
}

const checkDist = (st, node) => {
  return Math.sqrt(Math.pow(st.x - node.x, 2) + Math.pow(st.y - node.y, 2)) > 200;
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
    while (i > 0 && this.heap[(i - 1) / 2].cost > this.heap[i].cost) {
      let tmp = this.heap[(i - 1) / 2];
      this.heap[(i - 1) / 2] = this.heap[i];
      this.heap[i] = tmp;
      i = (i - 1) / 2;
    }
  }

  dequeue() {
    let res = this.heap[0].data;
    this.count -= 1;
    if (this.count > 0) {
      this.heap[0] = this.heap[this.count];
      this.heap.pop();
      this.heapify(0, this.count);
    }
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

const A_Star = (start, goal) => {
  prQueue = new PriorityQueue();
  prQueue.enqueue(start, 0);
  let cameFrom = new Map();
  let costSoFar = new Map();
  costSoFar.set(start, 0);
  while (!prQueue.isEmpty()) {
    let cur = prQueue.dequeue();
    if (cur === goal) {
      break;
    }
    for (incid of cur.incidence) {
      let newCost = costSoFar.get(mesh[incid.i][incid.j]) + findCost(mesh[incid.i][incid.j]);
      if (!costSoFar.has(mesh[incid.i][incid.j]) || newCost < costSoFar.get(mesh[incid.i][incid.j])) {
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
  while (cur !== s) {
    cur = cF.get(cur);
    route.push(cur);
  }
  route.pop();
  return route;
}

const findCost = (elem) => {
  return elem.def; //+ checkVis();
}

const heuristic = (block1, block2) => {
  return Math.sqrt(Math.pow(block1.x - block2.x, 2) +  Math.pow(block1.y - block2.y, 2));
}
