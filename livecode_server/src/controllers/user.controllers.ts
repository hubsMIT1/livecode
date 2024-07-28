import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/dbsetup';
import { CreateUserInput, LoginUserInput, UpdateUserInput } from '../schemas/user.schema';
import { signJwt, verifyJwt } from '../utils/jwt';
import { deleteEntity} from '../utils/helper';

const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 30
  });
};

const findUserByCredential = async (credential: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: credential }, { username: credential }],
    },
  });
};

export const createUser = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
  const { email, password, fullName, username } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ email: 'Email already exists' });
  }
  const existingUsername = await prisma.user.findUnique({ where: { username } });

  if (existingUsername) {
    return res.status(409).json({ username: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, fullName, username },
  });
  const payload = {
   user_id :user.user_id,
   role: user.role,
   username: user.username
  }
  const  accessToken  = signJwt(payload,'1h');
  const  refreshToken  = signJwt(payload,'30d');

  setRefreshTokenCookie(res, refreshToken);

  return res.json({ access_token: accessToken,refresh_token: refreshToken ,user:payload, success:true});
};

export const loginUser = async (req: Request<{}, {}, LoginUserInput>, res: Response) => {
  const { credential, password } = req.body;

  const user = await findUserByCredential(credential);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    user_id :user.user_id,
    role: user.role,
    username: user.username
   }
   const  accessToken  = signJwt(payload,'1h');
   const  refreshToken  = signJwt(payload,'30d');
   setRefreshTokenCookie(res, refreshToken);
  //  console.log(res.cookie)

   return res.json({ access_token: accessToken,refresh_token: refreshToken,user:payload,success:true });
};

export const refreshToken = async (req: any, res: Response) => {
  // const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  
  // console.warn(req,'\n\n', req.cookies,refreshToken);
  // if (!refreshToken) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  // const payload = verifyJwt<{ userId: string, username: string, role: string }>(refreshToken);
  // if (!payload) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
    // console.log("refhre called")
    const payload = {user_id: req.payload.user_id, role:req.payload.role, username:req.payload.username,};
    const  accessToken  = signJwt(payload,'1h');
    return res.json({success:true,access_token: accessToken });
};

export const profileData = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error("get user data: ", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: any, res: Response) => {
  const { userId } = req.params;
  const { fullName, username, socialLinks, about, profileImage } = req.body;

  const user = await prisma.user.findUnique({ where: { user_id: userId } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (username && username !== user.username) {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
  }

  // const updatedUser = await prisma.user.update({
  //   where: { user_id: userId },
  //   data: {
  //     fullName: fullName || user.fullName,
  //     username: username || user.username,
  //     socialLinks: socialLinks || user.socialLinks,
  //     about: about || user.about,
  //     profileImage: profileImage || user.profileImage,
  //   },
  // });

  // return res.json(updatedUser);
  // await updateEntity(req,res,"user")
};

export const deleteUser = async (req: Request, res: Response) => await deleteEntity(req, res, 'user');





// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import { prisma } from '../index';
// import { CreateUserInput, LoginUserInput, UpdateUserInput } from '../schemas/user.schema';
// import { signJwt, verifyJwt } from '../utils/jwt';

// const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

// export const createUser = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
//   const { email, password, fullName, username } = req.body;

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     return res.status(409).json({ message: 'Email already exists' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await prisma.user.create({
//     data: { email, password: hashedPassword, fullName, username },
//   });

//   const accessToken = signJwt({ userId: user.user_id }, '15m');
//   const refreshToken = signJwt({ userId: user.user_id }, '30d');

//   res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
//     httpOnly: true,
//     sameSite: 'strict',
//     path: '/refresh_token',
//   });

//   return res.json({ accessToken });
// };

// export const loginUser = async (req: Request<{}, {}, LoginUserInput>, res: Response) => {
//   const { credential, password } = req.body;

//   const user = await prisma.user.findFirst({
//     where: {
//       OR: [{ email: credential }, { username: credential }],
//     },
//   });

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }
//   req.payload = {"user":user.user_id}
  
//   const accessToken = signJwt({ userId: user.user_id }, '15m');
//   const refreshToken = signJwt({ userId: user.user_id }, '30d');

//   res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
//     httpOnly: true,
//     sameSite: 'strict',
//     path: '/refresh_token',
//   });

//   return res.json({ accessToken });
// };

// export const refreshToken = async (req: Request, res: Response) => {
//   const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
//   console.log(req?.cookie)

//   if (!refreshToken) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const payload = verifyJwt<{ userId: string }>(refreshToken);

//   if (!payload) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const user = await prisma.user.findUnique({ where: { user_id: payload.userId } });

//   if (!user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const accessToken = signJwt({ userId: user.user_id }, '1h');
//   const newRefreshToken = signJwt({ userId: user.user_id }, '30d');

//   res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
//     httpOnly: true,
//     sameSite: 'strict',
//     path: '/refresh_token',
//   });

//   return res.json({ accessToken });
// };

// export const profileData = async (req: Request, res: Response) => {
//   try {
//     const { username } = req.params;
//     const user = await prisma.user.findUnique({ where: { username: username } });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     return res.json(user);
//   } catch (error) {
//     console.log("get user data: ", error);
//     return null;
//   }
// }

// export const updateUser = async (req: Request<{ userId: string }, {}, UpdateUserInput>, res: Response) => {
//   const { userId } = req.params;
//   const { fullName, username, socialLinks, about, profileImage } = req.body;

//   const user = await prisma.user.findUnique({ where: { user_id: userId } });

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   if (username && username !== user.username) {
//     const existingUser = await prisma.user.findUnique({ where: { username } });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Username already exists' });
//     }
//   }

//   const updatedUser = await prisma.user.update({
//     where: { user_id: userId },
//     data: {
//       fullName: fullName || user.fullName,
//       username: username || user.username,
//       socialLinks: socialLinks || user.socialLinks,
//       about: about || user.about,
//       profileImage: profileImage || user.profileImage,
//     },
//   });

//   return res.json(updatedUser);
// };