"use client";

import { useEffect } from "react";

export default function InteractiveGridScript() {
  useEffect(() => {
    const GRID_BLOCK_SIZE = 40;
    const GRID_HIGHLIGHT_DURATION = 300;

    let gridBlocks: any[] = [];
    let gridWidth: number, gridHeight: number;

    const gridMouse = {
      x: undefined as number | undefined,
      y: undefined as number | undefined,
      radius: GRID_BLOCK_SIZE * 2,
    };

    const container = document.querySelector(".interactive-grid") as HTMLElement;
    if (!container) return;

    function resetInteractiveGrid() {
      container.innerHTML = "";
      gridBlocks = [];

      gridWidth = window.innerWidth;
      gridHeight = window.innerHeight;

      const gridColumnCount = Math.ceil(gridWidth / GRID_BLOCK_SIZE);
      const gridRowCount = Math.ceil(gridHeight / GRID_BLOCK_SIZE);

      const gridOffsetX = (gridWidth - gridColumnCount * GRID_BLOCK_SIZE) / 2;
      const gridOffsetY = (gridHeight - gridRowCount * GRID_BLOCK_SIZE) / 2;

      for (let r = 0; r < gridRowCount; r++) {
        for (let c = 0; c < gridColumnCount; c++) {
          createBlock(
            c * GRID_BLOCK_SIZE + gridOffsetX,
            r * GRID_BLOCK_SIZE + gridOffsetY,
            c,
            r
          );
        }
      }
    }

    function createBlock(x: number, y: number, gx: number, gy: number) {
      const block = document.createElement("div");
      block.classList.add("block");
      block.style.width = `${GRID_BLOCK_SIZE}px`;
      block.style.height = `${GRID_BLOCK_SIZE}px`;
      block.style.left = `${x}px`;
      block.style.top = `${y}px`;

      container.appendChild(block);

      gridBlocks.push({
        element: block,
        x: x + GRID_BLOCK_SIZE / 2,
        y: y + GRID_BLOCK_SIZE / 2,
        gridX: gx,
        gridY: gy,
        highlightEndTime: 0,
      });
    }

    function handleMove(e: MouseEvent) {
      gridMouse.x = e.clientX;
      gridMouse.y = e.clientY;
      addHighlights();
    }

    function handleOut() {
      gridMouse.x = undefined;
      gridMouse.y = undefined;
    }

    function addHighlights() {
      if (!gridMouse.x || !gridMouse.y) return;

      let closest = null as any;
      let closestDistance = Infinity;

      for (const block of gridBlocks) {
        const dx = gridMouse.x - block.x;
        const dy = gridMouse.y - block.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < closestDistance) {
          closestDistance = dist;
          closest = block;
        }
      }

      if (!closest || closestDistance > gridMouse.radius) return;

      const now = Date.now();
      closest.element.classList.add("highlight");
      closest.highlightEndTime = now + GRID_HIGHLIGHT_DURATION;

      let clusterCount = 1;
      let current = closest;
      let used = [closest];

      for (let i = 0; i < clusterCount; i++) {
        const neighbors = gridBlocks.filter((n) => {
          if (used.includes(n)) return false;
          return (
            Math.abs(n.gridX - current.gridX) <= 1 &&
            Math.abs(n.gridY - current.gridY) <= 1
          );
        });

        if (neighbors.length === 0) break;

        const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
        chosen.element.classList.add("highlight");
        chosen.highlightEndTime =
          now + GRID_HIGHLIGHT_DURATION + i * 10;

        used.push(chosen);
        current = chosen;
      }
    }

    function update() {
      const now = Date.now();
      for (const block of gridBlocks) {
        if (block.highlightEndTime && now > block.highlightEndTime) {
          block.element.classList.remove("highlight");
          block.highlightEndTime = 0;
        }
      }
      requestAnimationFrame(update);
    }

    resetInteractiveGrid();
    update();

    window.addEventListener("resize", resetInteractiveGrid);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("resize", resetInteractiveGrid);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return null;
}
