import { Injectable } from '@nestjs/common';
import ArtistSummary from '../../models/artistSummary';
import ArtistsSummarySortType from '../../models/artistsSummarySortType';
import { SpotifyService } from '../spotify/spotify.service';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TrackService {
  constructor(
    private readonly spotifyService: SpotifyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
    totalUserTracks: SpotifyApi.SavedTrackObject[],
  ): Array<ArtistSummary> {
    const artistSummaryMap = totalUserTracks.reduce<
      Record<string, ArtistSummary>
    >((acc, track) => {
      const mainArtist = track.track.artists[0];

      if (!acc[mainArtist.id]) {
        acc[mainArtist.id] = {
          name: mainArtist.name,
          id: mainArtist.id,
          count: 1,
        };
      } else {
        acc[mainArtist.id].count++;
      }

      return acc;
    }, {});

    return Object.values(artistSummaryMap);
  }

  /**
   * reordering objects array:
   * - from most counted to least counted (default)
   * - from least counted to most counted
   * - alphabetical order by artist name
   * - reverse alphabetical order by artist name
   * @param artistsSummary
   * @param sortType
   */
  orderArtistsSummary(
    artistsSummary: ArtistSummary[],
    sortType: ArtistsSummarySortType = ArtistsSummarySortType.MostToLeastCounted,
  ): ArtistSummary[] {
    switch (sortType) {
      case ArtistsSummarySortType.LeastToMostCounted:
        return artistsSummary.sort((a, b) => a.count - b.count);
      case ArtistsSummarySortType.Alphabetical:
        return artistsSummary.sort((a, b) => a.name.localeCompare(b.name));
      case ArtistsSummarySortType.ReverseAlphabetical:
        return artistsSummary.sort((a, b) => b.name.localeCompare(a.name));
      case ArtistsSummarySortType.MostToLeastCounted:
      default:
        return artistsSummary.sort((a, b) => b.count - a.count);
    }
  }
}
