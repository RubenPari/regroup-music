import { Injectable } from '@nestjs/common';
import { SpotifyService } from '../spotify/spotify.service';
import Constants from '../../constants/constants';
import { TrackService } from '../track/track.service';
import ArtistSummary from '../../models/artistSummary';
import TrackUtils from '../../utils/trackUtils';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly trackService: TrackService,
  ) {}

  async createPlaylistTracksMinor(
    tracks: SpotifyApi.SavedTrackObject[],
  ): Promise<boolean> {
    const currentUser = await this.spotifyService.getClient().getMe();

    const userId = currentUser.body.id;

    const playlistsUser = await this.spotifyService
      .getClient()
      .getUserPlaylists(userId);

    const playlist = playlistsUser.body.items.find(
      (p: SpotifyApi.PlaylistObjectSimplified) =>
        p.name === Constants.PLAYLIST_NAME_WITH_MINOR_SONGS,
    );

    let idPlaylistMinorSongs = playlist?.id;

    if (!idPlaylistMinorSongs) {
      const playlistMinorSongs = await this.spotifyService
        .getClient()
        .createPlaylist(Constants.PLAYLIST_NAME_WITH_MINOR_SONGS, {
          public: false,
        });

      idPlaylistMinorSongs = playlistMinorSongs.body.id;
    }

    const artistsSummary = await this.trackService.getArtistsSummaryBySort();

    const tracksToKeep = artistsSummary
      .filter(
        (artistSummary: ArtistSummary) =>
          artistSummary.count <= Constants.MAX_COUNT_MINOR_SONGS,
      )
      .flatMap((artistSummary: ArtistSummary) =>
        tracks.filter(
          (track) => track.track.artists[0].id === artistSummary.id,
        ),
      );

    const tracksUris = TrackUtils.convertTracksToUris(tracksToKeep);

    let offset = Constants.OFFSET;

    // TODO: complete
    for (let i = 0; i < tracksUris.length; i++) {
      // Seleziona il sottoinsieme di URI da aggiungere
      const tracksToAdd = tracksUris.slice(
        offset,
        offset + Constants.LIMIT_INSERT_PLAYLIST_TRACKS,
      );

      // Aggiunge i brani alla playlist
      const added = await this.spotifyService
        .getClient()
        .addTracksToPlaylist(idPlaylistMinorSongs, tracksToAdd, {
          position: i + 1,
        });

      // Se non viene restituito uno snapshotId valido, esce con errore
      if (added.snapshotId === '') {
        return false;
      }

      // Se non ci sono altri brani da aggiungere, esce dal ciclo
      if (tracksToAdd.length < limit) {
        break;
      }

      offset += limit;
    }

    return true;
  }
}
