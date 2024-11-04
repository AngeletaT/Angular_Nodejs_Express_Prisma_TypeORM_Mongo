import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';

@Component({
  selector: 'app-form-comment',
  templateUrl: './form-comment.component.html',
  styleUrls: ['./form-comment.component.css']
})
export class FormCommentComponent implements OnInit {
  @Input() slug!: string;
  @Input() comment!: Comment | null;
  @Output() submitComment = new EventEmitter<void>();
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private commentService: CommentService) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.maxLength(140)]]
    });
  }

  ngOnInit() {
    if (this.comment) {
      this.commentForm.patchValue(this.comment);
    }
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const commentBody = this.commentForm.value.body;

      if (this.comment) {
        // Lógica para actualizar el comentario
        this.commentService.update(this.slug, this.comment.id, { body: commentBody }).subscribe(() => {
          this.submitComment.emit();
          this.commentForm.reset();
        });
      } else {
        // Lógica para agregar un nuevo comentario
        this.commentService.add(this.slug, commentBody).subscribe(() => {
          this.submitComment.emit();
          this.commentForm.reset();
        });
      }
    }
  }
}