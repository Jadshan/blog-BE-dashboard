import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private store: AngularFirestore,
    private router: Router
  ) {}

  uploadImage(
    selectedImg: any,
    postData: any,
    postStatus: string,
    editingPostId: any
  ) {
    const filePath = `postImg/${Date.now()}`;
    console.log(filePath);

    this.storage.upload(filePath, selectedImg).then(() => {
      this.toastr.success('Image uploaded successfully.. !');
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;

          if (postStatus == 'Edit') {
            this.updateDataById(editingPostId, postData);
          } else {
            this.savePost(postData);
          }
        });
    });
  }

  savePost(postData: any) {
    this.store
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Post uploaded successfully.. !');
        this.router.navigate(['/allPosts']);
      });
  }

  loadData() {
    return this.store
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((load) => {
            const data: any = load.payload.doc.data();
            const id = load.payload.doc.id;
            return { data, id };
          });
        })
      );
  }

  loadDataById(id: any) {
    return this.store.doc(`posts/${id}`).valueChanges();
  }

  updateDataById(id: any, postData: any) {
    this.store
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toastr.success('Post updated successfully.. !');
        this.router.navigate(['/allPosts']);
      });
  }

  deletePost(id: any, postImgPath: any) {
    if (postImgPath) {
      this.storage.storage
        .refFromURL(postImgPath)
        .delete()
        .then(() => {
          this.store
            .doc(`posts/${id}`)
            .delete()
            .then(() => {
              this.toastr.warning('this post deleted... !!');
            });
        });
    } else {
      this.store
        .doc(`posts/${id}`)
        .delete()
        .then(() => {
          this.toastr.warning('this post deleted... !!');
        });
    }
  }

  markFFeatured(id: any, featuredData: any) {
    this.store
      .doc(`posts/${id}`)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Feature updated successfully.. !');
      });
  }
}
