import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MapValuePipe } from '../pipe/map-value.pipe';

interface Item {
  label: string;
  tags: {
    id: string;
    value: string;
  }[];
}

interface Tag {
  id: string;
  label: string;
}

interface Classify {
  label: string;
  items: Item[];
  tags: Tag[];
  tagLabelMap: { [tagId: string]: string };
}

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapValuePipe],
})
export class MenuCreateComponent {
  classifies: Classify[] = JSON.parse(
    localStorage.getItem('create-classifies') ?? '[]'
  );

  storeName = JSON.parse(localStorage.getItem('create-storeName') ?? '""');

  storeAddress = JSON.parse(
    localStorage.getItem('create-storeAddress') ?? '""'
  );

  storeContactNumber = JSON.parse(
    localStorage.getItem('create-storeContactNumber') ?? '""'
  );

  clear() {
    this.classifies = [];
    this.storeName = '';
    this.storeAddress = '';
    this.storeContactNumber = '';
    this.save();
  }

  save() {
    localStorage.setItem('create-classifies', JSON.stringify(this.classifies));
    localStorage.setItem('create-storeName', JSON.stringify(this.storeName));
    localStorage.setItem(
      'create-storeAddress',
      JSON.stringify(this.storeAddress)
    );
    localStorage.setItem(
      'create-storeContactNumber',
      JSON.stringify(this.storeContactNumber)
    );
  }

  addClassify() {
    this.classifies = [
      ...this.classifies,
      { label: '', items: [], tags: [], tagLabelMap: {} },
    ];
  }

  addItem(classify: Classify, index: number) {
    this.classifies.splice(index, 1, {
      ...classify,
      items: [
        ...classify.items,
        {
          label: '',
          tags: classify.tags.map((tag) => ({ id: tag.id, value: '' })),
        },
      ],
    });
    this.classifies = [...this.classifies];
  }

  addTag(classify: Classify, index: number) {
    const tagId = crypto.randomUUID();
    this.classifies.splice(index, 1, {
      ...classify,
      tags: [...classify.tags, { label: '', id: tagId }],
      tagLabelMap: { ...classify.tagLabelMap, [tagId]: '' },
      items: classify.items.map((item) => ({
        ...item,
        tags: [...item.tags, { id: tagId, value: '' }],
      })),
    });
    this.classifies = [...this.classifies];
  }

  removeTag(classify: Classify, index: number, tag: Tag, tagIndex: number) {
    const tagId = tag.id;
    this.classifies.splice(index, 1, {
      ...classify,
      tags: classify.tags.filter((t) => t !== tag),
      items: classify.items.map((item) => ({
        ...item,
        tags: item.tags.filter((t) => t.id !== tagId),
      })),
    });
    this.classifies = [...this.classifies];
  }

  updateTag(
    classify: Classify,
    index: number,
    tag: Tag,
    tagIndex: number,
    value: string
  ) {
    tag.label = value;
    classify.tagLabelMap = { ...classify.tagLabelMap, [tag.id]: value };
    // this.classifies.splice(index, 1, {
    //   ...classify,
    //   tagLabelMap: {
    //     ...classify.tagLabelMap,
    //     [tag.id]: value,
    //   },
    // });
  }

  saveFile() {
    const file = new File(
      [
        JSON.stringify(
          {
            classifies: this.classifies,
            storeName: this.storeName,
            storeAddress: this.storeAddress,
            storeContactNumber: this.storeContactNumber,
          },
          null,
          2
        ),
      ],
      'menu-create.json',
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
