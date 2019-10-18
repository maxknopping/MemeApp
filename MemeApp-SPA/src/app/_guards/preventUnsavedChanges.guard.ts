import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<ProfileEditComponent> {
    canDeactivate(component: ProfileEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
        }

        return true;
    }
}