declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_CLIENT_ID: string;
        CLIENT_SECRET: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }
  
  export {};