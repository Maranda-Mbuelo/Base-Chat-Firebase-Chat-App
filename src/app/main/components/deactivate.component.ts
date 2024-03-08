import { Component } from '@angular/core';

@Component({
  selector: 'app-deactivate',
  template: `
  <section class="flex items-center justify-center bg-center min-h-[100dvh] bg-no-repeat bg-[url('https://img.freepik.com/premium-photo/black-dots-white-background_664601-2305.jpg?w=2000')] bg-gray-500 bg-blend-multiply">
    <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
      <app-dialog [heading] = "'Deactivate account'" [bodyText]="'Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.'"/>
    </div>
  </section>
  `,
  styles: [
  ]
})
export class DeactivateComponent {

}
