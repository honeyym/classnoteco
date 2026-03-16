

# Add Study Groups + Fix Build Errors

## Problems to Fix First

1. **`.env` was overwritten with placeholders** -- the last edit replaced real backend credentials with `your_project_id` etc. This is the root cause of the persistent `supabaseUrl is required` error. The `.env` file is auto-managed and must be restored with the correct values.

2. **`supabase/functions/deno.ts` build error** -- the `Deno` declaration conflicts with the actual Deno runtime types. This file should be deleted since edge functions already have access to Deno types natively.

## Study Groups Feature

Add a new "Study Groups" tab in the Course page, next to the existing Resources tab. Students can create and join study groups for each course.

### Database Changes
Create a `study_groups` table and a `study_group_members` join table:

- **`study_groups`**: id (uuid), course_id (text), name (text), description (text), creator_id (uuid), max_members (int, default 10), created_at (timestamptz)
- **`study_group_members`**: id (uuid), group_id (uuid FK), user_id (uuid), joined_at (timestamptz), unique(group_id, user_id)

RLS policies: enrolled users can view/create groups for their courses; members can leave (delete own membership); creator can delete group.

### UI Changes

1. **New tab in `Course.tsx`** -- Add a "Study Groups" tab with a `Users` icon alongside the existing Discussion/Chat/Saved/Resources tabs.

2. **New `StudyGroups.tsx` component** containing:
   - A "Create Study Group" card with name, description, and max members fields
   - A list of existing study groups for the course, each showing: group name, description, member count / max, and a Join/Leave button
   - Member avatars (initials) shown on each group card
   - Visual indication when a group is full

3. **Data hook `useStudyGroups.ts`** -- fetches groups and memberships for the course, with create/join/leave mutations.

### File Changes Summary
| File | Action |
|------|--------|
| `.env` | Restore correct backend credentials |
| `supabase/functions/deno.ts` | Delete file |
| DB migration | Create `study_groups` + `study_group_members` tables with RLS |
| `src/hooks/useStudyGroups.ts` | New hook for CRUD operations |
| `src/components/StudyGroups.tsx` | New component for the tab content |
| `src/pages/Course.tsx` | Add Study Groups tab |

