import { Socket } from "socket.io";

export interface Room {
    owner: string;
    allowedUsers: Set<string>;
    pendingUsers: Set<string>;
    sockets: Map<string, Socket>;
}
export interface AuthenticatedSocket extends Socket {
    user?: { username: string; user_id:string; role:string, roomId?:string };
}
export interface User {
  user_id: string;
  username: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export interface Schedule {
  schedule_id: string;
  level: string;
  join_link?: string | null;
  start_time: Date;
  created_at: Date;
  owner_id: string;
  allowed_users: string[];
  status?: string | null;
  end_time?: Date | null;
  question_slug?: string | null;
  owner?: User;
  topic?: string[];
  // feedback?: Feedback[];
}

export interface sendData {
    status?: string;
    type?: string;
    isOwner: boolean;
    from: string;
    message?: string; // Make it optional with '?'
    allowedUser?:string[];
    roomId?:string;
    ownerId?:string;
  }

  interface AuthenticatedRequest extends Request {
    payload?: { userId: string, username: string, role: string };
  }