import React, { useState, useRef, useCallback, useEffect } from "react";
import pickColor from "../helpers/pickColor";
import "./colorPicker.css";
import zoom from "../helpers/zoom";

const CURSOR_SIZE = 100;
const STROKE_WIDTH = 4;

const ColorPicker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !isActive) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;

      const color = pickColor({ ctx, x, y });
      setPickedColor(color);
      setIsActive(false);
      document.body.style.cursor = "default";
    },
    [isActive]
  );

  const handleDropperClick = () => {
    setIsActive(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!canvas || !ctx) return;

    const image = new Image();
    image.src = "/images/template.jpg";
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    const updateCursor = (event: PointerEvent) => {
      if (!isActive) return;

      const x = event.offsetX;
      const y = event.offsetY;

      const color = pickColor({ ctx, x, y });
      const cursorImage = document.createElement("canvas");
      const cursorCtx = cursorImage.getContext("2d");
      if (!cursorCtx) return;

      cursorImage.width = CURSOR_SIZE;
      cursorImage.height = CURSOR_SIZE;

      zoom({ cursorCtx, x, y, canvas });
      cursorCtx.globalCompositeOperation = "destination-in";

      cursorCtx.beginPath();
      cursorCtx.arc(
        CURSOR_SIZE / 2,
        CURSOR_SIZE / 2,
        CURSOR_SIZE / 2 - 5,
        0,
        2 * Math.PI
      );

      cursorCtx.fill();
      cursorCtx.globalCompositeOperation = "source-over";

      cursorCtx.strokeStyle = "white";
      cursorCtx.lineWidth = STROKE_WIDTH;
      cursorCtx.stroke();

      cursorCtx.font = "12px Arial";
      cursorCtx.textAlign = "center";
      cursorCtx.textBaseline = "middle";
      cursorCtx.fillText(color, CURSOR_SIZE / 2, CURSOR_SIZE / 2);

      document.body.style.cursor = `url(${cursorImage.toDataURL()}), auto`;
    };

    const handleMouseMove = (event: PointerEvent) => {
      updateCursor(event);
    };

    document.addEventListener("pointermove", handleMouseMove);

    return () => {
      document.removeEventListener("pointermove", handleMouseMove);
    };
  }, [isActive]);

  return (
    <div className="Wrapper">
      <div className="PickerWrapper">
        <img
          src="/images/IconColorPicker.svg"
          alt="Dropper Icon"
          style={{ cursor: "pointer" }}
          onClick={handleDropperClick}
        />
        <div>Picked Color: {pickedColor}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth * 2}
        height={window.innerHeight * 2}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default ColorPicker;
