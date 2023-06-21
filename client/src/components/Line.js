
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import '../styles/Line.css';

const Line = () => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    const currentRef = ref.current; // Copying ref to a variable

    const g = svg.append('g'); // Create a group element

    const drawLine = (width, height) => {
      g.selectAll('path').remove(); // Clear line from the group
      const line = d3.line()([
        [width * 0.125, height / 2], // Starting point: left middle
        [width * 0.875, height / 2] // Ending point: right middle
      ]);
      g.append('path')
        .attr('d', line)
        .attr('stroke', 'black')
        .attr('fill', 'none');

      // Define the number of ticks and their positions
      const tickCount = 30;
      const tickScale = d3.scaleLinear()
        .domain([0, tickCount - 1])
        .range([width * 0.125, width * 0.875]);

      // Draw the ticks
      for (let i = 0; i < tickCount; i++) {
        g.append('line')
          .attr('x1', tickScale(i))
          .attr('y1', height / 2 - 10) // 10 is half the length of the tick
          .attr('x2', tickScale(i))
          .attr('y2', height / 2 + 10) // 10 is half the length of the tick
          .attr('stroke', 'black');
        }
    };

    const zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // zoom limits
      .on('zoom', (event) => {
        g.attr('transform', event.transform); // Apply transform to the group
      });

    svg.call(zoom);

    const resetZoom = () => {
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    };

    document.getElementById('resetButton').addEventListener('click', resetZoom);

    // Resize observer
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        drawLine(width, height);
      }
    });

    // Observe the ref
    ro.observe(currentRef);

    // Force a resize event to ensure the initial line is correctly drawn
    window.dispatchEvent(new Event('resize'));

    // Cleanup function
    return () => {
      ro.unobserve(currentRef);
      document.getElementById('resetButton').removeEventListener('click', resetZoom);
    };

  }, []);

  return (
    <>
      <svg className="TheLine" ref={ref} width="100%" height="100%"></svg>
      <button id="resetButton">Reset Zoom</button>
    </>
  );
};

export default Line;
