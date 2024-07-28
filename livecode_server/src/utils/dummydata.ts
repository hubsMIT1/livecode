
import { Room } from "./interfaces";

export const RoomData = () => {
    const rooms: Map<string, Room> = new Map();

    rooms.set('room1', {
        owner: 'shivay',
        allowedUsers: new Set(['shivay']),
        pendingUsers: new Set(['user3']),
        sockets: new Map()
    });

    rooms.set('room2', {
        owner: 'user4',
        allowedUsers: new Set(['user4', 'user5', 'user6']),
        pendingUsers: new Set(),
        sockets: new Map()
    });

    rooms.set('room3', {
        owner: 'user7',
        allowedUsers: new Set(['user7']),
        pendingUsers: new Set(['user8', 'user9']),
        sockets: new Map()
    });

    rooms.set('room4', {
        owner: 'user10',
        allowedUsers: new Set(['user10', 'user11', 'user12', 'user13']),
        pendingUsers: new Set(['user14']),
        sockets: new Map()
    });

    return rooms;

}


export const message = {
    joined:"Peer joined the contest.\n You are ready to discuss. \n Press Start To Enter in Contest."
 }