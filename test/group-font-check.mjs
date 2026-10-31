// node test/group-font-check.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

class Group {
  constructor(fontSize = 20) {
    this.font_size = fontSize;
    this._bounding = new Float32Array([100, 400, 600, 500]);
    this._pos = this._bounding.subarray(0, 2);
    this._size = this._bounding.subarray(2);
    this.selected = true;
  }
  configure(data) { this._bounding.set(data.bounding); }
  serialize() { return { bounding: [...this._bounding] }; }
}
const graph = { _groups: [], _nodes: [] };
let redraws = 0;
const window = {
  LiteGraph: { LGraphGroup: Group, GROUP_TEXT_SIZE: 20 },
  app: { graph, canvas: { graph, setDirty() { redraws++; } } },
};
const source = readFileSync(new URL('../js/group.js', import.meta.url), 'utf8');
vm.runInNewContext(source.replace(/^export .*;$/m, ''), { window, console });
const { setGroupFontSize } = window.HkGroups;
const group = new Group();
const other = new Group(30);
other.selected = false;
const node = { pos: [120, 470], size: [200, 100], is_selected: true, group };
group.id = 1;
other.id = 2;
graph._groups = [group, other];
graph._nodes = [node];
const initial = [...group._bounding];
const headerBottom = group._pos[1] + group.titleHeight;
const bottom = group._pos[1] + group._size[1];
function checkAnchors(g, header, lower) {
  assert.ok(Math.abs(g._pos[1] + g.titleHeight - header) < 0.001);
  assert.ok(Math.abs(g._pos[1] + g._size[1] - lower) < 0.001);
  assert.equal(g._pos[0], 100);
  assert.equal(g._size[0], 600);
  assert.deepEqual(node.pos, [120, 470]);
}

// 连续放大/缩小（含极值）不侵入内容、不移动节点，也不累积布局漂移。
for (const size of [94, 300, 8, 20, 94, 20]) {
  setGroupFontSize(size);
  checkAnchors(group, headerBottom, bottom);
}
group._bounding.forEach((value, i) => assert.ok(Math.abs(value - initial[i]) < 0.001));
assert.equal(other.font_size, 30, '未选中组不受影响');
assert.equal(redraws, 6);

// 无组选中时按所选节点定位；无节点选中时，分别保留每个组自己的锚点。
group.selected = false;
setGroupFontSize(40);
checkAnchors(group, headerBottom, bottom);
assert.equal(other.font_size, 30);
node.is_selected = false;
const otherHeader = other._pos[1] + other.titleHeight;
setGroupFontSize(94);
checkAnchors(group, headerBottom, bottom);
checkAnchors(other, otherHeader, 900);

// 保存/加载保留补偿后的边界和字号；加载本身不再位移。
const saved = group.serialize();
const restored = new Group();
restored.configure(saved);
assert.equal(restored.font_size, 94);
assert.deepEqual([...restored._bounding], saved.bounding);
checkAnchors(restored, headerBottom, bottom);

// 非法输入不改变几何；子图优先于根图。
const before = [...group._bounding];
setGroupFontSize(NaN);
assert.deepEqual([...group._bounding], before);
window.app.canvas.graph = { _groups: [restored], _nodes: [] };
setGroupFontSize(20);
checkAnchors(restored, headerBottom, bottom);
assert.equal(group.font_size, 94);
console.log('Group font anchor checks passed');
