'use client';

import { useState, useEffect, useRef } from 'react';

export default function SkillGraph({ nodesData = [], linksData = [] }) {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  const containerRef = useRef(null);
  const dragNodeRef = useRef(null);
  const svgRef = useRef(null);
  const animationRef = useRef(null);

  // Resize handler
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(300, rect.width);
      // Adjust height based on screen size
      const newHeight = window.innerWidth < 640 ? 320 : 450;
      setDimensions({ width: newWidth, height: newHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync and initialize node positions inside the layout bounds
  useEffect(() => {
    if (nodesData.length === 0) return;

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;

    const posMap = new Map();
    nodes.forEach(n => {
      posMap.set(n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy });
    });

    const initializedNodes = nodesData.map((node, i) => {
      const existing = posMap.get(node.id);
      const angle = (i / Math.max(1, nodesData.length)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.28;
      
      return {
        ...node,
        x: existing?.x ?? (cx + Math.cos(angle) * radius),
        y: existing?.y ?? (cy + Math.sin(angle) * radius),
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
      };
    });

    setNodes(initializedNodes);
    setLinks(linksData);
  }, [nodesData, linksData, dimensions.width, dimensions.height]);

  // Run physics engine
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      setNodes(prevNodes => {
        if (prevNodes.length === 0) return prevNodes;

        const updated = prevNodes.map(n => ({ ...n }));
        const { width, height } = dimensions;
        const cx = width / 2;
        const cy = height / 2;

        const k_repel = width < 640 ? 2500 : 4500;
        const k_attract = 0.045;
        const k_gravity = 0.015;
        const damping = 0.85;
        const rest_length = width < 640 ? 60 : 85;

        // 1. Repulsion between nodes (Coulomb's Law)
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const u = updated[i];
            const v = updated[j];
            const dx = u.x - v.x;
            const dy = u.y - v.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq) || 1;
            
            if (dist < 200) {
              const force = k_repel / (distSq + 120);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              u.vx += fx;
              u.vy += fy;
              v.vx -= fx;
              v.vy -= fy;
            }
          }
        }

        // 2. Attraction along links (Hooke's Law)
        links.forEach(link => {
          const sId = link.source || (link.source?.id || link.source);
          const tId = link.target || (link.target?.id || link.target);
          const sourceNode = updated.find(n => n.id === sId);
          const targetNode = updated.find(n => n.id === tId);

          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = k_attract * (dist - rest_length);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            sourceNode.vx += fx;
            sourceNode.vy += fy;
            targetNode.vx -= fx;
            targetNode.vy -= fy;
          }
        });

        // 3. Centering Gravity & Velocity update
        updated.forEach(n => {
          if (dragNodeRef.current && dragNodeRef.current.id === n.id) {
            n.x = dragNodeRef.current.x;
            n.y = dragNodeRef.current.y;
            n.vx = 0;
            n.vy = 0;
          } else {
            n.vx += (cx - n.x) * k_gravity;
            n.vy += (cy - n.y) * k_gravity;

            n.vx *= damping;
            n.vy *= damping;

            n.x += n.vx;
            n.y += n.vy;

            // Contain nodes within responsive SVG boundaries
            n.x = Math.max(30, Math.min(width - 30, n.x));
            n.y = Math.max(30, Math.min(height - 30, n.y));
          }
        });

        return updated;
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [links, dimensions]);

  // Interaction handlers (Mouse and Touch support)
  const getCoordinatesFromEvent = (e) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Check touch vs mouse
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleStartDrag = (node, e) => {
    const coords = getCoordinatesFromEvent(e);
    if (!coords) return;
    
    dragNodeRef.current = {
      id: node.id,
      x: coords.x,
      y: coords.y
    };
  };

  const handleDragMove = (e) => {
    if (!dragNodeRef.current) return;
    const coords = getCoordinatesFromEvent(e);
    if (!coords) return;
    
    dragNodeRef.current.x = coords.x;
    dragNodeRef.current.y = coords.y;
    
    // Update active tooltip position if dragging hovered node
    if (hoveredNode && hoveredNode.id === dragNodeRef.current.id) {
      setHoveredNode(prev => prev ? { ...prev, x: coords.x, y: coords.y } : null);
    }
  };

  const handleStopDrag = () => {
    dragNodeRef.current = null;
  };

  const getLineCoords = (link) => {
    const sId = link.source || (link.source?.id || link.source);
    const tId = link.target || (link.target?.id || link.target);
    const s = nodes.find(n => n.id === sId);
    const t = nodes.find(n => n.id === tId);
    if (!s || !t) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    return { x1: s.x, y1: s.y, x2: t.x, y2: t.y };
  };

  const getGroupColor = (group) => {
    switch (group?.toLowerCase()) {
      case 'frontend': return 'var(--orange-yellow-crayola)';
      case 'backend': return '#4da3ff';
      case 'language': return '#10b981';
      case 'tool':
      case 'tools': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <div 
      className="skill-graph-container" 
      ref={containerRef}
      style={{
        position: 'relative',
        background: 'var(--bg-gradient-jet)',
        border: '1px solid var(--jet)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: 'var(--shadow-2)',
        overflow: 'hidden',
        width: '100%',
        marginBottom: '32px'
      }}
    >
      <div 
        className="skill-graph-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h4 className="h4" style={{ margin: 0, fontSize: '18px', fontWeight: 'var(--fw-600)', color: 'var(--white-2)' }}>
            Interactive Skill Web
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--fs-8)', color: 'var(--light-gray-70)', fontWeight: 'var(--fw-300)' }}>
            Hover nodes to see skill levels; drag to explore spring relationships.
          </p>
        </div>

        {/* Legend */}
        <div 
          className="skill-graph-legend"
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {['Frontend', 'Backend', 'Language', 'Tools'].map(grp => (
            <div key={grp} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: getGroupColor(grp),
                  boxShadow: `0 0 6px ${getGroupColor(grp)}` 
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--light-gray)', fontWeight: 'var(--fw-400)' }}>
                {grp}
              </span>
            </div>
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{
          background: 'rgba(5, 5, 5, 0.45)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          cursor: dragNodeRef.current ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleStopDrag}
        onMouseLeave={handleStopDrag}
        onTouchMove={handleDragMove}
        onTouchEnd={handleStopDrag}
      >
        <defs>
          {/* Subtle node shadows & glowing paths */}
          <filter id="glow-effect" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connections Layer */}
        {links.map((link, idx) => {
          const coords = getLineCoords(link);
          const isHighlighted = hoveredNode && 
            (hoveredNode.id === (link.source?.id || link.source) || hoveredNode.id === (link.target?.id || link.target));

          return (
            <line
              key={idx}
              x1={coords.x1}
              y1={coords.y1}
              x2={coords.x2}
              y2={coords.y2}
              stroke={isHighlighted ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.06)'}
              strokeWidth={isHighlighted ? '2.5' : '1.5'}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          );
        })}

        {/* Nodes Layer */}
        {nodes.map(node => {
          const color = getGroupColor(node.group);
          const isHovered = hoveredNode && hoveredNode.id === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              style={{ cursor: 'inherit' }}
              onMouseDown={(e) => handleStartDrag(node, e)}
              onTouchStart={(e) => handleStartDrag(node, e)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer soft aura */}
              <circle
                r={isHovered ? 26 : 18}
                fill={color}
                opacity={isHovered ? 0.25 : 0.08}
                style={{ transition: 'r 0.3s, opacity 0.3s', filter: 'blur(3px)' }}
              />

              {/* Skill Node Core */}
              <circle
                r={isHovered ? 15 : 12}
                fill="#0f172a"
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
                style={{ transition: 'r 0.3s, stroke-width 0.3s, fill 0.3s' }}
              />

              {/* Progress Level Ring */}
              <circle
                r={isHovered ? 19 : 15}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray={`${(node.level || 80) * (isHovered ? 1.19 : 0.94)}, 150`}
                opacity={isHovered ? 0.8 : 0.25}
                transform="rotate(-90)"
                style={{ transition: 'r 0.3s, opacity 0.3s, stroke-dasharray 0.3s' }}
              />

              {/* Icon Placeholder or Inner Label Indicator */}
              {node.icon ? (
                <foreignObject
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  style={{ pointerEvents: 'none' }}
                >
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: isHovered ? 'white' : color, 
                      fontSize: '12px',
                      transition: 'color 0.3s'
                    }}
                  >
                    <ion-icon name={node.icon}></ion-icon>
                  </div>
                </foreignObject>
              ) : (
                <circle
                  r="3.5"
                  fill={isHovered ? 'white' : color}
                  style={{ transition: 'fill 0.3s' }}
                />
              )}

              {/* Text Label under Node */}
              <text
                y={isHovered ? 34 : 28}
                textAnchor="middle"
                fill={isHovered ? 'var(--white-2)' : 'var(--light-gray)'}
                fontSize="10px"
                fontWeight={isHovered ? '600' : '400'}
                fontFamily="var(--ff-poppins)"
                style={{
                  pointerEvents: 'none',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                  transition: 'y 0.3s, fill 0.3s, font-weight 0.3s'
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Glassmorphic Tooltip Card */}
      {hoveredNode && (
        <div
          className="skill-graph-tooltip"
          style={{
            position: 'absolute',
            left: `${Math.min(dimensions.width - 200, Math.max(20, hoveredNode.x - 90))}px`,
            top: `${Math.max(20, hoveredNode.y - 110)}px`,
            width: '180px',
            background: 'rgba(21, 21, 26, 0.88)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${getGroupColor(hoveredNode.group)}`,
            borderRadius: '14px',
            padding: '12px 14px',
            boxShadow: 'var(--shadow-2)',
            zIndex: 100,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {hoveredNode.icon && (
              <span 
                style={{ 
                  color: getGroupColor(hoveredNode.group), 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ion-icon name={hoveredNode.icon}></ion-icon>
              </span>
            )}
            <h5 
              className="h5" 
              style={{ 
                margin: 0, 
                fontSize: '13px', 
                fontWeight: 'var(--fw-600)', 
                color: 'var(--white-1)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {hoveredNode.label}
            </h5>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--light-gray-70)', marginBottom: '4px' }}>
            <span>Category: {hoveredNode.group}</span>
            <span style={{ color: getGroupColor(hoveredNode.group), fontWeight: 'var(--fw-600)' }}>{hoveredNode.level}%</span>
          </div>

          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${hoveredNode.level}%`, 
                height: '100%', 
                background: getGroupColor(hoveredNode.group), 
                borderRadius: '4px',
                boxShadow: `0 0 6px ${getGroupColor(hoveredNode.group)}` 
              }}
            />
          </div>
        </div>
      )}

      {/* Basic responsive animations for CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
