import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todo';
  newItem: string;
  listItems: Observable<any>;

  constructor(public db: AngularFireDatabase) {
    this.listItems = db
      .list('items')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            val: c.payload.val(),
          }));
        })
      );
  }

  onSubmit() {
    this.db.list('items').push({
      content: this.newItem,
      isDone: false,
    });
    this.newItem = '';
  }

  onDelete(key: any) {
    this.db.list('items').remove(key);
  }

  checkValue(event: any, key) {
    this.db.list('items').update(key, { isDone: event.currentTarget.checked });
    console.log(event.currentTarget.checked);
  }
}
