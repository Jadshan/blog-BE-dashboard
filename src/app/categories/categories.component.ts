import { Component, OnInit } from '@angular/core';
import { CategoryServiceService } from '../services/category-service.service';
import { Category } from '../models/category';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryArray: any[] = [];
  formCategory: string | undefined;
  formStatus: string = 'Add';
  editedCategoryId!: string;
  constructor(private categoryService: CategoryServiceService) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categoryArray = val;
    });
  }

  onSubmit(addedCategory: any) {
    let categoryData: Category = {
      category: addedCategory.value.category,
    };

    if (this.formStatus == 'Add') {
      this.categoryService.saveData(categoryData);
    } else if (this.formStatus == 'Edit') {
      this.categoryService.updateData(this.editedCategoryId, categoryData);
    }
    addedCategory.reset();
    this.formStatus = 'Add';
    //   let subCategoryData = {
    //     subCategory: 'subcateogory1',
    //   };
    //   console.log(categoryData);
    //   this.store
    //     .collection('catergories')
    //     .add(categoryData)
    //     .then((docRef) => {
    //       console.log(docRef);
    //       this.store
    //         .collection('catergories')
    //         .doc(docRef.id)
    //         .collection('subCateogories')
    //         .add(subCategoryData)
    //         .then((subDocRef) => {
    //           console.log(subDocRef);
    //           this.store
    //             .doc(`catergories/${docRef.id}/subCateogories/${subDocRef.id}`)
    //             .collection('subCateogry2')
    //             .add(subCategoryData)
    //             .then((subDocRef3) => {
    //               console.log(subDocRef3);
    //             });
    //         });
    //     })

    //     .catch((err) => {
    //       console.log(err);
    //     });
  }

  onEdit(id: string, category: string) {
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.editedCategoryId = id;
  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
  }
}
