import { Injectable } from '@nestjs/common';
import ArtistSummary from '../../models/artistSummary';
import ArtistsSummarySortType from '../../models/artistsSummarySortType';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable()
export class TrackService {
  constructor(private readonly spotifyService: SpotifyService) { }

  async getAllUserTracks(): Promise<Array<SpotifyApi.SavedTrackObject>> {
    const limit = 50;
    let offset = 0;
    let totalUserTracks: Array<SpotifyApi.SavedTrackObject> = [];

    for (let i = 0; i < limit; i++) {
      const tracksPage = await this.spotifyService
        .getClient()
        .getMySavedTracks({
          limit,
          offset,
        });

      if (tracksPage.body.items.length === 0) {
        break;
      }

      totalUserTracks = totalUserTracks.concat(tracksPage.body.items);

      offset += limit;
    }

    return totalUserTracks;
  }

  /**
   * create an array of objects where each object has:
   * - artist name
   * - artist id
   * - track number
   * @param totalUserTracks
   */
  getArtistsSummary(
    totalUserTracks: Array<SpotifyApi.SavedTrackObject>,
  ): ArtistSummary[] {
    return totalUserTracks.reduce<ArtistSummary[]>((acc, track) => {
      const mainArtist = track.track.artists[0];

      if (!acc[mainArtist.id]) {
        acc[mainArtist.id] = {
          name: mainArtist.name,
          id: mainArtist.id,
          count: 1,
        };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        acc[mainArtist.id].count++;
      }

      return acc;
    }, {} as ArtistSummary[]);
  }
}
