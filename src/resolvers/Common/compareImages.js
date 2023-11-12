import * as Jimp from 'jimp';

export async function compareImages(image1Url, image2Url) {
  const image1 = await Jimp.default.read(image1Url);
  const image2 = await Jimp.default.read(image2Url);
  // Perceived distance
  const distance = Jimp.default.distance(image1, image2);
  // Pixel difference
  const diff = Jimp.default.diff(image1, image2);

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
