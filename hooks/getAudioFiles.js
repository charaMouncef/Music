const getAudioFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 1,
    });

    console.log(media.assets);
  };