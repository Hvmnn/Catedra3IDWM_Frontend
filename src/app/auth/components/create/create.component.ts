import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, CommonModule],
  providers: [PostsService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  createPostForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userId = this.getUserIdFromToken();

    this.createPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      image: [null, Validators.required],
    });
  }

  private getUserIdFromToken(): string | null {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró un token en el localStorage');
      return null;
    }

    try {
      const decoded: any = jwtDecode(token); // Corregido aquí
      console.log('Token decodificado:', decoded);
      return decoded.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.createPostForm.patchValue({ image: file });
      this.createPostForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.createPostForm.invalid || !this.userId) {
      console.error('Formulario inválido o UserId no disponible');
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.createPostForm.get('title')?.value);
    formData.append('UserId', this.userId);
    const fileInput = this.createPostForm.get('image')?.value;

    if (fileInput) {
      formData.append('Image', fileInput);
    }

    this.postsService.createPost(formData).subscribe({
      next: (response) => {
        alert('Post creado exitosamente');
        console.log('Post creado exitosamente:', response);
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        console.error('Error al crear el post:', err);

        if (err.error && typeof err.error === 'string') {
          if (err.error.includes('formato')) {
            alert('El formato de la imagen no es válido, solo se permiten imágenes JPG o PNG');
          } else if (err.error.includes('tamaño')) {
            alert('El tamaño de la imagen excede el límite permitido de 5MB');
          } else {
            alert('Ocurrió un error inesperado. Por favor, intente más tarde.');
          }
        } else {
          alert('Ocurrió un error inesperado. Por favor, intente más tarde.');
        }

        this.createPostForm.patchValue({ image: null });
        this.imagePreview = null;
        this.createPostForm.get('image')?.markAsUntouched();
      },
    });
  }
}
