<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d987a06c-d316-4859-87f9-803b700f3016

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Laravel backend

1. Change to the Laravel folder and install dependencies:
   - `cd laravel`
   - `composer install`
   - `npm install`
2. Copy `.env.example` to `.env` and adjust settings (APP_URL, DB_CONNECTION)
3. Create SQLite file (if using sqlite): `touch database/database.sqlite`
4. Run migrations and seeders:
   - `php artisan migrate`
   - `php artisan db:seed --class=QuestionSeeder`
5. Serve the backend locally:
   - `php artisan serve --host=127.0.0.1 --port=8000`

Note: Do not commit `laravel/.env`, `laravel/database/database.sqlite`, or `laravel/vendor/`.
