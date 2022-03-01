import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedListComponent } from './feeds/feed-list/feed-list.component';
import { FeedCreateComponent } from './feeds/feed-create/feed-create.component';

const routes: Routes = [
  { path: '', component: FeedListComponent },
  { path: 'create', component: FeedCreateComponent },
  { path: 'edit/:feedId', component: FeedCreateComponent },
  { path: 'update', component: FeedListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
