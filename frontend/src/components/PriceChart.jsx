import { useEffect, useRef } from 'react';
import '../styles/PriceChart.css';

const PriceChart = ({ priceData = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || priceData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 40;
    canvas.height = 300;

    // Calculate dimensions
    const padding = 40;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;

    // Find min and max prices
    const prices = priceData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Draw background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1e2d4a';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (graphHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#3d5a80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw line chart
    ctx.strokeStyle = '#00d4ff';
    ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    const points = priceData.map((d, i) => {
      const x = padding + (graphWidth / (priceData.length - 1 || 1)) * i;
      const y = canvas.height - padding - ((d.price - minPrice) / priceRange) * graphHeight;
      return { x, y };
    });

    // Draw filled area
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, canvas.height - padding);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
      ctx.closePath();
      ctx.fill();
    }

    // Draw line
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }

    // Draw points
    points.forEach(p => {
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#8b9bc1';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const price = maxPrice - (priceRange / gridLines) * i;
      const y = padding + (graphHeight / gridLines) * i;
      ctx.fillText('₹' + Math.round(price), padding - 10, y + 4);
    }
  }, [priceData]);

  return (
    <div className="price-chart-container">
      <h3>Price History</h3>
      {priceData.length === 0 ? (
        <div className="no-data">No price data available</div>
      ) : (
        <canvas ref={canvasRef} className="chart-canvas"></canvas>
      )}
    </div>
  );
};

export default PriceChart;
