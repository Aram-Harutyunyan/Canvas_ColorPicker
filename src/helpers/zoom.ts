interface Props {
  cursorCtx: CanvasRenderingContext2D;
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
}

const zoom = ({ cursorCtx, x, y, canvas }: Props) => {
  cursorCtx.imageSmoothingEnabled = false;
  cursorCtx.drawImage(
    canvas,
    Math.min(Math.max(0, x - 10), canvas.width - 10),
    Math.min(Math.max(0, y - 10), canvas.height - 10),
    10,
    10,
    0,
    0,
    100,
    100
  );
};

export default zoom;
