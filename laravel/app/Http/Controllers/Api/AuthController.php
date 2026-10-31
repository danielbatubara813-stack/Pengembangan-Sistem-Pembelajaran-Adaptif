<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ProgressSnapshotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function __construct(private readonly ProgressSnapshotService $progressSnapshots)
    {
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:254', 'unique:users,email'],
            'nim' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', Password::min(8), 'max:128'],
        ], [
            'email.unique' => 'Email sudah terdaftar. Silakan masuk.',
        ]);

        $data['name'] = trim($data['name']);
        $data['email'] = mb_strtolower(trim($data['email']));
        $data['nim'] = isset($data['nim']) && trim($data['nim']) !== '' ? trim($data['nim']) : null;

        $user = User::create($data);
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => $this->publicUser($user),
            'progress' => null,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:254'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        $credentials = [
            'email' => mb_strtolower(trim($data['email'])),
            'password' => $data['password'],
        ];

        if (! Auth::guard('web')->attempt($credentials)) {
            return response()->json(['message' => 'Email atau kata sandi salah.'], 401);
        }

        $request->session()->regenerate();
        $user = $request->user();

        return response()->json([
            'user' => $this->publicUser($user),
            'progress' => $this->progressSnapshots->forUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => $this->publicUser($user),
            'progress' => $this->progressSnapshots->forUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }

    private function publicUser(User $user): array
    {
        return [
            'id' => (string) $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'nim' => $user->nim,
        ];
    }
}
