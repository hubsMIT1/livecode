import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  color: string;
}

interface CursorPosition {
  userId: string;
  position: number;
}

const Editor: React.FC = () => {
  const { roomId,username } = useParams<{ roomId: string,username:string}>();
  const location = useLocation();
  const navigate = useNavigate();
//   const userName = (location.state as any)?.userName;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.emit('join-room', roomId, username);

    newSocket.on('room-joined', (room) => {
      setContent(room.content);
      setUsers(room.users);
    });

    newSocket.on('user-joined', (user: User) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    newSocket.on('user-left', (userId: string) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setCursors((prevCursors) => prevCursors.filter((cursor) => cursor.userId !== userId));
    });

    newSocket.on('content-updated', (newContent: string) => {
      setContent(newContent);
    });

    newSocket.on('cursor-moved', ({ userId, position }: CursorPosition) => {
      setCursors((prevCursors) => {
        const existingCursor = prevCursors.find((cursor) => cursor.userId === userId);
        
        if (existingCursor) {
          return prevCursors.map((cursor) =>
            cursor.userId === userId ? { ...cursor, position } : cursor
          );
        } else {
          return [...prevCursors, { userId, position }];
        }
      });
    });

    newSocket.on('room-full', () => {
      alert('The room is full. Please try another room.');
      navigate('/');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, username, navigate]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket?.emit('content-change', newContent);
  };

  const handleCursorMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      console.log(cursorPosition)
      socket?.emit('cursor-move', cursorPosition);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="bg-gray-800 rounded shadow-md p-4 mb-4">
        <h1 className="text-2xl font-bold mb-2">Room: {roomId}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {users.map((user) => (
            <span
              key={user.id}
              className="px-2 py-1 rounded text-white text-sm"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </span>
          ))}
        </div>
      </div>
      <div className="relative bg-gray-800 rounded shadow-md p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onMouseUp={handleCursorMove}
          className="w-full h-64 p-2 bg-gray-800 border rounded resize-none"
        />
        {cursors.map((cursor) => {
          const user = users.find((u) => u.id === cursor.userId);
          if (!user) return null;
          console.log(cursor)
          return (
            <div
              key={cursor.userId}
              
              className="absolute w-0.5 h-5"
              style={{
                left: `${(cursor.position / content.length) * 100}%`,
                backgroundColor: user.color,
                top: '7px',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Editor;