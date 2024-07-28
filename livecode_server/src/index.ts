// import express, { Request, Response } from 'express';
import { prisma, connectDB } from './utils/dbsetup';
import { Prisma } from '@prisma/client';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import tsq_server from './routes/topic_sheet_ques.routes'
import endUserServer from './routes/enduserservice.routes'
import express, { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import cors from 'cors'
import http from 'http';
import { Server, Socket } from 'socket.io';
import { setupSocketIO } from './utils/socket';
import morgan from 'morgan';
import { createUser, loginUser, refreshToken } from './controllers/user.controllers';

const corsOptions = {
  origin: ["http://localhost:5173", "https://localhost:5173", "https://192.168.204.138:5173", "http://192.168.100.100:5173", "https://4f9e-152-58-155-49.ngrok-free.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

const app = express();
app.use(cors(corsOptions))

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin!)) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
  }
  next();
});
// app.options('*', cors());
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(express.json());
app.use(cookieParser());

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

export const dbErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P1001') {
      console.error('Database connection error:', err);
      return res.status(503).json({
        status: 'error',
        message: 'Database is currently unavailable. Please try again later.',
      });
    }
  }
  next(err);
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input',
      errors: err.errors,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});
app.use(dbErrorHandler);


app.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log("connection is healthy");
  res.send("Hello you are connect to node js server");
})

// app.post('/api/users/refresh_token',cors({
//   origin: 'http://localhost:5173',
//   credentials: true}),
//    refreshToken);

// app.post('/api/users/login',cors({
//   origin: 'http://localhost:5173',
//   credentials: true}),
//   loginUser
// )
// app.post('/api/users/signup',cors({
//   origin: 'http://localhost:5173',
//   credentials: true}),
//   createUser
// )
app.use('/api/users', userRoutes);
app.use('/api/service', tsq_server);
app.use('/api/end-user-service', endUserServer);

//websocket connections
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://localhost:5173", "https://192.168.204.138:5173", "http://192.168.100.100:5173", "https://4f9e-152-58-155-49.ngrok-free.app", "*"],
    methods: ['*'],
    credentials:true,
  },
});

setupSocketIO(io);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(3001, () => {
      console.log('Server is running on port http://localhost:3001');
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();

// server.listen(3001, () => {
//   console.log('server is running on port http://localhost:3001');
// });



// io.on('connection', (socket: Socket) => {
//   console.log('A user connected');

//   socket.on('join', (roomId: string) => {
//     console.log(`User joined room: ${roomId}`);

//     if (!rooms[roomId]) {
//       rooms[roomId] = [];
//     }
//     rooms[roomId].push(socket);

//     socket.join(roomId);
//     socket.to(roomId).emit('userJoined', socket.id);
//   });

//   socket.on('offer', (offer: any) => {
//     console.log('Received offer');
//     socket.broadcast.emit('offer', offer);
//   });

//   socket.on('answer', (answer: any) => {
//     console.log('Received answer');
//     socket.broadcast.emit('answer', answer);
//   });

//   socket.on('iceCandidate', (candidate: any) => {
//     console.log('Received ICE candidate');
//     socket.broadcast.emit('iceCandidate', candidate);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');

//     // Remove the user from the room
//     for (const roomId in rooms) {
//       const room = rooms[roomId];
//       const index = room.indexOf(socket);
//       if (index !== -1) {
//         room.splice(index, 1);
//         if (room.length === 0) {
//           delete rooms[roomId];
//         }
//         break;
//       }
//     }

//     socket.broadcast.emit('userLeft', socket.id);
//   });
// });
