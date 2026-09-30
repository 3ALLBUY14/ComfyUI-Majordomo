// 流式排列分层自检（node test/flow-layout-check.mjs）
// 从 js/main.js 原样抽出 q2/b0/m0/G2 四个函数（花括号配对切片，不是手抄复制品），
// 断言最长路径分层的正确性。改动 G2/q2 之后跑这个文件，挂了就是改坏了。
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "main.js"), "utf8");

function extractFn(name) {
  const start = src.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `找不到函数 ${name}`);
  const open = src.indexOf("{", start);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) { end = i; break; }
  }
  assert.ok(end > 0, `函数 ${name} 花括号配对失败`);
  return src.slice(start, end + 1);
}

const { q2, G2 } = new Function(
  extractFn("q2") + extractFn("b0") + extractFn("m0") + extractFn("G2") + "; return { q2, b0, m0, G2 };"
)();

// 造 litegraph 风格节点：edges 是 [fromId, toId] 列表，link id 自增
let _link = 0;
function mkNodes(ids, edges) {
  const nodes = ids.map((id) => ({ id, pos: [0, 0], size: [100, 50], inputs: [], outputs: [{ links: [] }] }));
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  for (const [f, t] of edges) {
    const link = ++_link;
    byId[f].outputs[0].links.push(link);
    byId[t].inputs.push({ link });
  }
  return nodes;
}
function levels(nodes) {
  const m = G2(nodes, q2(nodes));
  return Object.fromEntries(nodes.map((n) => [n.id, m[n.id].level]));
}

// 1) 简单链 A→B→C：层级 0,1,2
assert.deepEqual(levels(mkNodes(["A", "B", "C"], [["A", "B"], ["B", "C"]])), { A: 0, B: 1, C: 2 });

// 2) 跨接（L4 原始 bug 场景）：R 直连 C，又经 B 到 C —— C 必须比 B 深一层
assert.deepEqual(levels(mkNodes(["R", "B", "C"], [["R", "C"], ["R", "B"], ["B", "C"]])), { R: 0, B: 1, C: 2 });

// 3) 环 E→A→B→A：必须终止，层级有限
const cyc = levels(mkNodes(["E", "A", "B"], [["E", "A"], ["A", "B"], ["B", "A"]]));
assert.equal(cyc.E, 0);
assert.ok(Number.isFinite(cyc.A) && cyc.A >= 1 && Number.isFinite(cyc.B), `环上层级异常: ${JSON.stringify(cyc)}`);

// 4) 自环 A→A 不炸
const self = levels(mkNodes(["A", "B"], [["A", "A"], ["A", "B"]]));
assert.ok(Number.isFinite(self.A) && Number.isFinite(self.B), `自环层级异常: ${JSON.stringify(self)}`);

// 5) id=0 是合法 id，必须参与分层（A1 回归）
assert.deepEqual(levels(mkNodes([0, 1], [[0, 1]])), { 0: 0, 1: 1 });

// 6) 列内 order 按当前 y 坐标排序（旧实现因字符串键比较从未生效）
const ordNodes = mkNodes(["T1", "T2"], []);
ordNodes.find((n) => n.id === "T1").pos = [0, 300];
ordNodes.find((n) => n.id === "T2").pos = [0, 100];
const om = G2(ordNodes, q2(ordNodes));
assert.equal(om.T2.order, 0, "y=100 的应排在前");
assert.equal(om.T1.order, 1, "y=300 的应排在后");

// 7) 播种随机 fuzz（含环、自环、重复边）：所有节点拿到有限且不越界的层级
let seed = 42;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let g = 0; g < 2000; g++) {
  const n = 1 + Math.floor(rnd() * 12);
  const ids = Array.from({ length: n }, (_, k) => k);
  const edges = [];
  const me = Math.floor(rnd() * n * 1.5);
  for (let e = 0; e < me; e++) edges.push([ids[Math.floor(rnd() * n)], ids[Math.floor(rnd() * n)]]);
  const nodes = mkNodes(ids, edges);
  const lay = G2(nodes, q2(nodes));
  for (const node of nodes) {
    const lv = lay[node.id].level;
    assert.ok(Number.isInteger(lv) && lv >= 0 && lv <= n - 1, `图 ${g} 节点 ${node.id} 层级 ${lv} 越界`);
  }
}

console.log("PASS: 最长路径分层自检（链 / 跨接 / 环 / 自环 / id=0 / 列内排序 / 2000 张随机图）");
