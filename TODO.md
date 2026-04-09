# Fix 422 Error on User Creation

## Plan Steps (Approved by User)

**✅ Step 1: Seed sample genders via active tinker terminal**
```
>>> App\Models\Gender::create(['name' => 'Male', 'status' => 'active']);
>>> App\Models\Gender::create(['name' => 'Female', 'status' => 'active']);
>>> App\Models\Gender::all();  // Verify 2 records
>>> exit
```
*Fixes 'exists:genders,id' validation failure*

**⏳ Step 2: Edit server/app/Http/Controllers/UserController.php**
- Map frontend `genderId` → backend `gender_id` in store() and update().
- Handles mass assignment to DB column.

**⏳ Step 3: Improve error handling in client/src/pages/UserPage.tsx**
- Parse Laravel validation errors in axios catch.
- Show specific messages (e.g. "The selected gender id is invalid").

**⏳ Step 4: Test**
- Reload frontend GenderPage to fetch genders.
- Create user - should succeed.
- Edit user too.

**⏳ Step 5: [Complete]**

*After each step, mark with ✅ and update file.*

