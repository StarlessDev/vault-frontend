# Vault-Frontend
This is the frontend of the **Vault** project: a small and simple encrypted file hosting. Written for the Web Technologies exam @ [UniMoRe](https://www.unimore.it/it) using NextJS and tailwindcss.

## Getting Started
First, install the needed dependencies:
```bash
npm install
```

Create a .env file to let the site know what domains are we using:
```
# Where is the api located (the '/' at the end is IMPORTANT)
NEXT_PUBLIC_API_URL=http://localhost:8181/api/
# Where is the frontend located (the '/' at the end is IMPORTANT)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000/
```

then run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.
