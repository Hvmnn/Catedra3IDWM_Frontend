import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  providers: [PostsService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  posts: any[] = [];
  isLoading = true;

  constructor(private postsService: PostsService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.postsService.getPosts().subscribe({
      next: (response) => {
        this.posts = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener los posts:', err);
        this.isLoading = false;
      }
    });
  }

  redirectToCreate(): void {
    this.router.navigate(['/posts/create']);
  }
}
