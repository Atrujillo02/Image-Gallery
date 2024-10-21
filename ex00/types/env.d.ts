interface ImportMetaEnv {
    VITE_ACCESS_KEY: string;
    VITE_SECRET_KEY: string;
    VITE_UNSPLASH_URL: string;
    VITE_REDIRECT_URI: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }