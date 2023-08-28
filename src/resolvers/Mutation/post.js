import { Prisma } from '@prisma/client';

const postMutation = {
  createPost: async (parent, args, { prisma }, info) => {
    let post;
    try {
      post = await prisma.post.create({
        data: {
          title: args.data.title,
          userId: args.data.userId,
          points: 0,

          categoryId: args.data.categoryId ? args.data.categoryId : [],
          albumId: args.data.albumId ? args.data.albumId : [],
          tagId: args.data.tagId ? args.data.tagId : [],

          image: {
            create: {
              url: args.data.imageURL,
              hash: args.data.imageHash,

              imageInfoId: {
                create: {
                  camera: args.data.camera,
                  lens: args.data.lens,
                  aperture: args.data.aperture,
                  focalLength: args.data.focalLength,
                  shutterSpeed: args.data.shutterSpeed,
                  ISO: args.data.ISO,
                  takenWhen: args.data.takenWhen,
                  copyRight: args.data.copyRight,
                },
              },
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
      throw e;
    }

    return post;
  },
  deletePost: async (parent, args, { prisma }, info) => {
    let post;
    try {
      post = await prisma.post.delete({
        where: {
          id: args.data.postId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
      throw e;
    }

    return post;
  },
  deleteAllPost: async (parent, args, { prisma }, info) => {
    let result;
    try {
      result = await prisma.post.deleteMany({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
      throw e;
    }

    return result;
  },
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  updatePost: async (parent, args, { prisma }, info) => {
    const { updatedUser, ...updateInfo } = args.data;
    let result;
    try {
      updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateInfo,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }

      throw e;
    }

    return updatedUser;
  },
  interactPost: async (parent, args, { prisma }, info) => {
    let post;
    try {
      post = await prisma.post.update({
        where: {
          id: args.data.postId,
        },
        data: {
          points: {
            increment: args.data.qisLike ? 1 : -1,
          },
        },
      });

      if (post.points == -1) {
        post = await prisma.post.update({
          where: {
            id: args.data.postId,
          },
          data: {
            points: 0,
          },
        });
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
      throw e;
    }

    return post;
  },
};

export default postMutation;
