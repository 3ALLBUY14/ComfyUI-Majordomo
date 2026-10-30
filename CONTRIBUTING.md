# 参与开发

## 环境

- ComfyUI（能正常加载自定义节点）
- Python 3.10+
- Node.js（仅布局自检脚本需要）

把本仓库放进 `ComfyUI/custom_nodes/`，重启 ComfyUI 即可加载。

## 开发安装

```bash
pip install -e ".[dev]"
```

## 改动后必须跑的自检

改动了 `js/main.js` 里的布局算法（`q2` / `b0` / `m0` / `G2` / `g0`）后：

```bash
node test/flow-layout-check.mjs
```

提交前：

```bash
pre-commit run --all-files
ruff check .
```

除此之外，请在真实 ComfyUI 里加载一个工作流，手动验证对齐、堆叠、撤销的行为。

## PR 约定

- 一个 PR 只做一件事，修 bug 别顺手重构。
- 说明复现步骤、修复前后行为、验证方式。
- 新增或修改功能时，同步更新 `README.md`、`README_CN.md` 与 `CHANGES_LOG.md`。
- 不提交构建产物、缓存和个人环境配置。
- 贡献默认采用本仓库的 MIT 许可。

## 发布

维护者发布流程见 `RELEASES.md`。
