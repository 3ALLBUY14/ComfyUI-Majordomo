from comfy.comfy_types import ComfyNodeABC


class NodeAlignmentPanel(ComfyNodeABC):
    """
    A utility node that provides alignment functionality for selected nodes in the ComfyUI canvas.
    This node creates a panel with alignment buttons that can align multiple selected nodes.
    """

    DESCRIPTION = "Provides a panel with alignment tools for organizing nodes on the canvas"
    CATEGORY = "node_alignment/panel"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            "optional": {},
            "hidden": {
                "extra_pnginfo": "EXTRA_PNGINFO",
                "prompt": "PROMPT"
            }
        }

    RETURN_TYPES = ()
    RETURN_NAMES = ()
    FUNCTION = "process_alignment"
    OUTPUT_NODE = True

    def process_alignment(self, **kwargs):
        """
        This function doesn't need to do much on the backend since the alignment
        logic will be handled by the Vue frontend. This node mainly serves
        as a way to register the Vue extension.
        """
        return ()


NODE_CLASS_MAPPINGS = {
    "node-alignment-panel": NodeAlignmentPanel,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "node-alignment-panel": "Node Alignment Panel",
}
