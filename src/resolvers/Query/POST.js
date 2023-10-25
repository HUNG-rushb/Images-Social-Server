import _ from 'lodash';
import Jimp from 'jimp';

const postQuery = {
  allPosts: async (parent, args, { prisma }, info) => {
    return await prisma.post.findMany();
  },
  postInfo: async (parent, args, { prisma }, info) => {
    return await prisma.post.findUnique({
      where: {
        id: args.data.postId,
      },
    });
  },
  getNewFeed: async (parent, args, { prisma }, info) => {
    let nodes;
    const after = args.after;
    // console.log({ after });

    let a = await prisma.post.findMany({
      where: {
        userId: args.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!after) {
      nodes = a.slice(0, 2).map((post) => ({
        node: post,
        cursor: post.id,
      }));

      console.log({ nodes });
    } else {
      console.log('in after');
      const index = a.findIndex((post) => post.id === after);
      nodes = a.slice(index + 1, index + 3).map((post) => ({
        node: post,
        cursor: post.id,
      }));

      console.log({ nodes });
    }

    const hasNextPage =
      nodes.length === 0
        ? false
        : nodes.slice(-1)[0].cursor !== a.slice(-1)[0].id;
    // console.log(nodes.slice(-1));
    console.log({ hasNextPage });

    return {
      edges: nodes,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: after ? true : false,
        // startCursor,
        startCursor: nodes.length === 0 ? '' : nodes[0].cursor,
        endCursor: nodes.length === 0 ? '' : nodes.slice(-1)[0].cursor,
      },
    };
  },
  searchQuery: async (parent, args, { prisma }, info) => {
    let tags = [],
      users = [];

    users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: args.data.searchString,
            },
          },
          {
            name: {
              contains: args.data.searchString,
            },
          },
        ],
        AND: [
          {
            isAdmin: 0,
          },
        ],
      },
      orderBy: [
        {
          name: 'asc',
        },
      ],
    });

    tags = await prisma.tag.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: args.data.searchString,
            },
          },
          {
            name: {
              contains: args.data.searchString,
            },
          },
        ],
      },
    });

    return { tags, users };
  },
  similarImages: async (parent, args, { prisma }, info) => {
    let result = [];

    // const currentImage = await prisma.post.findUnique({
    //   where: {
    //     id: args.data.postId,
    //   },
    // });

    const currentImage = await prisma.image.findUnique({
      where: {
        postId: args.data.postId,
      },
    });

    let allImages = await prisma.image.findMany();

    allImages = _.filter(allImages, (o) => o.id != currentImage.id);

    allImages.map(async (img) => {
      if (compareImages(currentImage.url, img.url)) {
        result.push(img);
      }
    });

    console.log(result);
    return result;
  },
};

export default postQuery;

async function compareImages(image1Url, image2Url) {
  const image1 = await Jimp.read(image1Url);
  const image2 = await Jimp.read(image2Url);
  // Perceived distance
  const distance = Jimp.distance(image1, image2);
  // Pixel difference
  const diff = Jimp.diff(image1, image2);

  // console.log(
  //   `compareImages: distance: ${distance.toFixed(
  //     3,
  //   )}, diff.percent: ${diff.percent.toFixed(3)}`,
  // );

  if (distance < 0.15 || diff.percent < 0.15) {
    console.log('compareImages: Images match!');
    return true;
  } else {
    console.log('compareImages: Images do NOT match!');
    return false;
  }
}
