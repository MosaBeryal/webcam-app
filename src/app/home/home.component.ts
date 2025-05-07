import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  form = {
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    additionalInfo: ''
  };
  searchName = '';
  searchResult = '';
  matchedUsers: any[] = [];

  capturedImage: string | null = null;
  cropper: Cropper | null = null;
  showCropper = false;

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('croppingImage') croppingImage!: ElementRef<HTMLImageElement>;

  ngAfterViewInit() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.video.nativeElement.srcObject = stream;
    });
  }

  captureImage() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    canvas.width = this.video.nativeElement.videoWidth;
    canvas.height = this.video.nativeElement.videoHeight;
    ctx?.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/png');
  }

  editImage() {
    if (this.capturedImage) {
      this.showCropper = true;
      setTimeout(() => {
        this.cropper = new Cropper(this.croppingImage.nativeElement, {
          viewMode: 1,
          aspectRatio: 1,
          autoCropArea: 1,
          responsive: true
        });
      }, 100);
    }
  }

  rotateImage() {
    this.cropper?.rotate(90);
  }

  applyCrop() {
    if (this.cropper) {
      const canvas = this.cropper.getCroppedCanvas();
      this.capturedImage = canvas.toDataURL('image/png');
      this.cropper.destroy();
      this.cropper = null;
      this.showCropper = false;
    }
  }

  cancelCrop() {
    this.cropper?.destroy();
    this.cropper = null;
    this.showCropper = false;
  }

  retakeImage() {
    this.capturedImage = null;
    this.cropper?.destroy();
    this.cropper = null;
    this.showCropper = false;
  }

  submit() {
    console.log({ ...this.form, image: this.capturedImage });
    alert('Data ready to send to backend!');
  }

  search() {
    this.matchedUsers = this.searchName
      ? [{ name: 'John Doe', address: '123 Main St' }]
      : [];
    this.searchResult = this.matchedUsers.length ? 'Result found' : 'No results';
  }
}
