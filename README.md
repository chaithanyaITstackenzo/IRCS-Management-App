# IRCS Cancer Hospital — Management App

AI-Based Facial Recognition Attendance & Workforce Management System — **Management App**
(Admin / HR / Management)

Built with the same technical stack and conventions as the reference project
[`attendance_mobile_a`](https://github.com/sujithkonduru/attendance_mobile_a):
Expo, React Native, TypeScript, Expo Router, TanStack React Query, Axios, Zustand,
Expo Secure Store, and `react-native-toast-message`.

## Stack

- Expo SDK 54 · React Native 0.81 · React 19 · TypeScript (strict)
- Expo Router (file-based routing, typed routes)
- TanStack React Query — all server state (employees, attendance, cameras, etc.)
- Zustand — auth session + small client-only UI state
- Axios — single shared client (`api/axios.ts`) with a JWT interceptor and global 401 handling
- Expo Secure Store — JWT persistence (V1 has no refresh token, so this is the only token)
- `react-native-toast-message` — success/error feedback
- `expo-camera` / `expo-image-picker` / `expo-image-manipulator` — face enrollment capture
- `expo-file-system` / `expo-sharing` — format-agnostic report download/share
- `@react-native-community/netinfo` — offline banner state
- `@react-native-community/datetimepicker` — native date pickers (Android dialog / iOS inline)

## Getting started

```bash
npm install
cp .env.example .env   # then set EXPO_PUBLIC_API_URL to Thoufiq's backend
npx expo start
```

Then press `a` for Android or `i` for iOS, or scan the QR code with Expo Go /
your development build.

Because this app uses native modules (camera, secure store, date picker), a
plain Expo Go session is fine for most screens, but a full **development
build** (`eas build --profile development`) is recommended before relying on
camera-based face enrollment on a physical device.

## Quality gate

```bash
npm run typecheck   # npx tsc --noEmit  → 0 errors
npm run lint         # npx expo lint     → 0 errors, 0 warnings
npx expo-doctor      # 16/18 checks pass in a sandboxed/offline environment;
                      # the 2 network-dependent checks (Expo schema + RN Directory)
                      # simply require internet access to Expo's servers.
```

## Project structure

```
app/                          Expo Router screens (see below)
api/                          One typed Axios module per backend resource
hooks/                        TanStack React Query hooks wrapping api/
store/                        Zustand: authStore (JWT/session), managementStore (UI state)
components/
  ui/                         Design-system primitives (Button, Input, Select, Card, DateField...)
  common/                     Cross-feature widgets (EmptyState, ErrorState, ConfirmDialog, FilterSheet...)
  employees/ attendance/ requests/ infrastructure/ organization/
                               Feature-specific presentational components
constants/                    colors, spacing, typography, status→label/color maps, API config
types/                        One file per V1 database entity + API payload/response shapes
utils/                        date/time formatting, overnight-shift logic, permissions, error messages
services/reportDownload.ts    Format-agnostic report file handling (PDF/CSV/Excel/JSON)
```

### Navigation

Bottom tabs (`app/(management)/(tabs)/`) cover the 5 most-used destinations —
**Dashboard, Employees, Attendance, Requests, More** — so the tab bar never
turns into a 15-item wall of icons. Everything else (Organization,
Infrastructure, Reports, employee add/edit/enrollment, attendance history/detail,
request detail, camera/speaker detail) lives one level up as stack routes
reachable from the **More** tab or by drilling into a list item, matching the
navigation tree in the spec (§57).

## What's fully wired to the confirmed API contract

Login · Management Dashboard · Employees (list/search/filter/create/OTP verify/edit/deactivate)
· Departments · Designations · Roles · Read-only Shifts · Admin Attendance
· Attendance Requests (pending/approve/reject) · Permission and Leave request services
· Notifications

Camera, speaker, report, and face-enrollment screens remain available only as
explicit unavailable states because the supplied backend has no corresponding
management endpoints. The app uses real backend responses only; mock data and
mock authentication are not included.

## Backend contracts still required from Thoufiq

These are intentionally **not implemented with guessed endpoints** — see the
`TODO BACKEND CONTRACT REQUIRED` comments in each file:

1. **Roles CRUD** (`api/roles.ts`, `app/(management)/organization/roles.tsx`) — only a
   best-guess `GET /roles` is wired (needed to populate employee role dropdowns).
   Create/update/status-toggle are not implemented until the endpoints are confirmed.
2. **Face enrollment upload** (`api/enrollment.ts`) — the capture → review → submit UI
   is fully built (`app/(management)/employees/enrollment/[id].tsx`), but the actual
   endpoint name and multipart payload shape are stubbed and throw a clear error until
   confirmed.
3. **Attendance request rejection payload** (`api/attendanceRequests.ts`) — reject
   currently sends `{ rejection_reason }` only if the user typed one; confirm whether
   the backend requires this field.
4. **Report response format** (`api/reports.ts`, `services/reportDownload.ts`) — the
   service inspects the real `Content-Type` header at runtime (PDF/CSV/Excel/JSON) so no
   assumption is baked in, but pagination/streaming behavior for very large reports isn't
   confirmed.
5. **Employee/attendance list pagination & query param names** — `page` is sent as shown
   in the spec but isn't guaranteed to be the backend's actual parameter name.

## Environment variables

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend base URL, e.g. `https://api.ircs-hospital.example.com/api/v1` |
| `EXPO_PUBLIC_ENV` | `development` \| `staging` \| `production` (display/debug only) |

Expo public env vars are bundled into the client and are **not secret** — never put
real backend secrets here.

## Known limitations

- Roles, face enrollment, and report pagination are UI-complete but API-stubbed pending
  Thoufiq's contract (see above).
- Employee/attendance list pagination assumes a `page` query param; adjust
  `EmployeeListParams` / `AttendanceListParams` and the corresponding hooks once confirmed.
- Push notifications use Expo Notifications. The frontend registers its Expo token through
   the backend's existing `PUT /api/hr/expoToken` endpoint; delivery still depends on the
   backend's Expo/Firebase notification sender being configured for `users.expo_token`.
