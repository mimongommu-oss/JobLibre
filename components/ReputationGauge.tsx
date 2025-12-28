
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ReputationGaugeProps {
  score: number; // 0 to 5
  size?: number; // Size in pixels
  showLabel?: boolean;
}

export const ReputationGauge: React.FC<ReputationGaugeProps> = ({ score, size = 120, showLabel = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2;
    // Thickness relative to size
    const strokeWidth = size * 0.08; 
    const innerRadius = radius - strokeWidth;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Background arc
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('d', arc as any)
      .attr('fill', '#F3F4F6'); // gray-100

    // Foreground arc
    const percentage = score / 5;
    const foregroundArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI * percentage)
      .cornerRadius(strokeWidth / 2);

    g.append('path')
      .attr('d', foregroundArc as any)
      .attr('fill', '#FFD700'); // jobgold

    // Text Score
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', showLabel ? '-0.1em' : '0.35em')
      .attr('class', 'font-black fill-gray-900')
      .style('font-size', `${size * 0.25}px`)
      .text(score.toFixed(1));

    if (showLabel) {
        g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.4em')
        .attr('class', 'uppercase font-bold fill-gray-400')
        .style('font-size', `${size * 0.09}px`)
        .text('Avis');
    }

  }, [score, size, showLabel]);

  return <svg ref={svgRef}></svg>;
};
