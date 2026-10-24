<div align="center">

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/icons/panel.svg" alt="ComfyUI-Majordomo Logo" width="80" height="80">

# ComfyUI-Majordomo

节点对齐面板 · 把零散的节点，整理成清晰的工作流。

</div>

![让工作流一目了然：对齐、排列、配色与分组功能示意，支持 14 种整理工具、14 套调色板和中英双语](https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/readme-cover.svg)

<p align="center">
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/blob/main/README.md"><strong>EN English</strong></a> ·
  <a href="#安装"><strong>安装</strong></a> ·
  <a href="#开始使用">上手</a> ·
  <a href="#功能演示">演示</a> ·
  <a href="#快捷键">快捷键</a> ·
  <a href="#常见问题">问答</a>
</p>

<details>
<summary>查看整理前后对比</summary>

![同一组节点整理前后的布局示意](https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/readme-overview.svg)

功能示意图，实际界面与操作见下方演示。

</details>

<br>

## 安装

在 ComfyUI 的 `custom_nodes` 文件夹中打开终端，执行：

```bash
git clone https://github.com/3ALLBUY14/ComfyUI-Majordomo.git
```

> **重启 ComfyUI，再刷新网页。** 画布右下角出现圆形浮动按钮，即可使用。

<details>
<summary>没有 Git？手动下载安装</summary>

在[仓库页面](https://github.com/3ALLBUY14/ComfyUI-Majordomo)选择 **Code → Download ZIP**，解压后把插件文件夹放进 `ComfyUI/custom_nodes/`。

确认 `__init__.py` 就在插件文件夹里，没有多套一层目录，然后重启 ComfyUI 并刷新网页。

</details>

<br>

## 开始使用

1. **选中节点**：对齐和排列通常需要至少 2 个节点；配色可用于单个节点或分组。
2. **打开面板**：左键点击圆形浮动按钮，或按 **Alt + V**。
3. **预览并应用**：鼠标移到对齐按钮上，查看蓝色虚线预览，点击后应用。

无需往工作流里添加新节点。浮动按钮可拖到顺手的位置。

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/panel-cn.png" alt="浮动按钮入口与快捷颜色弹窗：左键打开面板，右键打开对齐工具" width="460"><br>
  <sub>左键：完整面板　·　右键：对齐工具　·　悬停：快捷配色</sub>
</p>

<br>

## 功能演示

### 对齐与排列

一键对齐节点的边缘或中心；自动排列按节点连接关系横向或纵向整理，间距可调。

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/alignment-cn.gif" alt="节点对齐操作演示" width="840">
</p>

> **拖拽也能自动对齐：** 打开面板标题栏的吸附开关，或按 **Alt + S**。拖动时按住 **Shift**，可临时关闭插件吸附。

### 统一大小

把选中节点调成相同的宽度或高度，也可以用“各自收紧到最小尺寸”去掉多余空白。收紧尺寸也支持单个节点。

<details>
<summary><strong>查看演示</strong> · 尺寸调整</summary>

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/size-alignment-cn.gif" alt="统一节点宽度和高度的操作演示" width="840">
</p>

</details>

### 节点配色

选中节点或分组，再点击色块。可直接使用预设调色板，也能自定义颜色、分别设置标题和正文颜色。

- **先试色**：快捷颜色弹窗中，悬停色块预览，移开还原，点击才应用。
- **复用配色**：右键节点或分组，即可复制、粘贴或重置颜色。
- **保存常用色**：喜欢的颜色可以保存，也能组合成自己的调色板。

<details>
<summary><strong>查看演示</strong> · 节点配色</summary>

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/color-cn.gif" alt="为节点与分组应用配色的操作演示" width="840">
</p>

</details>

### 分组与其他工具

| 工具 | 怎么用 |
| --- | --- |
| **快速分组** | 选中节点后点击“创建分组”，自动包好选区；组标题字号也能调整。 |
| **整组暂停 / 跳过** | 点击组标题选中分组，再点“整组静音”或“整组旁路”；再点恢复，钉住的节点会被跳过。 |
| **顺手小工具** | 标题栏可切换语言、清理显存和内存；面板可拖动、调节透明度，子图内也能继续整理。 |

<br>

## 快捷键

| 快捷键 | 作用 |
| --- | --- |
| <kbd>Alt</kbd> + <kbd>V</kbd> | 打开 / 关闭主面板 |
| <kbd>Alt</kbd> + <kbd>S</kbd> | 开启 / 关闭拖拽吸附 |
| 拖动时按住 <kbd>Shift</kbd> | 临时关闭插件吸附 |
| <kbd>Alt</kbd> + <kbd>U</kbd> | 撤销对齐、尺寸或排列操作 |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> | 重做对齐、尺寸或排列操作 |
| <kbd>Esc</kbd> | 关闭主面板或快捷对齐弹窗 |

对齐撤销 / 重做快捷键需在主面板打开时使用。**颜色请用配色区的撤销 / 重做按钮**；Ctrl / Cmd + Z 仍用于 ComfyUI 自身的撤销。

<br>

## 常见问题

<details>
<summary>安装后找不到入口？</summary>

先重启 ComfyUI，再刷新页面，并尝试 **Alt + V**。若仍未出现，检查插件是否位于 `ComfyUI/custom_nodes/ComfyUI-Majordomo/`，以及启动日志中是否有插件加载错误。

更新后仍显示旧界面，可尝试强制刷新：Windows / Linux 按 **Ctrl + F5**，macOS 按 **Cmd + Shift + R**。

</details>

<details>
<summary>为什么有些按钮点不了？</summary>

大多数对齐、尺寸统一和排列功能需要至少 2 个节点；“各自收紧到最小尺寸”可以用于单个节点。整组静音 / 旁路需要先点击组标题选中分组。

</details>

<details>
<summary>如何恢复颜色？</summary>

想撤回上色，使用配色区的撤销按钮；想恢复主题默认色，右键节点或分组，选择重置颜色。

</details>

<details>
<summary>颜色和设置会保存吗？</summary>

常用颜色、自定义调色板、面板位置和透明度保存在当前浏览器中。更换浏览器或清除站点数据后需要重新设置。

节点和分组的配色会随工作流保存，修改后记得保存工作流。

</details>

---

<p align="center">
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/blob/main/CHANGES_LOG.md">更新记录</a> ·
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/issues">反馈问题</a> ·
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/blob/main/LICENSE">MIT License</a>
</p>
