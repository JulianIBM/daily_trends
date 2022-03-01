import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { FeedListComponent } from '../feeds/feed-list/feed-list.component';
import { FeedCreateComponent } from '../feeds/feed-create/feed-create.component';

@NgModule({
  declarations: [FeedCreateComponent, FeedListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
  ],
})
export class FeedsModule {}
