import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoryServiceService {
  constructor(private store: AngularFirestore, private toastr: ToastrService) {}
  saveData(data: any) {
    this.store
      .collection('catergories')
      .add(data)
      .then((docRef) => {
        this.toastr.success('Data inserted successfully.. !');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  loadData() {
    return this.store
      .collection('catergories')
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

  updateData(id: string, editedData: any) {
    this.store
      .doc(`catergories/${id}`)
      .update(editedData)
      .then((docRef) => {
        this.toastr.success('Data Edited successfully.. !');
      });
  }

  deleteData(id: string) {
    this.store
      .doc(`catergories/${id}`)
      .delete()
      .then((docRef) => {
        this.toastr.success('Data Deleted successfully.. !');
      });
  }
}
