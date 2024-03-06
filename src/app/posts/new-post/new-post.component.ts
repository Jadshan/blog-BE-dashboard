import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  ImageSrc: string = this.imgSrc;
  selectedImg: any;
  categories: any[] = [];
  postForm!: FormGroup;
  selected: string = '';
  editingPostId: any;
  editingPost: any;
  postStatus: string = 'Add New';
  constructor(
    private categoryService: CategoryServiceService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.editingPostId = val['id'];
      this.postService.loadDataById(val['id']).subscribe((post) => {
        this.editingPost = post;

        if (val['id']) {
          this.postStatus = 'Edit';
          this.postForm = this.fb.group({
            title: [
              this.editingPost.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [this.editingPost.permalink, Validators.required],
            excerpt: [
              this.editingPost.excerpt,
              [Validators.required, Validators.minLength(20)],
            ],
            category: [
              `${this.editingPost.category.categoryId}-${this.editingPost.category.category}`,
            ],
            postImg: ['', Validators.required],
            content: [this.editingPost.content, Validators.required],
          });

          this.imgSrc = this.editingPost.postImgPath;
        } else {
          this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10)]],
            permalink: ['', Validators.required],
            excerpt: ['', [Validators.required, Validators.minLength(20)]],
            category: [''],
            postImg: ['', Validators.required],
            content: ['', Validators.required],
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }

  get formCon(): { [key: string]: AbstractControl } {
    return this.postForm.controls;
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    let splitted = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createAt: new Date(),
    };
    // console.log(postData);
    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.postStatus,
      this.editingPostId
    );
    this.postForm.reset();
    this.imgSrc = this.ImageSrc;
  }
}
