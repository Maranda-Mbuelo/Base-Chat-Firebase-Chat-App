import { Injectable } from '@angular/core';
import Typed from 'typed.js';

@Injectable({
  providedIn: 'root'
})
export class TypewriterService {

  private typedInstances: Typed[] = [];

  constructor() { }

  startTypewriter(elementSelector: string, strings: string[], loop: boolean): Typed {
    var options = {
      strings: strings, // An array of strings to type out
      typeSpeed: 30, // typing speed in milliseconds
      backSpeed: 15, // backspacing speed in milliseconds
      loop: loop, // loop the animation indefinitely
      showCursor: false,
      backDelay: 1500,
    };

    const typed = new Typed(elementSelector, options);
    this.typedInstances.push(typed);

    return typed;
  }

  placeholderWriter(placeholderSelector: string, strings: string[]): Typed{
    var options = {
    strings: strings,
    typeSpeed: 30,
    backSpeed: 8,
    attr: 'placeholder',
    bindInputFocusEvents: true,
    loop: false
    };

    const typed = new Typed(placeholderSelector, options);
    this.typedInstances.push(typed);

    return typed;
  }

  stopTypewriter(typedInstance: Typed): void {
    if (typedInstance) {
      typedInstance.destroy();
      this.typedInstances = this.typedInstances.filter(instance => instance !== typedInstance);
    }
  }

  stopAllTypewriters(): void {
    this.typedInstances.forEach(instance => instance.destroy());
    this.typedInstances = [];
  }

}
