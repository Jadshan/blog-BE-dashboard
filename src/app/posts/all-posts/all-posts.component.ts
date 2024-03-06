import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
})
export class AllPostsComponent implements OnInit {
  postDataArray: any[] = [];
  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe((val) => {
      this.postDataArray = val;
      // console.log(this.postDataArray);
    });
  }
  onDelete(id: any, postImgPath: any) {
    this.postService.deletePost(id, postImgPath);
  }

  onFeatured(id: any, value: boolean) {
    const featuredData = {
      isFeatured: value,
    };
    this.postService.markFFeatured(id, featuredData);
  }
}
