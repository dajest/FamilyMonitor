# Family Care Agency

Vue 3 + Vite application for Family Care Agency.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

3. To get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Places API" and "Maps JavaScript API"
   - Create credentials (API Key)
   - Add the API key to your `.env.local` file

4. Run the development server:
```bash
npm run dev
```

## Features

- User authentication with Supabase
- Google OAuth login
- Multi-language support (English, Russian, Lithuanian)
- Dark/Light theme toggle
- Google Places address autocomplete in registration form
