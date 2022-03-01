import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Feed } from '../feed.model';
import { FeedsService } from '../feeds.service';

@Component({
  selector: 'app-feed-create',
  templateUrl: './feed-create.component.html',
  styleUrls: ['./feed-create.component.css'],
})
export class FeedCreateComponent {
  enteredTitle = '';
  enteredBody = '';
  enteredSource = '';
  enteredPublisher = '';
  feed: Feed;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private feedId: string;

  constructor(
    public feedsService: FeedsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      body: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
      source: new FormControl(null, { validators: [Validators.required] }),
      publisher: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('feedId')) {
        this.mode = 'edit';
        this.feedId = paramMap.get('feedId');
        this.feedsService.getFeed(this.feedId).subscribe((feedData) => {
          this.feed = {
            id: feedData._id,
            title: feedData.title,
            body: feedData.body,
            imagePath: feedData.imagePath,
            source: feedData.source,
            publisher: feedData.publisher,
          };
          this.form.setValue({
            title: this.feed.title,
            body: this.feed.body,
            image: this.feed.imagePath,
            source: this.feed.source,
            publisher: this.feed.publisher,
          });
        });
      } else {
        this.mode = 'create';
        this.feedId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveFeed() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      console.log('Pasa el componente');
      this.feedsService.addFeed(
        this.form.value.title,
        this.form.value.body,
        this.form.value.image,
        this.form.value.source,
        this.form.value.publisher
      );
    } else {
      this.feedsService.updateFeed(
        this.feedId,
        this.form.value.title,
        this.form.value.body,
        this.form.value.image,
        this.form.value.source,
        this.form.value.publisher
      );
    }
    this.form.reset();
  }
}
