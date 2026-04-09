<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::with('gender')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'genderId' => 'required|exists:genders,id',
            'dob' => 'nullable|date',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8',
            'status' => 'required|in:Active,Inactive',
            'address' => 'nullable|string',
        ]);

$validated['password'] = Hash::make($validated['password']);
        $validated['email'] = $validated['username'];
        $validated['gender_id'] = $validated['genderId'];
        $validated['name'] = trim($validated['firstName'] . ' ' . ($validated['middleName'] ? $validated['middleName'] . ' ' : '') . $validated['lastName'] . ($validated['suffix'] ? ' ' . $validated['suffix'] : ''));
        unset($validated['genderId']);

        $user = User::create($validated);

        return response()->json($user->load('gender'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user->load('gender'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'genderId' => 'required|exists:genders,id',
            'dob' => 'nullable|date',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:Active,Inactive',
            'address' => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $validated['email'] = $validated['username'];
        $validated['gender_id'] = $validated['genderId'];
        $validated['name'] = trim($validated['firstName'] . ' ' . ($validated['middleName'] ? $validated['middleName'] . ' ' : '') . $validated['lastName'] . ($validated['suffix'] ? ' ' . $validated['suffix'] : ''));
        unset($validated['genderId']);

        $user->update($validated);

        return response()->json($user->load('gender'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
}

