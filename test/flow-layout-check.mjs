// 流式排列/对齐堆叠自检（node test/flow-layout-check.mjs）
// 从 js/main.js 原样抽出 q2/b0/m0/G2/g0/_ns 等函数（花括号配对切片，不是手抄复制品），
// 断言最长路径分层与对齐堆叠间距的正确性。改动 G2/q2/g0 之后跑这个文件，挂了就是改坏了。
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "main.js"), "utf8");

// 切片时跳过字符串/模板串/行注释/块注释，否则函数体内出现的 "{"/"}" 字面量
// 会让花括号配对多切或少切（少切 → new Function 语法错误而响亮误报；多切 → 把
// 后续代码卷进测试体）。ponytail: 正则字面量与嵌套模板串仍不识别——被测函数
// （q2/b0/m0/G2）体内没有这两样；真要用时改 acorn 解析。
function extractFn(name) {
  const start = src.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `找不到函数 ${name}`);
  const open = src.indexOf("{", start);
  let depth = 0, end = -1, inStr = null, esc = false;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (ch === "\\") esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") { inStr = ch; continue; }
    if (ch === "/") {
      if (src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
      if (src[i + 1] === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; continue; }
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) { end = i; break; }
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

// ── 对齐堆叠间距（g0）─────────────────────────────────────────────────────────
// node.pos[1] 是主体顶边、标题条在 pos[1] 上方且不计入 node.size（新前端实测
// boundingRect=[pos.x, pos.y-30, w, size.h+30]）。垂直堆叠步进必须补标题高，
// 否则间距被下一行的标题吃光（默认 30 时视觉间隙恰好归零=节点粘在一起）。
const { g0, _ns } = new Function(
  // Node 下没有 window：给生产表达式原样的 LiteGraph 桩（与浏览器一致取 30）
  "globalThis.window = { LiteGraph: { NODE_TITLE_HEIGHT: 30 } };" +
  "const _arrLike = (v) => !!v && typeof v.length == 'number';" +
  "let _alignGap = 30;" +
  "const _nodeTitleH = () => (window.LiteGraph && window.LiteGraph.NODE_TITLE_HEIGHT) || 30;" +
  "const T2 = new Map();" +
  extractFn("_ns") + extractFn("_mx") + extractFn("_mn") +
  extractFn("q2") + extractFn("b0") + extractFn("m0") + extractFn("G2") +
  extractFn("g0") + "; return { g0, _ns };"
)();
const TITLE_H = 30, GAP = 30;
function mkAlignNodes(defs) {
  // defs: [[id, w, h, x, y], ...]
  return defs.map(([id, w, h, x, y]) => ({ id, pos: [x, y], size: [w, h] }));
}

// 8) 左对齐：垂直堆叠步进 = 主体高 + 标题高 + 间距；视觉间隙（下一节点标题顶 - 上一节点主体底）= 间距
{
  const nodes = mkAlignNodes([[1, 200, 100, 0, 300], [2, 150, 200, 50, 0], [3, 180, 50, 80, 150]]);
  const out = g0("left", nodes);
  const byId = Object.fromEntries(nodes.map((n, i) => [n.id, out[i]]));
  const sorted = [...nodes].sort((a, b) => a.pos[1] - b.pos[1]);
  for (let i = 1; i < sorted.length; i++) {
    const prev = byId[sorted[i - 1].id], cur = byId[sorted[i].id];
    assert.equal(cur.y - (prev.y + byId[sorted[i - 1].id].height), TITLE_H + GAP,
      `左对齐第 ${i} 步主体间距应为 标题${TITLE_H}+间距${GAP}`);
    assert.equal((cur.y - TITLE_H) - (prev.y + prev.height), GAP,
      `左对齐第 ${i} 步视觉间隙应恰为间距 ${GAP}（标题不得吃掉间距）`);
  }
}

// 9) 顶对齐：水平堆叠步进 = 宽 + 间距（无标题介入，不许把标题也加进去）
{
  const nodes = mkAlignNodes([[1, 200, 100, 0, 300], [2, 150, 200, 50, 0], [3, 180, 50, 80, 150]]);
  const out = g0("top", nodes);
  const byId = Object.fromEntries(nodes.map((n, i) => [n.id, out[i]]));
  const sorted = [...nodes].sort((a, b) => a.pos[0] - b.pos[0]);
  for (let i = 1; i < sorted.length; i++) {
    const prev = byId[sorted[i - 1].id];
    assert.equal(byId[sorted[i].id].x - (prev.x + prev.width), GAP, `顶对齐第 ${i} 步水平间距应恰为 ${GAP}`);
  }
}

// 10) 垂直流式（g0 预览用例）：行间步进 = 行最大主体高 + 标题高 + 间距（A→B→C 三层，
//     需真实连线才会分层——孤点全落 level0 被排成一行）
{
  const chain = mkNodes(["A", "B", "C"], [["A", "B"], ["B", "C"]]);
  chain[0].size = [200, 100]; chain[1].size = [200, 150]; chain[2].size = [200, 120];
  const out = g0("vertical-flow", chain);
  const byId = Object.fromEntries(chain.map((n, i) => [n.id, out[i]]));
  assert.equal(byId.B.y - (byId.A.y + 100), TITLE_H + GAP, "垂直流式 A→B 行间步进应含标题高");
  assert.equal(byId.C.y - (byId.B.y + 150), TITLE_H + GAP, "垂直流式 B→C 行间步进应含标题高");
}

console.log("PASS: 最长路径分层自检（链 / 跨接 / 环 / 自环 / id=0 / 列内排序 / 2000 张随机图）");
console.log("PASS: 对齐堆叠间距自检（左对齐含标题步进 / 顶对齐不含标题 / 垂直流式行间含标题）");
