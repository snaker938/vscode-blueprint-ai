import React, { useEffect } from 'react';
import { useNode } from '@craftjs/core';
import './RenderNode.css';

interface RenderNodeProps {
  render: React.ReactNode;
}

// RenderNode.tsx
export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  const { isHovered, isSelected, dom } = useNode((node) => ({
    isHovered: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
  }));

  useEffect(() => {
    if (!dom) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected]);

  useEffect(() => {
    if (!dom) return;
    if (isHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, isHovered]);

  return <>{render}</>; // no extra div wrapping
};
