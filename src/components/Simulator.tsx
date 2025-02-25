import { loadAndGetGraphics } from "@/lib/graphics-load";
import { useEffect, useRef, useState } from "react";
import { type World, WorldObjects } from "@/lib/types";
import { colors } from "@/lib/colors";

interface Props {
  world: World;
}

export function Simulator({ world }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphicsLoaded, setGraphicsLoaded] = useState(false);
  const graphics = useRef<Record<string, HTMLImageElement>>({});
  const tileMapRef = useRef<number[][]>([]);

  // Generate random tile map on world dimension change
  useEffect(() => {
    if (
      tileMapRef.current.length !== world.length ||
      tileMapRef.current[0]?.length !== world[0].length
    ) {
      const newTileMap: number[][] = [];

      for (let i = 0; i < world.length; i++) {
        newTileMap[i] = [];
        for (let j = 0; j < world[0].length; j++) {
          let tileNumber = 3; // default to 3

          // Check if left tile is part of a 1-2 combination
          const leftIsPartOfPair =
            j > 0 &&
            (newTileMap[i][j - 1] === 1 ||
              newTileMap[i][j - 1] === 2 ||
              (i > 0 &&
                newTileMap[i - 1][j - 1] === 1 &&
                newTileMap[i][j - 1] === 2));

          if (i === 0) {
            // First row
            if (leftIsPartOfPair) {
              // If left tile is part of a pair, can only be 3 or 4
              tileNumber = Math.random() < 0.5 ? 3 : 4;
            } else {
              // Can be 2 or 3/4
              tileNumber =
                Math.random() < 0.5 ? 2 : Math.random() < 0.5 ? 3 : 4;
            }
          } else if (i === world.length - 1) {
            // Last row
            if (leftIsPartOfPair) {
              // If left tile is part of a pair, can only be 3 or 4
              tileNumber = Math.random() < 0.5 ? 3 : 4;
            } else {
              // Can be 1 or 3/4
              tileNumber =
                Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 3 : 4;
            }
          } else {
            // Middle rows
            if (newTileMap[i - 1][j] === 1) {
              // If tile above is 1, this must be 2
              tileNumber = 2;
            } else if (
              newTileMap[i - 1][j] === 2 ||
              newTileMap[i - 1][j] === 3 ||
              newTileMap[i - 1][j] === 4
            ) {
              // If tile above is 2/3/4
              if (leftIsPartOfPair) {
                // If left tile is part of a pair, can only be 3 or 4
                tileNumber = Math.random() < 0.5 ? 3 : 4;
              } else {
                // Can be either 1 (starting new pair) or 3/4
                const startNewPair = Math.random() < 0.4; // 40% chance to start new pair
                if (startNewPair) {
                  tileNumber = 1;
                } else {
                  tileNumber = Math.random() < 0.5 ? 3 : 4;
                }
              }
            }
          }

          newTileMap[i][j] = tileNumber;
        }
      }

      tileMapRef.current = newTileMap;
    }
  }, [world]);

  // Load images on mount
  useEffect(() => {
    loadAndGetGraphics().then((res) => {
      if (res) {
        graphics.current = res;
      }
      setGraphicsLoaded(true);
    });
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphicsLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 200;
    const labelPadding = 40;

    const canvasWidth = world[0].length * cellSize;
    const canvasHeight = world.length * cellSize;

    canvas.width = canvasWidth + labelPadding;
    canvas.height = canvasHeight + labelPadding;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background tiles
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[0].length; j++) {
        const tileNumber = tileMapRef.current[i][j];
        const tileImage = graphics.current[`tile${tileNumber}`];
        ctx.drawImage(
          tileImage,
          labelPadding + j * cellSize,
          i * cellSize,
          cellSize,
          cellSize
        );
      }
    }

    // Draw grid lines
    ctx.strokeStyle = colors.gray[100];
    ctx.lineWidth = 1;
    for (let j = 0; j <= world[0].length; j++) {
      ctx.beginPath();
      ctx.moveTo(labelPadding + j * cellSize, 0);
      ctx.lineTo(labelPadding + j * cellSize, canvasHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= world.length; i++) {
      ctx.beginPath();
      ctx.moveTo(labelPadding, i * cellSize);
      ctx.lineTo(labelPadding + canvasWidth, i * cellSize);
      ctx.stroke();
    }

    // Draw row numbers
    ctx.font = "34px arial";
    ctx.fillStyle = colors.gray[600];
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i < world.length; i++) {
      const rowNumber = world.length - i; // 1-based and reversed
      ctx.fillText(
        rowNumber.toString(),
        labelPadding - 5,
        i * cellSize + cellSize / 2
      );
    }

    // Draw column numbers
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let j = 0; j < world[0].length; j++) {
      const columnNumber = j + 1; // 1-based
      ctx.fillText(
        columnNumber.toString(),
        labelPadding + j * cellSize + cellSize / 2,
        canvasHeight + 10
      );
    }

    // Draw world objects
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[0].length; j++) {
        for (const cell of world[i][j]) {
          switch (cell.type) {
            case WorldObjects.EMPTY:
              continue;

            case WorldObjects.PLAYER:
              ctx.drawImage(
                graphics.current.mapCharacter,
                labelPadding + j * cellSize + cellSize * 0.2,
                i * cellSize + cellSize * 0.15,
                cellSize * 0.6,
                cellSize * 0.8
              );
              break;

            case WorldObjects.DESTINATION:
              ctx.drawImage(
                graphics.current.mapService,
                labelPadding + j * cellSize + cellSize * 0.025,
                i * cellSize + cellSize * 0.025,
                cellSize * 0.95,
                cellSize * 0.95
              );
              break;

            case WorldObjects.COIN: {
              const value = cell.data.value;
              const coinSize = cellSize * 0.2;

              // Draw store first
              ctx.drawImage(
                graphics.current.mapStore,
                labelPadding + j * cellSize + cellSize * 0.2,
                i * cellSize + cellSize * 0.45,
                cellSize * 0.6,
                cellSize * 0.5
              );

              // Calculate coin positions based on count (max 3)
              const coinsCount = Math.min(value, 3);
              const totalWidth =
                coinsCount * coinSize + (coinsCount - 1) * (coinSize * 0.2);
              const startX =
                labelPadding + j * cellSize + (cellSize - totalWidth) / 2;

              // Draw coins
              for (let k = 0; k < coinsCount; k++) {
                ctx.drawImage(
                  graphics.current.mapCoin,
                  startX + k * (coinSize * 1.2),
                  i * cellSize + cellSize * 0.15,
                  coinSize,
                  coinSize
                );
              }
              break;
            }
          }
        }
      }
    }
  }, [graphicsLoaded, world]);

  return (
    <canvas ref={canvasRef} className="h-full w-full">
      Coin Collector
    </canvas>
  );
}
