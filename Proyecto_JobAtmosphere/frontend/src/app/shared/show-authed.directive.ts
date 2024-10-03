    import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
    } from '@angular/core';

    import { UserService } from '../core/services/user.service';

    @Directive({ selector: '[appShowAuthed]' })
    export class ShowAuthedDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private userService: UserService,
        private viewContainer: ViewContainerRef
    ) {}

    condition!: boolean;

    ngOnInit() {
        console.log('hola directiva');
        
        this.userService.isAuthenticated.subscribe(
        (isAuthenticated) => {
            if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
            this.viewContainer.clear();
            }
        }
        );
    }

    @Input() set appShowAuthed(condition: boolean) {
        console.log(condition);
        this.condition = condition;
    }

    }