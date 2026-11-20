# crumb

A local, mobile-first prototype for the grocery-store moment: check what's at home, discover meals, pick a few, add extras, and shop from one list.

## Run

Requires Node.js 22.12+ (or a compatible newer version) and npm.

```sh
npm ci
npm run dev
```

Open the local URL Vite prints, normally http://127.0.0.1:5173.

```sh
npm test
npm run build
npm run preview
```

## Try the journey

1. Open **Discover**. The fridge starts with eight sample ingredients.
2. Check **At home**, then return to the recommended meals. Spinach is dated soon, so meals using it get a boost.
3. Open a recipe, adjust servings, and add it to the shopping trip. Select a second meal to see shared ingredients combined.
4. Open **Shopping list**, add extras, and review **To buy** alongside **Already at home**. Home quantities are allocated once across the whole trip.
5. Check purchased items and select **Add purchases to home**. Ingredients and custom groceries appear in inventory; repeating the action does not duplicate them.
6. Mark a meal as cooked to deduct available ingredients. A confirmation flags shortages.
7. In **Your profile**, change cuisine likes, dietary exclusions, cooking time, budget importance and environmental importance, then revisit recommendations.
8. Try the explicitly simulated sample receipt in **At home**, or reset the demo in **Your profile**.

Data persists in this browser under `crumb:v1`. There are no accounts or cross-device synchronization. Storage failures show an in-app message.

## Changing the look

- `src/theme.css`: semantic colors, fonts, radii, spacing, shadows and motion tokens.
- `src/style.css`: responsive layouts and component styling.
- `src/data.ts`: central `brand.name`, sample inventory, recipes, ingredient identifiers, prices and profile defaults. Update the HTML title and favicon too when rebranding.
- `src/logic.ts`: pure recommendation, aggregation, purchase and consumption functions.
- `src/storage.ts`: browser persistence adapter.
- `src/App.tsx`: navigation and interactive screens.

Dietary exclusions and maximum cooking time filter recipes. Favorites, ingredients to use soon, ingredient coverage, budget importance and environmental importance affect deterministic ranking. Ingredient costs represent consumed quantities rather than store pack sizes; pantry oil, salt and pepper are assumed available. Compatible units combine; incompatible units remain separate.

## Prototype boundaries

Receipt recognition is simulated. Prices and environmental categories are illustrative, not live grocery prices or verified footprint measurements. Custom extras have no price. Expiry dates are user estimates. Food photos load from Unsplash and require connectivity; cards retain their backgrounds and text without photos. Nutrition, weekly scheduling, payments, offers, authentication and server storage are outside this version.

## Git initialization

The implementation environment blocks writes to `.git`, so repository initialization could not be completed. From a terminal with normal permissions in this folder, run:

```sh
git init -b main
git add .
git commit -m "Build crumb prototype"
```

No remote repository has been created.

## Verification

TypeScript and production build pass. Automated tests cover ingredient allocation, serving scaling, unit handling, recommendation filters/ranking, purchase idempotence, custom groceries, consumption and browser persistence. Visual and interactive browser verification remains outstanding: the implementation environment blocked local port binding and its browser preview service was unavailable.
