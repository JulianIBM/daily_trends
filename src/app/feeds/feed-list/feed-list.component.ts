import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Feed } from '../feed.model';
import { FeedsService } from '../feeds.service';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css'],
})
export class FeedListComponent implements OnInit, OnDestroy {
  feeds: Feed[] = [];
  private feedsSub: Subscription;
  isLoading = false;

  constructor(public feedsService: FeedsService, private router: Router) {}

  ngOnInit() {
    if (this.router.url === '/update') {
      this.isLoading = true;
      this.feedsService.deleteScrapedFeeds().subscribe(() => {});

      this.feedsService.updateScrapedFeeds().subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/']);
      });
    } else {
      this.feedsService.getFeeds();
    }

    this.feedsSub = this.feedsService
      .getFeedsUpdateListener()
      .subscribe((feed: Feed[]) => {
        this.feeds = feed;
      });
  }

  onDelete(feedId: string) {
    this.feedsService.deleteFeed(feedId).subscribe(() => {
      this.feedsService.getFeeds();
    });
  }

  ngOnDestroy() {
    this.feedsSub.unsubscribe();
  }
}
