/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: any;
      };
    };
    env: {
      DB: any;
    };
  }
}