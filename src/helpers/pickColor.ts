interface pickColorProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
}

const pickColor = ({ ctx, x, y }: pickColorProps): string => {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const color = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
    .toString(16)
    .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
  return color;
};
export default pickColor;
