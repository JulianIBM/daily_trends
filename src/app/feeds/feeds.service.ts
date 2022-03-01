import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Feed } from './feed.model';



const BACKEND_URL = environment.apiUrl + '/feeds/';
const SCRAP_URL = environment.apiUrl + '/scrap/';


@Injectable({ providedIn: 'root' })
export class FeedsService {
  private feeds: Feed[] = [];
  private feedsUpdated = new Subject<Feed[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getFeeds() {
    this.http
      .get<{ message: string; feeds: any }>(BACKEND_URL)
      .pipe(
        map((feedData) => {
          return {
            feeds: feedData.feeds.map((feed) => {
              return {
                title: feed.title,
                body: feed.body,
                id: feed._id,
                imagePath: feed.imagePath,
                source: feed.source,
                publisher: feed.publisher,
              };
            }),
          };
        })
      )
      .subscribe((transformedfeedData) => {
        this.feeds = transformedfeedData.feeds;
        this.feedsUpdated.next([...this.feeds]);
      });
  }

  getFeedsUpdateListener() {
    return this.feedsUpdated.asObservable();
  }

  getFeed(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      body: string;
      imagePath: string;
      source: string;
      publisher: string;
    }>(BACKEND_URL + id);
  }

  addFeed(
    title: string,
    body: string,
    image: File,
    source: string,
    publisher: string
  ) {
    const feedData = new FormData();
    feedData.append('title', title);
    feedData.append('body', body);
    feedData.append('image', image, title);
    feedData.append('source', source);
    feedData.append('publisher', publisher);
    this.http
      .post<{ message: string; feed: Feed }>(BACKEND_URL, feedData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
    console.log('Pasa el servicio');
  }

  updateFeed(
    id: string,
    title: string,
    body: string,
    image: File | string,
    source: string,
    publisher: string
  ) {
    let feedData: Feed | FormData;
    if (typeof image === 'object') {
      feedData = new FormData();
      feedData.append('id', id);
      feedData.append('title', title);
      feedData.append('body', body);
      feedData.append('image', image, title);
      feedData.append('source', source);
      feedData.append('publisher', publisher);
    } else {
      feedData = {
        id: id,
        title: title,
        body: body,
        imagePath: image,
        source: source,
        publisher: publisher,
      };
    }
    this.http.put(BACKEND_URL + id, feedData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deleteFeed(feedId: string) {
    return this.http.delete(BACKEND_URL + feedId);
  }

  updateScrapedFeeds() {
    return this.http
    .get<{ message: string }>(SCRAP_URL);

  }

  deleteScrapedFeeds() {
    return this.http.delete(BACKEND_URL);
  }
}
