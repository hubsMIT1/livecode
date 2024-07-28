
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { verifyJwt } from './jwt'; // Assume you have this utility function
import { Room, AuthenticatedSocket, sendData, Schedule } from './interfaces'
import { message } from './dummydata'
import { getRoomById, updateRoom } from '../controllers/helperFuctions/endservices';

// const rooms = RoomData();
// ... (initialize other rooms)
const rooms: Map<string, Room> = new Map();

// rooms.set('room1', {
//     owner: 'shivay',
//     allowedUsers: new Set(['shivay']),
//     pendingUsers: new Set(['user3']),
//     sockets: new Map()
// });

export function setupSocketIO(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
    let currentSocket: null | Socket = null;
    io.use((socket: AuthenticatedSocket, next) => {
        const { token, roomId } = socket.handshake.auth;
        // console.log(token)
        const { payload, error } =   verifyJwt<{ user_id: string; username: string; role: string }>(token)  //{ payload: { username: token, user_id: token, role: token }, error: "" };
        //verifyJwt<{ user_id: string; username: string; role: string }>(token);
        // const 
        if (error === 'TokenExpiredError') {
            return next(new Error('Unauthorized: Token has expired'));
        }

        if (error === 'InvalidTokenError' || !payload) {
            return next(new Error('Unauthorized: Invalid token'));
        }
        else if (!roomId) {
            console.log("no room id")
            return next(new Error('Unauthorized: Invalid roomId'));
        }
        else {
            socket.user = payload;
            socket.user.roomId = roomId
        }
        next();
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        const username = socket.user?.username!;
        console.log('A user connected');
        let room_id = socket.user?.roomId;

        let room = rooms.get(room_id!)
        // if (room?.allowedUsers?.has(username)) {
        //     room.sockets.set(username, socket);
        //     socket.join(room_id!)
        // }
        console.log("roomid in socket", room_id)

        socket.on('join', async ({ roomId }) => {
            console.log(`User ${username} trying to join room: ${roomId}`);
            if (!rooms.has(roomId)) {
                console.log("getting room from db")
                try {
                    const scheduleData: Schedule | { error: string } | null = await getRoomById(roomId);
                    if (scheduleData && !('error' in scheduleData)) {
                        const scheduleTime = new Date(scheduleData.start_time);
                        const now = new Date();
                        // if(now < scheduleTime){
                        
                        // }    
                        console.log("allowedUsers",scheduleData.allowed_users)
                        console.log(scheduleData.owner?.username,"owner username")
                        rooms.set(roomId, {
                            owner: scheduleData?.owner?.username!,
                            allowedUsers: new Set(scheduleData.allowed_users),
                            pendingUsers: new Set([]),
                            sockets: new Map()
                        });
                    } else {
                        console.log("Room not found with this id:", roomId);
                        socket.emit('joinStatus', { status: 'error', message: 'Invalid room ID' });
                        return;
                    }
                } catch (error) {
                    console.error("Error fetching schedule:", error);
                    socket.emit('joinStatus', { status: 'error', message: 'Error fetching room data' });
                    return;
                }

            }
            //   rooms.set(roomId, {
            //     owner: username,
            //     allowedUsers: new Set([username]),
            //     pendingUsers: new Set(),
            //     sockets: new Map([[username, socket]])
            //   });
            //   socket.join(roomId);
            //   socket.emit('joinStatus', { status: 'joined', isOwner: true });
            // } else {
            room = rooms.get(roomId)!;
            // console.log("present user", room.allowedUsers)
            // console.log("owner:", room.owner, username)
            const data: sendData = { from: username, ownerId: room.owner, roomId: roomId, isOwner: username === room.owner, };
            if (room && (room?.allowedUsers?.has(username) || username === room.owner)) {
                room.sockets.set(username, socket);
                socket.join(roomId);
                data.message = "Searching for the peer, still didn't appear.\n Please wait...";
                data.status = "waiting";
                if (room.sockets.size == 1) {
                    socket.emit('joinStatus', data);
                }
                else {
                    if (room.sockets.size>1) {
                        // if (!targettedUser) {
                        //     socket.to(roomId).emit('joinStatus', { status: "error", message: "targetted user not found!", error: "Bad Request" });
                        // }
                        data.allowedUser = Array.from(room.allowedUsers);
                        data.status = "joined";
                        data.message = message.joined
                        io.to(roomId).emit('joinStatus', data);
                        // room.sockets.set(username, socket);
                    }
                    else if (room.pendingUsers.size > 0 && username === room.owner) {
                        // socket.emit('joinStatus', data);
                        // const pendingUser = room.pendingUsers.values().next().value;
                        // const pendingSocket = room.sockets.get(pendingUser);
                        // data.status = "ownerJoined";
                        // data.message = "Ask for join";
                        // data.isOwner = false;
                        // pendingSocket?.emit("joinStatus", data)
                        room.pendingUsers.forEach(user=>{
                            const pendingSocket = room?.sockets.get(user);
                            data.status = "ownerJoined";
                            data.message = "Ask for join";
                            data.isOwner = false;
                            pendingSocket?.emit("joinStatus", data)
                        })
                        // console.log("sending messages to waitting peer",pendingUser,pendingSocket)
                    }
                    else {
                        socket.emit('joinStatus', { status: 'error', message: 'Wait to start the meeting or Join later....' });
                    }
                }
                // socket.emit('joinStatus', { status: 'joined', type:'offer', isOwner: username === room.owner });
                console.log('user has been joined the room')
            } else if (room && username !== room.owner && room.sockets.get(room.owner)) { //send request to owner
                // room.pendingUsers.clear();
                // room.sockets.delete(username)
                room.pendingUsers.add(username);
                room.sockets.set(username, socket);
                // console.log(room.sockets.get(username),username)
                // socket.emit('joinRequest', { status: 'pending' });
                const ownerSocket = room.sockets.get(room.owner);
                console.log("sending joinRequest")
                if (ownerSocket) {
                    console.log("sent joinRequest")

                    ownerSocket.emit('joinRequest', { from: username, roomId: roomId });
                }
            } else {
                // room.pendingUsers.clear();
                // room.sockets.delete(username);
                console.log(room.sockets.get(room.owner),room.owner)
                room.pendingUsers.add(username);
                room.sockets.set(username, socket);
                // console.log(room.sockets,room.sockets.get(username))
                console.log("waiting for owner to join")
                socket.emit('joinStatus', { status: 'error', message: 'Wait for owner to start the meeting' });
            }
            // }
        });
        socket.on('allowUser', async ({ targettedUser: targettedUser, roomId: roomId }) => {
            const room = rooms.get(roomId);
            if (room && username === room.owner) {
                if (!targettedUser) {
                    socket.to(roomId).emit('joinStatus', { status: "error", message: "targetted user not found!", error: "Bad Request" });
                    return;
                }
                room.allowedUsers.clear();
                room.allowedUsers.add(username);
                room.allowedUsers.add(targettedUser);
                room.pendingUsers.delete(targettedUser);
                try {
                    const updatedSchedule = await updateRoom({id:roomId, allowedUser:targettedUser,owner:username});
                    if ('error' in updatedSchedule) {
                        console.error("Error updating schedule:", updatedSchedule.error);
                    }
                } catch (error) {
                    console.error("Error updating schedule:", error);
                }
                const userSocket = room.sockets.get(targettedUser);
                const data: sendData = { message: message.joined, status: "joined", from: username, ownerId: room.owner, isOwner: targettedUser === room.owner, roomId: roomId }
                // const targetUsername = Array.from(room.allowedUsers).find(id => id !== username);
                data.allowedUser = [username, targettedUser!];
                console.log("allowed", targettedUser)
                if (userSocket) {
                    console.log("allowed sent")

                    userSocket.join(roomId);
                    io.to(roomId).emit('joinStatus', data);
                    // socket.to(roomId).emit('userJoined', username)
                }
                else {
                    data.message = "Peer left the meeting. Please wait!"
                    console.log(data.message)
                    data.status = "error"
                    socket.to(roomId).emit('joinStatus', data);
                }
            }
        });

        socket.on('discussReq', ({ username, roomId, peerId }) => {
            const room = rooms.get(roomId);
            console.log("got discuss req in", peerId)
            if (room) {
                const peerSocket = room.sockets.get(peerId);
                if (peerSocket) {
                    const data: sendData = { message: "Condidate  is requested for discussion!", status: "discussReq", from: username, ownerId: room.owner, isOwner: username === room.owner }
                    peerSocket.emit('discussReq', data);
                    console.log("sent discuss req to peer")

                }
                else {
                    console.log("peer socket not found")
                }
            }
            else {
                console.log("room not found in disReq")
            }
        });
        socket.on('acceptedDisReq', ({ username, roomId }) => {
            const room = rooms.get(roomId);
            if (room) {
                // const peerSocket = room.sockets.get(peerId);
                // if (peerSocket) 

                const data: sendData = { message: "Discussion starting...", status: "acceptedDisReq",allowedUser:Array.from(room.allowedUsers), from: username, ownerId: room.owner, isOwner: username === room.owner }
                io.to(roomId).emit('acceptedDisReq', data);
                console.log("accepted the request dis")
                // }
            }
            else {
                console.log("not found room for accept req")
            }
        });
        socket.on('rejectedDisReq', ({ username, roomId, peerId }) => {
            const room = rooms.get(roomId);
            if (room) {
                const peerSocket = room.sockets.get(peerId);
                if (peerSocket) {
                    const data: sendData = { message: "Condidate requested to wait for sometime for discussion!", status: "rejectedDisReq", from: username, ownerId: room.owner, isOwner: username === room.owner }
                    peerSocket.emit('rejectedDisReq', data);
                }
            }
        });

        socket.on('rejectUser', ({ username, roomId }) => {
            const room = rooms.get(roomId);
            if (room && socket?.user?.username === room.owner) {
                room.pendingUsers.delete(username);
                const userSocket = room.sockets.get(username);
                if (userSocket) {
                    userSocket.emit('joinStatus', { status: 'rejected' });
                    room.sockets.delete(username);
                }
            }
        });
        socket.on('startContest', ({ roomId, targettedUser }) => {
            const room = rooms.get(roomId);
            if (room) {
                const senderId = socket.user?.username;
                if (senderId !== room.owner) {
                    socket.emit('joinStatus', { status: 'error', message: 'You do not have permission to start this contest!!', error: 'Unauthorized' });
                }
                currentSocket = room.sockets.get(senderId!)!
                if (!senderId) {
                    console.log('Sender ID not found');
                    return;
                }
                // Find the first user in allowedUsers who is not the sender
                // const targetUsername = Array.from(room.allowedUsers).find(id => id !== senderId);
                // console.log(`Received answer from ${socket.user?.username} for user ${targetUsername} in room ${data.roomId}`);
                if (targettedUser) {
                    const targetSocket = room.sockets.get(targettedUser!);
                    if (targetSocket) {
                        targetSocket.emit('startContest', { status: "start", message: "Requested to start the contest, please wait...", type: 'contest', fromusername: senderId });
                    } else if (currentSocket) {
                        console.log('Target user not found in the room');
                    }
                }
                else {
                    currentSocket.emit('NoUser', { data: "No one joined at" });
                    console.log('No other allowed users found in the room');
                }
            }
            else {
                console.log('Room not found');

            }

            // if (room && socket?.user?.username === room.owner) {
            //   room.pendingUsers.delete(username);
            //   const userSocket = room.sockets.get(username);
            //   if (userSocket) {
            //     userSocket.emit('joinStatus', { status: 'rejected' });
            //     room.sockets.delete(username);
            //   }
            // }

        });
        socket.on('code_change', ({ roomId, code, to }) => {
            if (to) {
                const targettedSocket = room?.sockets.get(to);
                console.log(to)
                if (targettedSocket) {
                    targettedSocket.emit('code_update', code, to);
                }
                else
                    socket.emit('joinStatus', { status: "error", message: "user left the meet" })
            }
            else {
                socket.emit('joinStatus', { status: "error", message: "peer details not found", error: "Bad Request" })

            }

        });

        // socket.on('offer', (offer: any) => {
        //   console.log('Received offer');

        //   //only to that id
        //   socket.broadcast.emit('offer', offer);
        // });

        socket.on('offer', (data: { offer: any, roomId: string, targettedUser: string }) => {
            const room = rooms.get(data.roomId);
            if (room) {
                const senderId = socket.user?.username;
                currentSocket = room?.sockets.get(username)!
                if (!senderId) {
                    console.log('Sender ID not found');
                    return;
                }
                // Find the first user in allowedUsers who is not the sender
                // const targetUsername = Array.from(room.allowedUsers).find(id => id !== senderId);
                console.log(data.targettedUser)
                if (data.targettedUser) {
                    console.log(`Received offer from ${senderId} for user ${data.targettedUser} in room ${data.roomId}`);

                    const targetSocket = room.sockets.get(data.targettedUser);
                    if (targetSocket) {
                        targetSocket.emit('offer', { offer: data.offer, type: 'answer', fromusername: senderId });
                    } else {
                        console.log('Target user socket not found in the room');
                    }
                } else if (currentSocket) {
                    currentSocket.emit('NoUser', { data: "No one joined at" });
                    console.log('No other allowed users found in the room');
                }
            } else {
                console.log('Room not found');
            }
        });
        socket.on('answer', (data: { answer: any, roomId: string, targettedUser: string }) => {
            const room = rooms.get(data.roomId);
            if (room) {
                const senderId = socket.user?.username;
                currentSocket = room.sockets.get(senderId!)!
                if (!senderId) {
                    console.log('Sender ID not found');
                    return;
                }
                // Find the first user in allowedUsers who is not the sender
                // const targetUsername = Array.from(room.allowedUsers).find(id => id !== senderId);
                console.log(`Received answer from ${socket.user?.username} for user ${data.targettedUser} in room ${data.roomId}`);
                if (data.targettedUser) {
                    const targetSocket = room.sockets.get(data.targettedUser!);
                    if (targetSocket) {
                        targetSocket.emit('answer', { answer: data.answer, type: 'candidate', fromusername: senderId });
                    } else if (currentSocket) {
                        console.log('Target user not found in the room');
                    }
                }
                else {
                    currentSocket.emit('NoUser', { data: "No one joined at" });
                    console.log('No other allowed users found in the room');
                }
            }
            else {
                console.log('Room not found');

            }
        });

        // socket.on('answer', (answer: any) => {
        //   console.log('Received answer');
        //   socket.broadcast.emit('answer', answer);
        // });

        socket.on('iceCandidate', (data: { candidate: any, roomId: string, targettedUser: string }) => {

            const room = rooms.get(data.roomId);
            if (room) {
                const senderId = username;
                currentSocket = room.sockets.get(senderId!)!
                if (!senderId) {
                    console.log('Sender ID not found');
                    return;
                }
                // const targetUsername = Array.from(room.allowedUsers).find(id => id !== senderId);
                if (data.targettedUser) {
                    console.log(`Received ICE candidate from ${username} for user ${data.targettedUser} in room ${data.roomId}`);
                    const targetSocket = room.sockets.get(data.targettedUser!);
                    if (targetSocket) {
                        targetSocket.emit('iceCandidate', { candidate: data.candidate, from: username });
                    } else {
                        console.log('Target user not found in the room');
                    }
                } else if (currentSocket) {
                    currentSocket.emit('NoUser', { data: "No one joined at" });
                    console.log('No other allowed users found in the room');
                }
            } else {
                console.log('Room not found');
            }
        });
        // socket.on('iceCandidate', (candidate: any) => {
        //   console.log('Received ICE candidate');
        //   socket.broadcast.emit('iceCandidate', candidate);
        // });
        socket.on('endSession',(username,roomId)=>{
            if(roomId){
                rooms.delete(roomId);
                io.to(roomId).emit('endSession', {message:`${username} has been end the session!` });
            }  
        })
        socket.on('disconnect', ({ }) => {
            console.log('A user disconnected');
            const username = socket?.user?.username!;
            const roomId = socket.user?.roomId;
            if (roomId) {
                const room = rooms.get(roomId);
                if (room && room.sockets.has(username)) {
                    const targetUsername = Array.from(room.allowedUsers).find(id => id !== username);
                    if (targetUsername) {
                        const targetSocket = room.sockets.get(targetUsername!);
                        if (targetSocket) {
                            targetSocket.emit('userLeft', { from: username, roomId: roomId, to: targetUsername });
                            room.sockets.delete(username);
                            // room.allowedUsers.delete(username);
                            room.pendingUsers.delete(username);
                            // if (room.sockets.size === 0) {
                            //   rooms.delete(roomId);
                            // } else
                            //  if (username === room.owner) {
                            //   // Assign a new owner if the current owner leaves
                            //   const newOwner = room.sockets.keys().next().value;
                            //   room.owner = newOwner;
                            //   const newOwnerSocket = room.sockets.get(newOwner);
                            //   if (newOwnerSocket) {
                            //     newOwnerSocket.emit('ownershipTransferred');
                            //   }
                            // }
                        }
                    }
                }
            }
        });
    });
}