// Node Alignment CSS Styles
// Auto-extracted from main.js for maintainability

export const panelCSS = `

:root {
    --hk-accent: #8BC3F3;
    --hk-accent-light: #B8D8F5;
    --hk-accent-dark: #5A9FD4;
    --hk-accent-glow: rgba(139, 195, 243, 0.4);
    --hk-panel-border: rgba(139, 195, 243, 0.25);
    --hk-panel-border-light: rgba(139, 195, 243, 0.4);
    --hk-handle-bg: rgba(26, 29, 36, 0.88);
    --hk-text-strong: #F0F7FF;
    --hk-text-muted: rgba(240, 247, 255, 0.65);
    --hk-text-dim: rgba(240, 247, 255, 0.4);
    --hk-top-offset: 48px;
    --hk-panel-max-height: calc(100vh - 96px);
    --hk-panel-width: clamp(260px, 17vw, min(288px, calc(100vw - 24px)));
    --hk-button-size: clamp(28px, 6vw, 34px);
    --hk-icon-size: clamp(14px, 3.5vw, 17px);
    --hk-button-gap: clamp(3px, 0.8vw, 6px);
    --hk-header-font-size: clamp(14px, 1.6vw, 16px);
    --hk-body-font-size: clamp(11px, 1.2vw, 12px);
    --hk-subtitle-font-size: clamp(9px, 1vw, 11px);
    --hk-radius-sm: 5px;
    --hk-radius-md: 8px;
    --hk-radius-lg: 12px;
    --hk-radius-xl: 14px;
}


.hk-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 99999;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.9);
    transform-origin: center center;
    transition: opacity 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
                visibility 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
                transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.hk-wrapper.visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: scale(1);
}

.hk-floating-btn {
    position: fixed;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(30, 33, 42, 0.95) 0%, rgba(20, 22, 28, 0.98) 100%);
    border: 1px solid var(--hk-panel-border);
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.4),
        0 0 20px var(--hk-accent-glow),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99998;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
    overflow: hidden;
    user-select: none;
    animation: hk-float-breath 4s ease-in-out infinite;
}

@keyframes hk-float-breath {
    0%, 100% {
        box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.4),
            0 0 16px var(--hk-accent-glow),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    50% {
        box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.4),
            0 0 28px rgba(139, 195, 243, 0.65),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
}

.hk-floating-btn img {
    width: 36px;
    height: 36px;
    filter: drop-shadow(0 0 6px var(--hk-accent-glow));
    transition: all 0.3s ease;
    z-index: 1;
    pointer-events: none;
}

.hk-floating-btn:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 
        0 12px 32px rgba(0, 0, 0, 0.5),
        0 0 30px var(--hk-accent-glow),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: var(--hk-panel-border-light);
}

.hk-floating-btn:hover img {
    filter: drop-shadow(0 0 10px var(--hk-accent-glow));
}

.hk-floating-btn:hover,
.hk-floating-btn:active {
    animation: none;
}

.hk-floating-btn:active {
    transform: scale(0.95);
}

.hk-floating-btn.hidden {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.8);
    animation: none;
}

/* Quick color popup on floating button hover */
.hk-quick-color-popup {
    position: fixed;
    z-index: 99998;
    width: fit-content;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.95) 0%, rgba(20, 22, 28, 0.98) 100%);
    border: 1px solid var(--hk-panel-border);
    border-radius: var(--hk-radius-md);
    padding: 8px;
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.5),
        0 0 16px rgba(139, 195, 243, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px) saturate(1.2);
    -webkit-backdrop-filter: blur(16px) saturate(1.2);
    display: flex;
    flex-direction: column;
    gap: 5px;
    opacity: 0;
    transform: translateX(-8px) scale(0.96);
    transform-origin: left center;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0.2s ease;
}

.hk-quick-color-popup.visible {
    opacity: 1;
    transform: translateX(0) scale(1);
    visibility: visible;
    pointer-events: auto;
}

.hk-quick-color-popup.right-side {
    transform-origin: left center;
}

.hk-quick-color-popup.left-side {
    transform-origin: right center;
    transform: translateX(8px) scale(0.96);
}

.hk-quick-color-popup.left-side.visible {
    transform: translateX(0) scale(1);
}

.hk-quick-grid {
    display: grid;
    grid-template-columns: repeat(3, 28px);
    gap: 5px;
    justify-content: center;
}

.hk-quick-actionbar {
    display: flex;
    justify-content: center;
    gap: 5px;
    padding-top: 3px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    width: 94px;
    margin: 0 auto;
}

.hk-quick-pick {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    cursor: pointer;
    padding: 0;
    font-size: 15px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.9) 0%, rgba(20, 22, 28, 0.95) 100%);
    color: rgba(255, 255, 255, 0.8);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    flex-shrink: 0;
}

.hk-quick-pick:hover {
    transform: scale(1.03);
    border-color: var(--hk-accent);
    color: #fff;
    box-shadow:
        0 0 0 2px rgba(139, 195, 243, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.4);
}

.hk-quick-pick:active {
    transform: scale(0.97);
    transition: transform 0.08s ease;
}

.hk-quick-chip {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    padding: 0;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hk-quick-chip:hover {
    transform: scale(1.18);
    border-color: var(--hk-accent);
    box-shadow:
        0 0 0 2px rgba(139, 195, 243, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.4),
        0 0 10px var(--hk-accent-glow);
    z-index: 1;
}

.hk-quick-chip:active {
    transform: scale(0.92);
    transition: transform 0.08s ease;
}

.hk-quick-random {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid rgba(139, 195, 243, 0.3);
    cursor: pointer;
    padding: 0;
    font-size: 15px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.9) 0%, rgba(20, 22, 28, 0.95) 100%);
    color: var(--hk-accent);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.hk-quick-random:hover {
    transform: scale(1.18) rotate(20deg);
    border-color: var(--hk-accent);
    box-shadow:
        0 0 0 2px rgba(139, 195, 243, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.4),
        0 0 10px var(--hk-accent-glow);
    z-index: 1;
}

.hk-quick-random:active {
    transform: scale(0.92) rotate(0deg);
    transition: transform 0.08s ease;
}

/* Right-click alignment tools popup */
.hk-align-popup {
    position: fixed;
    z-index: 99999;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.95) 0%, rgba(20, 22, 28, 0.98) 100%);
    border: 1px solid var(--hk-panel-border);
    border-radius: var(--hk-radius-md);
    padding: 7px;
    box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(139, 195, 243, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(18px) saturate(1.2);
    -webkit-backdrop-filter: blur(18px) saturate(1.2);
    display: flex;
    flex-direction: column;
    gap: 5px;
    opacity: 0;
    transform: translateX(-10px) scale(0.95);
    transform-origin: left center;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0s linear 0.2s;
}

.hk-align-popup.visible {
    opacity: 1;
    transform: translateX(0) scale(1);
    visibility: visible;
    pointer-events: auto;
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0s;
}

.hk-align-popup.left-side {
    transform-origin: right center;
    transform: translateX(10px) scale(0.95);
}

.hk-align-popup.left-side.visible {
    transform: translateX(0) scale(1);
}

.hk-align-popup-title {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--hk-text-muted);
    padding: 0 2px 1px;
    border-bottom: 1px solid rgba(139, 195, 243, 0.1);
}

/* Hover tooltip for alignment buttons */
.hk-align-btn-hint {
    position: fixed;
    z-index: 100000;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.96) 0%, rgba(20, 22, 28, 0.98) 100%);
    border: 1px solid var(--hk-panel-border);
    border-radius: 4px;
    padding: 4px 8px;
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.4),
        0 0 8px rgba(139, 195, 243, 0.1);
    backdrop-filter: blur(10px) saturate(1.2);
    -webkit-backdrop-filter: blur(10px) saturate(1.2);
    font-size: 10px;
    line-height: 1.3;
    color: var(--hk-text-strong);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateY(3px);
    visibility: hidden;
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.15s;
}

.hk-align-btn-hint.visible {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s;
}

/* Double-click to close hint */
.hk-dblclose-hint {
    position: fixed;
    z-index: 100002;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.96) 0%, rgba(20, 22, 28, 0.98) 100%);
    border: 1px solid rgba(139, 195, 243, 0.2);
    border-radius: 4px;
    padding: 4px 10px;
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.35),
        0 0 8px rgba(139, 195, 243, 0.08);
    backdrop-filter: blur(10px) saturate(1.2);
    -webkit-backdrop-filter: blur(10px) saturate(1.2);
    font-size: 10px;
    line-height: 1.3;
    color: var(--hk-text-muted);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateY(4px) scale(0.92);
    visibility: hidden;
    transition: opacity 0.18s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.18s cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0s linear 0.18s;
}

.hk-dblclose-hint.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    visibility: visible;
    transition: opacity 0.18s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.18s cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0s;
}

.hk-align-popup .hk-button-grid {
    --hk-button-unit: calc(100% / 6);
    width: 198px;
    padding: 3px;
}

.hk-align-popup .hk-button-grid-flow {
    --hk-button-unit: calc(100% / 6);
    width: 198px;
    padding: 3px;
}

.hk-align-popup .hk-button-grid-flow .hk-button {
    flex: 0 0 var(--hk-button-unit);
    max-width: var(--hk-button-unit);
}

/* Divider in align popup */
.hk-align-popup-divider {
    height: 1px;
    background: rgba(139, 195, 243, 0.12);
    margin: 4px 2px 2px;
}

/* Create Group button in align popup */
.hk-create-group-btn {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid rgba(139, 195, 243, 0.2);
    border-radius: var(--hk-radius-sm);
    background: rgba(139, 195, 243, 0.06);
    color: var(--hk-text-strong);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    letter-spacing: 0.02em;
}

.hk-create-group-btn:hover:not(:disabled) {
    background: rgba(139, 195, 243, 0.16);
    border-color: var(--hk-accent);
    box-shadow: 0 0 10px var(--hk-accent-glow);
    color: #fff;
}

.hk-create-group-btn:active:not(:disabled) {
    transform: scale(0.97);
}

.hk-create-group-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.hk-create-group-btn svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* Group font-size slider in align popup */
.hk-grp-font-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px 2px;
    margin-top: 2px;
}

.hk-grp-font-label {
    font-size: 10px;
    color: var(--hk-text-muted, #8899aa);
    white-space: nowrap;
    flex-shrink: 0;
    min-width: fit-content;
}

.hk-grp-font-slider {
    flex: 0 1 auto;
    width: 80px;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    background: rgba(139, 195, 243, 0.2);
    outline: none;
    cursor: pointer;
    min-width: 40px;
}

.hk-grp-font-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--hk-accent, #4a9eff);
    border: 2px solid rgba(255, 255, 255, 0.8);
    cursor: grab;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.hk-grp-font-slider::-webkit-slider-thumb:hover {
    transform: scale(1.25);
    box-shadow: 0 0 8px var(--hk-accent-glow, rgba(74, 158, 255, 0.5));
}

.hk-grp-font-slider::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.1);
}

.hk-grp-font-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--hk-accent, #4a9eff);
    border: 2px solid rgba(255, 255, 255, 0.8);
    cursor: grab;
    transition: transform 0.15s ease;
}

.hk-grp-font-slider::-moz-range-thumb:hover {
    transform: scale(1.25);
}

.hk-grp-font-val {
    font-size: 11px;
    font-weight: 700;
    color: var(--hk-text-strong, #dfe7f0);
    width: 42px;
    text-align: center;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    padding: 2px 2px;
    border: 1px solid rgba(139, 195, 243, 0.2);
    border-radius: var(--hk-radius-sm, 4px);
    background: rgba(139, 195, 243, 0.06);
    outline: none;
    transition: border-color 0.15s ease;
}

.hk-grp-font-val:focus {
    border-color: var(--hk-accent, #4a9eff);
    background: rgba(139, 195, 243, 0.12);
}

/* Floating button hover hint */
.hk-float-hint {
    position: fixed;
    z-index: 99998;
    background: linear-gradient(145deg, rgba(30, 33, 42, 0.96) 0%, rgba(20, 22, 28, 0.98) 100%);
    border: 1px solid var(--hk-panel-border);
    border-radius: var(--hk-radius-sm);
    padding: 7px 10px;
    box-shadow:
        0 6px 16px rgba(0, 0, 0, 0.4),
        0 0 12px rgba(139, 195, 243, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 10px;
    line-height: 1.4;
    color: var(--hk-text-strong);
    white-space: nowrap;
    opacity: 0;
    transform: translateY(4px);
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}

.hk-float-hint.visible {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
}

.hk-float-hint-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.hk-float-hint-key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 16px;
    padding: 0 5px;
    border-radius: 3px;
    background: linear-gradient(180deg, rgba(139, 195, 243, 0.22) 0%, rgba(139, 195, 243, 0.12) 100%);
    border: 1px solid rgba(139, 195, 243, 0.35);
    color: var(--hk-accent);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.02em;
    flex-shrink: 0;
}

.hk-float-hint-desc {
    color: var(--hk-text-muted);
    font-size: 10px;
}

.hk-handle {
    border: 1px solid var(--hk-panel-border);
    background: var(--hk-handle-bg);
    color: var(--hk-accent);
    border-radius: clamp(10px, 1.5vw, 14px) 0 0 clamp(10px, 1.5vw, 14px);
    padding: clamp(8px, 1.2vh, 12px) clamp(3px, 0.5vw, 5px) clamp(6px, 0.8vh, 8px) clamp(7px, 1.2vw, 10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.2vh, 10px);
    cursor: pointer;
    width: clamp(34px, 4vw, 50px);
    max-width: 46px;
    min-height: clamp(110px, 19vh, 150px);
    max-height: 150px;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: clamp(9px, 1.2vw, 11px);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background-image: 
        linear-gradient(180deg, rgba(139, 195, 243, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, rgba(139, 195, 243, 0.04), rgba(139, 195, 243, 0.01));
    margin-right: -4px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
}

.hk-handle::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--hk-accent), transparent);
    opacity: 0.5;
}

.hk-handle::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, var(--hk-accent), transparent 30%, transparent 70%, var(--hk-accent));
    opacity: 0.3;
}

.hk-handle img {
    width: clamp(20px, 2.8vw, 26px);
    height: clamp(20px, 2.8vw, 26px);
    max-width: 26px;
    max-height: 26px;
    filter: drop-shadow(0 0 6px var(--hk-accent-glow));
    transition: filter 0.3s ease, transform 0.3s ease;
}

.hk-handle:hover img {
    filter: drop-shadow(0 0 10px var(--hk-accent-glow));
    transform: scale(1.05);
}

.hk-handle span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(180deg, var(--hk-accent-light), var(--hk-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hk-wrapper.collapsed .hk-handle span {
    transform: rotate(0deg);
}

.hk-handle:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 3px;
    box-shadow: 0 0 20px var(--hk-accent-glow);
}

.hk-wrapper.hk-has-selection .hk-handle {
    box-shadow: 
        0 0 20px rgba(139, 195, 243, 0.3),
        inset 0 0 20px rgba(139, 195, 243, 0.05);
    border-color: var(--hk-panel-border-light);
}

.hk-wrapper.hk-has-selection .hk-handle::before {
    opacity: 0.8;
}

.hk-panel {
    --hk-panel-opacity: 0.85;
    --hk-panel-bg-rgb: 20, 22, 28;
    --hk-panel-bg: rgba(var(--hk-panel-bg-rgb), var(--hk-panel-opacity));
    --hk-panel-bg-2: rgba(30, 33, 42, calc(var(--hk-panel-opacity) + 0.05));
    width: var(--hk-panel-width);
    background: var(--hk-panel-bg);
    border: 1px solid var(--hk-panel-border);
    border-radius: var(--hk-radius-xl);
    padding: clamp(8px, 1vw, 11px) clamp(10px, 1.2vw, 13px);
    box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.03) inset,
        0 1px 0 rgba(255, 255, 255, 0.06) inset;
    color: var(--hk-text-strong);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    max-height: var(--hk-panel-max-height);
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
    transition: box-shadow 0.3s ease, background 0.2s ease;
    backdrop-filter: blur(20px) saturate(1.2);
    -webkit-backdrop-filter: blur(20px) saturate(1.2);
    position: relative;
    pointer-events: auto;
    outline: none;
    transform-origin: center center;
    user-select: none;
    -webkit-user-select: none;
}

.hk-panel .hk-custom-hex,
.hk-panel input[type="text"],
.hk-panel input[type="number"] {
    user-select: text;
    -webkit-user-select: text;
}

.hk-wrapper.visible .hk-panel {
    animation: hk-panel-enter 0.42s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

@keyframes hk-panel-enter {
    0% { opacity: 0; transform: scale(0.96) translateY(6px); }
    60% { opacity: 1; }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}

.hk-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(139, 195, 243, 0.3) 20%, 
        rgba(139, 195, 243, 0.6) 50%, 
        rgba(139, 195, 243, 0.3) 80%, 
        transparent 100%);
    pointer-events: none;
    z-index: 1;
}

.hk-panel::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--hk-radius-xl);
    padding: 1px;
    background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        transparent 30%,
        transparent 70%,
        rgba(139, 195, 243, 0.1) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

.hk-content {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 2px 0 6px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 195, 243, 0.3) transparent;
}

.hk-content::-webkit-scrollbar {
    width: 4px;
}

.hk-content::-webkit-scrollbar-track {
    background: transparent;
}

.hk-content::-webkit-scrollbar-thumb {
    background: rgba(139, 195, 243, 0.25);
    border-radius: 2px;
}

.hk-content::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 195, 243, 0.4);
}

.hk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--hk-accent);
    padding-bottom: 2px;
    position: relative;
    z-index: 2;
}

.hk-header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--hk-header-font-size);
    font-weight: 600;
    margin: 0;
    letter-spacing: 0.02em;
    background: linear-gradient(135deg, var(--hk-text-strong) 0%, var(--hk-accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hk-header-title img {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 4px var(--hk-accent-glow));
    -webkit-text-fill-color: initial;
}

.hk-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-right: 3px;
}

.hk-lang-toggle {
    background: rgba(139, 195, 243, 0.1);
    border: 1px solid rgba(139, 195, 243, 0.25);
    color: var(--hk-accent);
    cursor: pointer;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 0.2s ease;
    font-size: 10px;
    font-weight: 600;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.hk-lang-toggle:hover {
    background: rgba(139, 195, 243, 0.25);
    border-color: rgba(139, 195, 243, 0.5);
    transform: scale(1.1);
    box-shadow: 0 0 10px var(--hk-accent-glow);
}

.hk-lang-toggle:active {
    transform: scale(0.92);
}

.hk-vram-btn {
    background: rgba(139, 195, 243, 0.1);
    border: 1px solid rgba(139, 195, 243, 0.25);
    color: var(--hk-accent);
    cursor: pointer;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 0.2s ease;
    font-size: 11px;
    position: relative;
}

.hk-vram-emoji {
    font-size: 13px;
    line-height: 1;
    position: relative;
    z-index: 1;
    transition: transform 0.2s ease;
    display: inline-block;
}

.hk-vram-btn:hover {
    background: rgba(76, 205, 196, 0.15);
    border-color: rgba(76, 205, 196, 0.5);
    color: #4dcdc4;
    transform: scale(1.1);
}

.hk-vram-btn:active {
    transform: scale(0.92);
}

.hk-vram-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
}

.hk-vram-sweeping::before {
    opacity: 1;
    animation: hk-sweep-scan 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes hk-sweep-scan {
    0% {
        background: conic-gradient(from 0deg, transparent 0%, rgba(77, 205, 196, 0.9) 8%, transparent 18%, transparent 100%);
    }
    100% {
        background: conic-gradient(from 360deg, transparent 82%, rgba(77, 205, 196, 0) 92%, transparent 100%);
    }
}

.hk-vram-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
}

.hk-vram-sweeping::after {
    animation: hk-sweep-flash 0.9s ease;
}

@keyframes hk-sweep-flash {
    0% { opacity: 0; box-shadow: inset 0 0 4px rgba(77, 205, 196, 0); }
    20% { opacity: 1; box-shadow: inset 0 0 10px rgba(77, 205, 196, 0.9); }
    60% { opacity: 0.6; box-shadow: inset 0 0 6px rgba(77, 205, 196, 0.4); }
    100% { opacity: 0; box-shadow: inset 0 0 4px rgba(77, 205, 196, 0); }
}

.hk-vram-sweeping .hk-vram-emoji {
    animation: hk-sweep-wobble 0.9s ease;
}

@keyframes hk-sweep-wobble {
    0%, 100% { transform: rotate(0deg); }
    15% { transform: rotate(-28deg); }
    30% { transform: rotate(22deg); }
    50% { transform: rotate(-16deg); }
    70% { transform: rotate(12deg); }
    85% { transform: rotate(-5deg); }
}

.hk-undo-redo-btn {
    background: rgba(139, 195, 243, 0.08);
    border: 1px solid rgba(139, 195, 243, 0.2);
    color: var(--hk-accent);
    cursor: pointer;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 15px;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.hk-undo-redo-btn:hover:not(:disabled) {
    background: rgba(139, 195, 243, 0.2);
    border-color: rgba(139, 195, 243, 0.45);
    transform: scale(1.08);
    box-shadow: 0 0 8px var(--hk-accent-glow);
}

.hk-undo-redo-btn:active:not(:disabled) {
    transform: scale(0.92);
}

.hk-undo-redo-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.hk-opacity-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    flex-shrink: 0;
    padding: 6px 10px;
    background:
        linear-gradient(145deg, rgba(35, 38, 48, 0.5) 0%, rgba(26, 29, 36, 0.6) 100%);
    border-radius: var(--hk-radius-sm);
    border: 1px solid rgba(139, 195, 243, 0.1);
}

.hk-opacity-bar-label {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--hk-text-muted);
    flex-shrink: 0;
    white-space: nowrap;
}

.hk-opacity-slider {
    flex: 1;
    min-width: 0;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg,
        rgba(139, 195, 243, 0.15) 0%,
        var(--hk-accent) 100%);
    outline: none;
    cursor: pointer;
    transition: background 0.15s ease;
}

.hk-opacity-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--hk-accent);
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), 0 0 6px var(--hk-accent-glow);
    cursor: pointer;
    transition: transform 0.15s ease;
}

.hk-opacity-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.hk-opacity-slider:active::-webkit-slider-thumb {
    transform: scale(1.35);
    transition: transform 0.1s ease;
}

.hk-opacity-slider::-moz-range-thumb:hover,
.hk-opacity-slider:active::-moz-range-thumb {
    transform: scale(1.2);
}

.hk-opacity-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--hk-accent);
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), 0 0 6px var(--hk-accent-glow);
    cursor: pointer;
    transition: transform 0.15s ease;
}

.hk-opacity-value {
    font-size: 10px;
    font-family: 'Consolas', 'Monaco', monospace;
    color: var(--hk-accent);
    flex-shrink: 0;
    min-width: 30px;
    text-align: right;
    font-weight: 600;
}

.hk-divider {
    height: 1px;
    background: linear-gradient(90deg,
        transparent 0%,
        rgba(139, 195, 243, 0.2) 20%,
        rgba(139, 195, 243, 0.35) 50%,
        rgba(139, 195, 243, 0.2) 80%,
        transparent 100%);
    width: 100%;
    margin: 9px 0 9px;
    position: relative;
}

.hk-divider.hk-divider-spaced {
    margin: clamp(12px, 1.6vw, 18px) 0 clamp(12px, 1.6vw, 18px);
}

.hk-section {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.hk-wrapper.visible .hk-header,
.hk-wrapper.visible .hk-section,
.hk-wrapper.visible .hk-info,
.hk-wrapper.visible .hk-opacity-bar {
    animation: hk-section-fade 0.3s ease-out both;
}

.hk-wrapper.visible .hk-header { animation-delay: 0.06s; }
.hk-wrapper.visible .hk-section { animation-delay: 0.1s; }
.hk-wrapper.visible .hk-info { animation-delay: 0.14s; }
.hk-wrapper.visible .hk-opacity-bar { animation-delay: 0.18s; }

@keyframes hk-section-fade {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

.hk-section-primary {
    margin-top: 0 !important;
}

.hk-divider + .hk-section-primary {
    margin-top: 0 !important;
}

.hk-subtitle {
    font-size: var(--hk-subtitle-font-size);
    margin: 0 0 1px 0;
    color: var(--hk-text-muted);
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
}

.hk-subtitle::before {
    content: '';
    width: 2px;
    height: 9px;
    background: linear-gradient(180deg, var(--hk-accent), var(--hk-accent-dark));
    border-radius: 2px;
}

.hk-palette-header,
.hk-custom-inline,
.hk-color-section-title {
    font-size: var(--hk-subtitle-font-size);
    color: var(--hk-text-muted);
    font-weight: 500;
}

.hk-button-grid {
    display: flex;
    flex-wrap: wrap;
    border-radius: var(--hk-radius-md);
    border: 1px solid rgba(139, 195, 243, 0.15);
    background: 
        linear-gradient(180deg, rgba(30, 33, 42, 0.8) 0%, rgba(22, 24, 29, 0.9) 100%);
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    --hk-button-unit: calc(100% / 6);
    padding: 4px;
    box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.hk-button-grid::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(139, 195, 243, 0.15), 
        transparent);
}

.hk-button {
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--hk-radius-sm);
    flex: 0 0 var(--hk-button-unit);
    aspect-ratio: 1 / 1;
    max-width: var(--hk-button-unit);
    padding: clamp(3px, 0.7vw, 5px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
}

.hk-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(139, 195, 243, 0.15) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
    border-radius: 50%;
    pointer-events: none;
}

.hk-button:hover:not(:disabled)::before,
.hk-button:focus-visible::before {
    width: 120%;
    height: 120%;
}

.hk-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: all 0.25s ease;
    filter: brightness(1) drop-shadow(0 0 0 transparent);
    position: relative;
    z-index: 1;
}

.hk-button:hover:not(:disabled),
.hk-button:focus-visible {
    transform: translateY(-2px) scale(1.02);
    background: rgba(139, 195, 243, 0.1);
    border-color: rgba(139, 195, 243, 0.25);
    outline: none;
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(139, 195, 243, 0.1) inset;
}

.hk-button:hover:not(:disabled) img {
    filter: brightness(1.2) drop-shadow(0 0 4px var(--hk-accent-glow));
}

.hk-button:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
    transition: transform 0.1s ease;
}

.hk-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    filter: grayscale(0.3);
}

.hk-button:disabled img {
    filter: grayscale(0.5) brightness(0.7);
}

.hk-info {
    background: 
        linear-gradient(135deg, rgba(40, 44, 54, 0.7) 0%, rgba(30, 33, 42, 0.8) 100%);
    border-radius: var(--hk-radius-md);
    padding: 12px 14px;
    font-size: var(--hk-body-font-size);
    color: var(--hk-text-muted);
    text-align: left;
    line-height: 1.5;
    border: 1px solid rgba(139, 195, 243, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.hk-info small {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    opacity: 0.7;
    font-style: italic;
}

.hk-color-strip,
.hk-color-footer,
.hk-color-recent {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    width: 100%;
    justify-content: flex-start;
}

.hk-color-recent {
    justify-content: center;
}

.hk-color-recent .hk-color-chip {
    width: 18px;
    height: 18px;
    aspect-ratio: auto;
    flex: 0 0 18px;
}

/* Saved colors strip — slightly emphasized to distinguish from recent */
.hk-saved-strip {
    min-height: 22px;
    padding: 6px;
    border-radius: var(--hk-radius-sm);
    background:
        linear-gradient(145deg, rgba(35, 38, 48, 0.5) 0%, rgba(26, 29, 36, 0.6) 100%);
    border: 1px solid rgba(139, 195, 243, 0.1);
    box-sizing: border-box;
    flex: 1;
}

.hk-saved-row {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
}

.hk-saved-nav {
    width: 18px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.1) 0%, rgba(139, 195, 243, 0.05) 100%);
    color: var(--hk-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 8px;
    padding: 0;
}

.hk-saved-nav:hover:not(:disabled) {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.25) 0%, rgba(139, 195, 243, 0.12) 100%);
    border-color: rgba(139, 195, 243, 0.5);
    transform: scale(1.1);
    box-shadow: 0 0 8px var(--hk-accent-glow);
}

.hk-saved-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.hk-saved-nav:active:not(:disabled) {
    transform: scale(0.92);
}

.hk-saved-empty {
    width: 100%;
    text-align: center;
    color: var(--hk-text-dim);
    font-size: 11px;
    letter-spacing: 0.1em;
}

.hk-custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    color: var(--hk-text-muted);
}

.hk-custom-toggle {
    border: 1px solid rgba(139, 195, 243, 0.25);
    background: 
        linear-gradient(180deg, rgba(139, 195, 243, 0.12) 0%, rgba(139, 195, 243, 0.06) 100%);
    color: var(--hk-accent);
    border-radius: var(--hk-radius-sm);
    padding: 5px 14px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    font-family: inherit;
    position: relative;
    overflow: hidden;
}

.hk-custom-toggle:hover {
    background: 
        linear-gradient(180deg, rgba(139, 195, 243, 0.2) 0%, rgba(139, 195, 243, 0.1) 100%);
    border-color: rgba(139, 195, 243, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.hk-custom-toggle:active {
    transform: translateY(0);
}

.hk-custom-toggle:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-custom-inline {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: clamp(7px, 1.2vh, 10px);
    padding: 10px;
    background:
        linear-gradient(145deg, rgba(35, 38, 48, 0.7) 0%, rgba(26, 29, 36, 0.85) 100%);
    border-radius: var(--hk-radius-md);
    border: 1px solid rgba(139, 195, 243, 0.15);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.hk-custom-row-top {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.hk-custom-label {
    color: var(--hk-text-muted);
    font-size: var(--hk-subtitle-font-size);
    font-weight: 600;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.hk-custom-label::before {
    content: '';
    width: 2px;
    height: 9px;
    background: linear-gradient(180deg, var(--hk-accent), var(--hk-accent-dark));
    border-radius: 2px;
}

.hk-custom-hex {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(139, 195, 243, 0.25);
    border-radius: 5px;
    padding: 6px 8px;
    color: var(--hk-text-strong);
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    flex: 1;
    min-width: 0;
    transition: all 0.2s ease;
    text-transform: uppercase;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
}

.hk-custom-hex:focus {
    outline: none;
    border-color: var(--hk-accent);
    background: rgba(0, 0, 0, 0.5);
    box-shadow:
        0 0 0 3px rgba(139, 195, 243, 0.12),
        inset 0 1px 2px rgba(0, 0, 0, 0.25);
}

.hk-custom-hex::placeholder {
    color: var(--hk-text-dim);
    text-transform: none;
}

.hk-custom-row-bottom {
    display: flex;
    align-items: stretch;
    gap: 8px;
    width: 100%;
}

.hk-custom-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    width: 100%;
}

.hk-custom-preview {
    flex: 1;
    min-width: 0;
    height: 30px;
    border-radius: 6px;
    border: 1px solid rgba(139, 195, 243, 0.3);
    background: linear-gradient(90deg,
        var(--hk-custom-preview-color, #8BC3F3) 0%,
        var(--hk-custom-preview-color, #8BC3F3) 100%);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.22),
        0 1px 4px rgba(0, 0, 0, 0.18);
    transition: background 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.hk-custom-preview:hover {
    border-color: var(--hk-accent);
    transform: translateY(-1px);
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.22),
        0 4px 12px rgba(0, 0, 0, 0.25),
        0 0 10px var(--hk-accent-glow);
}

/* Native color input overlays the preview so clicking opens the picker popup
   anchored to the preview itself (popup opens below, never covering the preview). */
.hk-custom-preview input[type="color"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    padding: 0;
}

.hk-custom-preview::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        linear-gradient(90deg,
            transparent 32.5%, rgba(255, 255, 255, 0.25) 33%, rgba(255, 255, 255, 0.25) 34%, transparent 34.5%,
            transparent 65.5%, rgba(255, 255, 255, 0.25) 66%, rgba(255, 255, 255, 0.25) 67%, transparent 67.5%);
    pointer-events: none;
}

.hk-custom-preview::after {
    content: attr(data-label);
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.92);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    pointer-events: none;
}

.hk-custom-save {
    border: 1px solid rgba(139, 195, 243, 0.4);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.2) 0%, rgba(139, 195, 243, 0.1) 100%);
    color: var(--hk-accent);
    border-radius: 6px;
    padding: 0 14px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    transition: all 0.2s ease;
    flex-shrink: 0;
    font-family: inherit;
    box-shadow:
        0 2px 5px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.hk-custom-save:hover {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.32) 0%, rgba(139, 195, 243, 0.18) 100%);
    border-color: var(--hk-accent);
    transform: translateY(-1px);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 10px var(--hk-accent-glow);
}

.hk-custom-save:active {
    transform: translateY(0) scale(0.97);
}

.hk-custom-save:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-custom-save.hk-save-flash {
animation: hk-save-flash 0.35s ease;
}

.hk-undo-redo-btn {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.1) 0%, rgba(139, 195, 243, 0.05) 100%);
    color: var(--hk-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    padding: 0;
    font-family: inherit;
}

.hk-undo-redo-btn:hover:not(:disabled) {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.25) 0%, rgba(139, 195, 243, 0.12) 100%);
    border-color: rgba(139, 195, 243, 0.5);
    transform: scale(1.1);
    box-shadow: 0 0 8px var(--hk-accent-glow);
}

.hk-undo-redo-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.hk-undo-redo-btn:active:not(:disabled) {
    transform: scale(0.92);
}

.hk-undo-redo-btn:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-pick-btn {
    border: 1px solid rgba(139, 195, 243, 0.35);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.15) 0%, rgba(139, 195, 243, 0.08) 100%);
    color: var(--hk-accent);
    border-radius: 6px;
    padding: 0;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    transition: all 0.2s ease;
    flex-shrink: 0;
    font-family: inherit;
    box-shadow:
        0 2px 5px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.hk-pick-btn:hover {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.3) 0%, rgba(139, 195, 243, 0.15) 100%);
    border-color: var(--hk-accent);
    transform: translateY(-1px) scale(1.05);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 10px var(--hk-accent-glow);
}

.hk-pick-btn:active {
    transform: translateY(0) scale(0.95);
}

.hk-pick-btn:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

@keyframes hk-save-flash {
    0% { box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05); }
    40% {
        background: linear-gradient(180deg, rgba(139, 195, 243, 0.55) 0%, rgba(139, 195, 243, 0.35) 100%);
        box-shadow: 0 0 16px var(--hk-accent-glow), 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: scale(1.04);
    }
    100% { box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05); }
}

.hk-color-carousel {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.hk-palette-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    margin: 0 0 6px 0;
    padding: 0 2px;
    color: var(--hk-text-muted);
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.hk-palette-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    margin: 0 0 7px 0;
    padding: 5px 8px;
    background:
        linear-gradient(145deg, rgba(35, 38, 48, 0.6) 0%, rgba(26, 29, 36, 0.75) 100%);
    border-radius: var(--hk-radius-sm);
    border: 1px solid rgba(139, 195, 243, 0.12);
}

.hk-palette-select {
    font-size: clamp(11px, 1.2vw, 13px);
    font-weight: 600;
    color: var(--hk-text-strong);
    letter-spacing: 0.01em;
    flex: 1;
    min-width: 0;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 3px 22px 3px 14px;
    border-radius: 6px;
    border: 1px solid rgba(139, 195, 243, 0.2);
    background:
        linear-gradient(180deg, var(--hk-accent), var(--hk-accent-dark)) left center / 3px 11px no-repeat,
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath fill='%238bc3f3' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E") right 8px center / 8px 5px no-repeat,
        linear-gradient(180deg, rgba(35, 38, 48, 0.6) 0%, rgba(26, 29, 36, 0.75) 100%);
    background-position: 6px center, right 8px center, 0 0;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.hk-palette-select::-ms-expand {
    display: none;
}

.hk-palette-select:hover {
    border-color: rgba(139, 195, 243, 0.5);
    box-shadow: 0 0 8px var(--hk-accent-glow);
}

.hk-palette-select:focus-visible {
    border-color: var(--hk-accent);
    box-shadow: 0 0 0 2px rgba(139, 195, 243, 0.25);
}

.hk-palette-select option {
    background: #1a1d24;
    color: var(--hk-text-strong);
    padding: 4px 8px;
}

.palette-index-display {
    background: rgba(139, 195, 243, 0.12);
    border: 1px solid rgba(139, 195, 243, 0.25);
    border-radius: 8px;
    padding: 1px 7px;
    font-size: 9px;
    font-family: 'Consolas', 'Monaco', monospace;
    letter-spacing: 0.04em;
    color: var(--hk-accent);
    flex-shrink: 0;
    min-width: 32px;
    text-align: center;
}

.hk-palette-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 3px;
    width: 100%;
    padding: 6px;
    background:
        linear-gradient(145deg, rgba(35, 38, 48, 0.5) 0%, rgba(26, 29, 36, 0.65) 100%);
    border-radius: var(--hk-radius-md);
    border: 1px solid rgba(139, 195, 243, 0.1);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.hk-palette-dots {
display: flex;
align-items: center;
justify-content: center;
flex-wrap: wrap;
gap: 3px;
flex: 1;
margin-top: 7px;
padding: 2px 0 0;
}

.hk-palette-dots-row {
display: flex;
align-items: center;
gap: 6px;
width: 100%;
margin-top: 7px;
}

.hk-custom-save-icon {
width: 30px;
height: 30px;
flex-shrink: 0;
border-radius: 6px;
border: 1px solid rgba(139, 195, 243, 0.4);
background:
linear-gradient(180deg, rgba(139, 195, 243, 0.2) 0%, rgba(139, 195, 243, 0.1) 100%);
color: var(--hk-accent);
display: inline-flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.2s ease;
font-size: 15px;
padding: 0;
}

.hk-custom-save-icon:hover {
background:
linear-gradient(180deg, rgba(139, 195, 243, 0.32) 0%, rgba(139, 195, 243, 0.18) 100%);
border-color: var(--hk-accent);
transform: translateY(-1px);
box-shadow:
0 4px 10px rgba(0, 0, 0, 0.2),
0 0 10px var(--hk-accent-glow);
}

.hk-custom-save-icon:active {
transform: translateY(0) scale(0.95);
}

.hk-palette-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: pointer;
    background: rgba(139, 195, 243, 0.25);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.hk-palette-dot:hover {
    background: rgba(139, 195, 243, 0.6);
    transform: scale(1.3);
}

.hk-palette-dot:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-palette-dot.active {
    background: var(--hk-accent);
    width: 18px;
    border-radius: 4px;
    box-shadow: 0 0 8px var(--hk-accent-glow);
}

.hk-palette-save-btn, .hk-palette-delete-btn {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.1) 0%, rgba(139, 195, 243, 0.05) 100%);
    color: var(--hk-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 10px;
    padding: 0;
}

.hk-palette-save-btn:hover, .hk-palette-delete-btn:hover {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.25) 0%, rgba(139, 195, 243, 0.12) 100%);
    border-color: rgba(139, 195, 243, 0.5);
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 8px var(--hk-accent-glow);
}

.hk-palette-delete-btn {
    border-color: rgba(244, 67, 54, 0.3);
    color: rgba(244, 67, 54, 0.8);
}

.hk-palette-delete-btn:hover {
    background: linear-gradient(180deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%);
    border-color: rgba(244, 67, 54, 0.6);
}

.hk-palette-arrow {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.1) 0%, rgba(139, 195, 243, 0.05) 100%);
    color: var(--hk-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 9px;
    padding: 0;
    font-weight: bold;
}

.hk-palette-arrow:hover {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.25) 0%, rgba(139, 195, 243, 0.12) 100%);
    border-color: rgba(139, 195, 243, 0.5);
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 8px var(--hk-accent-glow);
}

.hk-palette-arrow:active {
    transform: scale(0.92);
}

.hk-palette-arrow:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-palette-random {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.12) 0%, rgba(139, 195, 243, 0.05) 100%);
    color: var(--hk-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 11px;
    line-height: 1;
    padding: 0;
    margin-left: 4px;
}

.hk-palette-random:hover {
    background:
        linear-gradient(180deg, rgba(139, 195, 243, 0.28) 0%, rgba(139, 195, 243, 0.14) 100%);
    border-color: rgba(139, 195, 243, 0.55);
    transform: scale(1.12) rotate(20deg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 8px var(--hk-accent-glow);
}

.hk-palette-random:active {
    transform: scale(0.92) rotate(0deg);
}

.hk-palette-random:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-color-chip {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 4px;
    border: 1.5px solid transparent;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
    position: relative;
    box-sizing: border-box;
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hk-color-chip::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 6px;
    background: radial-gradient(circle, var(--hk-accent-glow) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.hk-color-chip::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    color: #ffffff;
    font-size: 9px;
    font-weight: bold;
    text-shadow: 
        0 0 4px rgba(0, 0, 0, 0.9),
        0 1px 2px rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 1;
}

.hk-color-chip:hover {
    transform: translateY(-2px) scale(1.15);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.35),
        0 0 0 2px rgba(139, 195, 243, 0.5);
    z-index: 2;
}

.hk-color-chip:hover::before {
    opacity: 1;
}

.hk-color-chip:active {
    transform: translateY(-1px) scale(0.96);
    transition: transform 0.08s ease;
}

.hk-color-chip:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 3px;
}

.hk-color-chip.selected {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 
        0 0 0 2px rgba(139, 195, 243, 0.6),
        0 4px 12px rgba(0, 0, 0, 0.4),
        0 0 15px var(--hk-accent-glow);
    transform: scale(1.05);
}

.hk-color-chip.selected::after {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.hk-color-custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--hk-body-font-size);
    color: var(--hk-text-muted);
    margin-top: 14px;
}

.hk-toggle-placeholder {
    width: 40px;
    height: 22px;
    border-radius: 12px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    background: 
        linear-gradient(180deg, rgba(30, 33, 42, 0.8) 0%, rgba(20, 22, 28, 0.9) 100%);
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}

.hk-toggle-placeholder::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--hk-accent-light), var(--hk-accent-dark));
    box-shadow: 
        0 2px 6px rgba(0, 0, 0, 0.3),
        0 0 8px var(--hk-accent-glow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hk-toggle-placeholder:hover {
    border-color: rgba(139, 195, 243, 0.4);
}

.hk-color-picker-placeholder {
    margin-top: 16px;
    border: 1px solid rgba(139, 195, 243, 0.2);
    border-radius: var(--hk-radius-lg);
    background: linear-gradient(135deg, #ffffff 0%, #ff0000 50%, #000000 100%);
    height: clamp(160px, 32vh, 220px);
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hk-color-picker-toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: 
        linear-gradient(180deg, rgba(16, 17, 21, 0.9) 0%, rgba(10, 11, 14, 0.95) 100%);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    color: var(--hk-text-muted);
    font-size: var(--hk-body-font-size);
    border-top: 1px solid rgba(139, 195, 243, 0.15);
}

.hk-color-picker-toolbar .hk-swatch {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hk-color-picker-toolbar .hk-slider-placeholder {
    flex: 1;
    height: 10px;
    border-radius: 6px;
    background: linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);
    box-shadow: 
        inset 0 2px 4px rgba(0, 0, 0, 0.3),
        0 1px 0 rgba(255, 255, 255, 0.05);
}

.hk-rgb-placeholder {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--hk-subtitle-font-size);
}

.hk-rgb-placeholder .hk-rgb-pill {
    width: 38px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid rgba(139, 195, 243, 0.2);
    background: 
        linear-gradient(180deg, rgba(30, 33, 42, 0.8) 0%, rgba(20, 22, 28, 0.9) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--hk-text-muted);
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

/* ── v3.1 Dual-color chips ── */
.hk-color-chip-dual {
    background: linear-gradient(to bottom,
        var(--hk-chip-title, #555) 0%,
        var(--hk-chip-title, #555) 38%,
        var(--hk-chip-body, #333) 38%,
        var(--hk-chip-body, #333) 100%) !important;
}

/* ── v3.1 T/B/Link dual-track buttons ── */
.hk-dual-btn {
    width: 22px;
    height: 22px;
    border: 1px solid rgba(139, 195, 243, 0.2);
    border-radius: var(--hk-radius-sm);
    background: rgba(26, 29, 36, 0.6);
    color: var(--hk-text-muted);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all 0.15s ease;
    flex-shrink: 0;
}
.hk-dual-btn:hover {
    border-color: var(--hk-accent);
    color: var(--hk-accent-light);
}
.hk-dual-btn.active {
    background: var(--hk-accent);
    color: #1a1d24;
    border-color: var(--hk-accent);
    box-shadow: 0 0 6px var(--hk-accent-glow);
}
.hk-dual-link {
    font-size: 12px;
    line-height: 1;
}
.hk-dual-link:not(.active) {
    opacity: 0.4;
}

/* ── v3.1 SV + Hue picker popup ── */
.hk-sv-picker {
    position: fixed;
    z-index: 100000;
    background: rgba(26, 29, 36, 0.95);
    border: 1px solid var(--hk-panel-border-light);
    border-radius: var(--hk-radius-md);
    padding: 4px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 195, 243, 0.1);
    backdrop-filter: blur(8px);
}
.hk-sv-canvas {
    display: block;
    border-radius: var(--hk-radius-sm);
    cursor: crosshair;
    touch-action: none;
}

/* ── v3.1 Custom preview as button ── */
.hk-custom-preview {
    cursor: pointer;
    border: 1px solid var(--hk-panel-border);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.hk-custom-preview:hover {
    border-color: var(--hk-accent);
    box-shadow: 0 0 6px var(--hk-accent-glow);
}

/* ── v3.1 Copy / Paste buttons ── */
.hk-copy-btn, .hk-paste-btn,
.hk-quick-copy, .hk-quick-paste {
    background: rgba(26, 29, 36, 0.6);
    border: 1px solid rgba(139, 195, 243, 0.15);
    color: var(--hk-text-muted);
    border-radius: var(--hk-radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    padding: 0;
    flex-shrink: 0;
}
.hk-copy-btn, .hk-paste-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
}
.hk-quick-copy, .hk-quick-paste {
    width: 28px;
    height: 28px;
    font-size: 14px;
}
.hk-copy-btn:hover, .hk-paste-btn:hover,
.hk-quick-copy:hover, .hk-quick-paste:hover {
    border-color: var(--hk-accent);
    color: var(--hk-accent-light);
    background: rgba(139, 195, 243, 0.08);
}

/* ── v3.1 Clip active state + color indicator ── */
.hk-paste-btn, .hk-quick-paste {
    position: relative;
    overflow: hidden;
}
.hk-copy-btn.has-clip, .hk-paste-btn.has-clip,
.hk-quick-copy.has-clip, .hk-quick-paste.has-clip {
    border-color: var(--hk-accent);
    color: var(--hk-accent-light);
    background: rgba(139, 195, 243, 0.12);
    box-shadow: inset 0 0 0 1px rgba(139, 195, 243, 0.15);
}
.hk-clip-indicator {
    position: absolute;
    bottom: 1px;
    left: 3px;
    right: 3px;
    height: 3px;
    border-radius: 2px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    pointer-events: none;
}
@keyframes hk-copy-flash {
    0% { box-shadow: 0 0 0 rgba(139, 195, 243, 0); }
    35% { box-shadow: 0 0 14px var(--hk-accent-glow); border-color: var(--hk-accent); color: #fff; }
    100% { box-shadow: 0 0 0 rgba(139, 195, 243, 0); }
}
.hk-copy-btn.clip-flash, .hk-quick-copy.clip-flash {
    animation: hk-copy-flash 0.6s ease;
}

/* ── v3.4 Eyedropper button ── */
.hk-eyedropper-btn {
    font-size: 13px;
}
.hk-eyedropper-btn:hover {
    border-color: var(--hk-accent);
    color: var(--hk-accent-light);
}

/* ── v3.4 Spacing row labels ── */
.hk-spacing-label {
    font-size: 11px;
    color: var(--hk-text-muted);
    white-space: nowrap;
    flex-shrink: 0;
}

/* ── v3.4 Group color dot ── */
.hk-grp-color-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    flex-shrink: 0;
    margin-left: 4px;
}

/* Quick group button — inherits hk-pick-btn sizing */
.hk-quick-group-btn {
    position: relative;
}
.hk-quick-group-btn .hk-grp-color-dot {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
}
`;
