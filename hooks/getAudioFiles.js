import * as MediaLibrary from "expo-media-library";
export const getAudioFiles = async () => {
  let allAssets = [];
  let after = null;
  let hasNextPage = true;

  // Fetch all pages
  while (hasNextPage) {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 100, // max per page
      after,
    });

    allAssets = allAssets.concat(media.assets);
    after = media.endCursor;
    hasNextPage = media.hasNextPage;
  }

  // Sort by modification time (newest first)
  allAssets.sort((a, b) => b.modificationTime - a.modificationTime);
  return allAssets;
};
