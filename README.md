<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="https://github.com/trevorpfiz/stable">
    <img src="https://github.com/trevorpfiz/stable/assets/24904780/0e15369e-2550-42da-84ad-0f224af1ac8a" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Stable - Open Source Metabolic Health App</h3>

  <p align="center">
    This is an open source metabolic health app. Connect with your Dexcom CGM and visualize your glucose data in real-time.
  </p>

  <!-- WIP Alert -->
  <p align="center">
    <strong>⚠️ WIP - Upgrading to Expo SDK 52 and the New Architecture. ⚠️</strong>
  </p>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li>
      <a href="#demo">Demo</a>
    </li>
    <li><a href="#project-details">Project Details</a></li>
    <li><a href="#technical-details">Technical Details</a></li>
    <li>
      <a href="#installation-and-usage">Installation and Usage</a>
    </li>
    <li><a href="#feedback">Feedback</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</details>

<!-- DEMO -->

## Demo

<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/a1644fe2-84aa-4126-8c24-25e674598629" alt="Screenshot 2024-11-12 at 3 56 12 PM" style="width: 180px; height: 390px;">
  <img src="https://github.com/user-attachments/assets/090d5819-4a5d-4acd-914e-ab7bfd13fdd8" alt="Screenshot 2024-11-12 at 3 55 27 PM" style="width: 180px; height: 390px;">
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT DETAILS -->

## Project Details

### Apps

- **Expo** mobile app for optimizing metabolic health.
- **Next.js** web dashboard.

### Features

- **Authentication:** Sign up with Apple, Google, or email. Supabase Auth.
- **Calendar:** WHOOP-inspired calendar built with Flash Calendar.
- **Day Slider:** Quickly swipe through days of data.
- **Dexcom Sandbox:** Connect with Dexcom Sandbox Data.
- **Glucose Graph:** Visualize your Time in Range (TIR) with charts from Victory Native.
- **Web Dashboard:** Next.js app for visualizing metabolic health.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TECHNICAL DETAILS -->

## Technical Details

### Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Jest](https://jestjs.io/)
- [Turborepo](https://turbo.build/repo/docs)

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  ├─ Recommended extensions and settings for VSCode users
  └─ Multi-root Workspaces for smoother python experience in monorepo
apps
  ├─ expo
  |   ├─ Expo SDK 52
  |   ├─ React Native 0.76 New Architecture
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   ├─ Typesafe API calls using tRPC
  |   └─ Jest + React Native Testing Library for unit tests
  └─ nextjs
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition.
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Supabase
  ├─ ui
  |   └─ shadcn/ui.
  └─ validators
      └─ Zod schemas for repo-wide type-safety and validation.
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  ├─ github
  |   └─ shared github actions
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this project, we use `@stable` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@stable` to something like `@my-company` or `@project-name`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INSTALLATION AND USAGE -->

## Installation and Usage

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
cp .env.example .env.local
```

```bash
# Push the Drizzle schema to Supabase
pnpm db:generate
pnpm db:migrate
```

### 2. Setup Supabase

1. Go to [the Supabase dashboard](https://app.supabase.com/projects) and create a new project.
2. Under project settings, retrieve the environment variables `reference id`, `project url` & `anon public key` and paste them into [.env](./.env.example) in the necessary places. You'll also need the database password you set when creating the project.
3. Under `Auth`, configure any auth provider(s) of your choice. This repo is using Github for Web and Apple for Mobile.
4. If you want to use the `Email` provider and `email confirmation`, go to `Auth` -> `Email Templates` and change the `Confirm signup` from `{{ .ConfirmationURL }}` to `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=signup`, according to <https://supabase.com/docs/guides/auth/redirect-urls#email-templates-when-using-redirectto>. `.RedirectTo` will need to be added to your `Redirect URLs` in the next step.
5. Under `Auth` -> `URL Configuration`, set the `Site URL` to your production URL and add `http://localhost:3000/**` and `https://*-username.vercel.app/**` to `Redirect URLs` as detailed here <https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls>.
6. Set up a trigger when a new user signs up: <https://supabase.com/docs/guides/auth/managing-user-data#using-triggers>. You can run this in the SQL Editor.

```sql
-- inserts a row into public.profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.epi_profile (id, email, name, image)
  values (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'user_name',
      'Guest User'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    image = excluded.image;
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- trigger the function when a user signs in/their email is confirmed to get missing values
create trigger on_auth_user_verified
  after update on auth.users
  for each row when (
    old.last_sign_in_at is null
    and new.last_sign_in_at is not null
  ) execute procedure public.handle_new_user();
```

```sql
-- drop a trigger if needed
drop trigger "on_auth_user_verified" on auth.users;
```

7. Remove access to the `public` schema as we are only using the server

By default, Supabase exposes the `public` schema to the PostgREST API to allow the `supabase-js` client query the database directly from the client. However, since we route all our requests through the Next.js application (through tRPC), we don't want our client to have this access. To disable this, execute the following SQL query in the SQL Editor on your Supabase dashboard:

```sql
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;
```

![disable public access](https://user-images.githubusercontent.com/51714798/231810706-88b1db82-0cfd-485f-9043-ef12a53dc62f.png)

> Note: This means you also don't need to enable row-level security (RLS) on your database if you don't want to.

### 3. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev:ios": "expo start --ios",
   ```

2. Run `pnpm dev:ios` at `apps/expo` to open the iOS simulator.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Run `pnpm dev:android` script at `apps/expo` to open the Android emulator.

   ```diff
   +  "dev:android": "expo start --android",
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEEDBACK -->

## Feedback

Share your thoughts in [Discussions](https://github.com/trevorpfiz/wellchart/discussions)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

We welcome contributions! Find out how you can contribute to the project in `CONTRIBUTING.md`: [Contributing Guidelines](https://github.com/trevorpfiz/wellchart/blob/main/CONTRIBUTING.md)

<a href="https://github.com/trevorpfiz/wellchart/graphs/contributors">
  <p align="center">
    <img src="https://contrib.rocks/image?repo=trevorpfiz/wellchart" alt="A table of avatars from the project's contributors" />
  </p>
</a>

<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the [MIT License](https://github.com/trevorpfiz/wellchart/blob/main/LICENSE). See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- REFERENCES -->

## References

This repo originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo). Feel free to check out the project if you are running into issues with running/deploying the starter.

Thanks as well to the following:

- [Levels Health](https://www.levels.com/) for fueling the inspiration for this project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
