class TrackUtils {
  static convertTracksToUris(savedTracksObject: SpotifyApi.SavedTrackObject[]) {
    return savedTracksObject.map((track) => track.track.uri);
  }
}

export default TrackUtils;
