import React, { useState, useRef, useEffect } from 'react';
import AvatarVideo from './VideoAvatarView';

interface DraggableAvatarProps {
    stream: MediaStream | null;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    isLocal: boolean;
    initialPosition?: number | 0;
    remoteStatus?:boolean
}
  
  const DraggableAvatar: React.FC<DraggableAvatarProps> = (props) => {
    const [isDragging, setIsDragging] = useState(false);
    // const xpos = (Math.random() + 1)*100 ;
    const [position, setPosition] = useState({ x:props.initialPosition || 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        setPosition(prev => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      };
  
      const handleMouseUp = () => {
        setIsDragging(false);
      };
  
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging]);
  
    const handleMouseDown = () => {
      setIsDragging(true);
    };
  
    return (
      <div
        ref={containerRef}
        className="absolute cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <AvatarVideo {...props} />
      </div>
    );
  };

  export default DraggableAvatar;