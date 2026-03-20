'use client';

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Props = {
  roomId: Id<'rooms'>;
  onCancel: () => void;
  onSendComplete: () => void;
};

const COLORS = ['#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
const BRUSH_SIZES = [2, 5, 10];

export function CanvasDraw({ roomId, onCancel, onSendComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const [isUploading, setIsUploading] = useState(false);
  
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const sendMessage = useMutation(api.messages.sendMessage);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = 300; // Fixed height
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  // Drawing handlers
  const startDrawing = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.closePath();
      setIsDrawing(false);
    }
  };

  // Event handlers for Mouse and Touch
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) startDrawing(e.clientX - rect.left, e.clientY - rect.top);
  };
  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) draw(e.clientX - rect.left, e.clientY - rect.top);
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect && touch) startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  };
  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect && touch) draw(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSend = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsUploading(true);
    try {
      // 1. Convert to Blob
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Canvas to Blob failed');

      // 2. Get upload URL
      const postUrl = await generateUploadUrl();

      // 3. Upload file
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': blob.type },
        body: blob,
      });
      const { storageId } = await result.json();

      // 4. Send message with storageId link
      const url = `/api/storage/${storageId}`;
      await sendMessage({ roomId, content: url, type: 'sketch' });
      
      onSendComplete();
    } catch (error) {
      toast.error('Failed to send sketch');
      onCancel();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-4 w-full bg-accent/10 rounded-xl p-3 border border-border animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold">Draw a Sketch</span>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-background p-1 rounded-md border">
              {COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`size-5 rounded-full border border-black/10 transition-transform ${color === c ? 'scale-125 ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <div className="flex gap-1 bg-background p-1 rounded-md border items-center">
              {BRUSH_SIZES.map(s => (
                <button 
                  key={s}
                  onClick={() => setBrushSize(s)}
                  className={`flex items-center justify-center size-6 rounded hover:bg-muted transition-colors ${brushSize === s ? 'bg-muted' : ''}`}
                  aria-label={`Brush size ${s}`}
                >
                  <div className="bg-foreground rounded-full" style={{ width: s, height: s }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-2 border-dashed border-border rounded-lg overflow-hidden bg-white cursor-crosshair">
          <canvas
            ref={canvasRef}
            className="w-full touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={endDrawing}
            onTouchCancel={endDrawing}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          disabled={isUploading}
          title="Cancel"
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon icon="solar:close-circle-linear" className="size-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={clearCanvas}
          disabled={isUploading}
          title="Clear"
        >
          <Icon icon="solar:eraser-square-linear" className="size-5 text-amber-500" />
        </Button>
        <Button 
          size="icon" 
          onClick={handleSend}
          disabled={isUploading}
          title="Send Sketch"
          className="mt-auto h-12 w-10 text-primary-foreground"
        >
          {isUploading ? (
            <Icon icon="solar:spinner-linear" className="size-5 animate-spin" />
          ) : (
            <Icon icon="solar:plain-2-bold" className="size-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
