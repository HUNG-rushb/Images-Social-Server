import { Prisma } from '@prisma/client';

const userMutation = {
  createUser: async (parent, args, { prisma }, info) => {
    let user;
    try {
      user = await prisma.user.create({
        data: {
          ...args.data,
          profileImageURL:
            'https://bku-profile-pic.s3.ap-southeast-1.amazonaws.com/images.jpg',
          birthday: '2000-01-01',
          phoneNumber: '',
          age: new Date().getFullYear() - 2000,
          level: {
            create: {
              currentXP: 0,
              currentLevel: 1,
            },
          },
          // posts: {
          //   create: [],
          // },
        },
        // include: {
        //   posts: true, // Include all posts in the returned object
        // },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }

      throw e;
    }

    return user;
  },
};

export default userMutation;
