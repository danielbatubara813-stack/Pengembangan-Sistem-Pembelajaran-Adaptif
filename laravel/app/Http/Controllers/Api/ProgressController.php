<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProgressSnapshotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function __construct(private readonly ProgressSnapshotService $progressSnapshots)
    {
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'progress' => $this->progressSnapshots->forUser($request->user()),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'currentPage' => ['nullable', 'string', 'max:40'],
            'completedMaterials' => ['nullable', 'array', 'max:1000'],
            'completedMaterials.*' => ['string', 'max:255'],
            'completedMaterialDetails' => ['nullable', 'array', 'max:1000'],
            'completedMaterialDetails.*.id' => ['required', 'string', 'max:255'],
            'completedMaterialDetails.*.title' => ['required', 'string', 'max:255'],
            'completedMaterialDetails.*.topic' => ['required', 'string', 'max:120'],
            'completedMaterialDetails.*.kind' => ['nullable', 'in:source,example,exercise'],
            'completedMaterialDetails.*.completedAt' => ['nullable', 'date'],
            'retestAttempt' => ['nullable', 'integer', 'min:1', 'max:10000'],
        ]);

        $progress = $request->user()->progress()->first();
        $stored = $progress?->payload ?? [];
        $next = array_merge($stored, $payload);
        $request->user()->progress()->updateOrCreate(
            ['user_id' => $request->user()->getKey()],
            ['payload' => $next],
        );

        return response()->json([
            'success' => true,
            'progress' => $this->progressSnapshots->forUser($request->user()),
        ]);
    }

    public function setMaterial(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['required', 'string', 'max:255', 'regex:/^resource:[a-z0-9-]+:(?:[a-f0-9]{12}|manual|youtube-search|video|example-[0-9]+|exercise-[0-9]+)$/'],
            'completed' => ['required', 'boolean'],
            'material' => ['nullable', 'array'],
            'material.title' => ['required_with:material', 'string', 'max:255'],
            'material.topic' => ['required_with:material', 'string', 'max:120'],
            'material.kind' => ['nullable', 'in:source,example,exercise'],
        ]);
        $user = $request->user();
        $progress = $user->progress()->first();
        $payload = $progress?->payload ?? [];
        $completed = is_array($payload['completedMaterials'] ?? null) ? $payload['completedMaterials'] : [];
        $details = is_array($payload['completedMaterialDetails'] ?? null) ? $payload['completedMaterialDetails'] : [];

        $completed = array_values(array_unique(array_filter($completed, 'is_string')));
        if ($data['completed']) {
            if (! in_array($data['id'], $completed, true)) $completed[] = $data['id'];
            if (isset($data['material'])) {
                $details[$data['id']] = [
                    'id' => $data['id'],
                    'title' => $data['material']['title'],
                    'topic' => $data['material']['topic'],
                    'kind' => $data['material']['kind'] ?? null,
                    'completedAt' => now()->toISOString(),
                ];
            }
        } else {
            $completed = array_values(array_filter($completed, fn (string $id) => $id !== $data['id']));
            unset($details[$data['id']]);
        }
        $payload['completedMaterials'] = $completed;
        $payload['completedMaterialDetails'] = $details;

        $user->progress()->updateOrCreate(
            ['user_id' => $user->getKey()],
            ['payload' => $payload],
        );

        return response()->json([
            'success' => true,
            'completedMaterials' => $completed,
            'completedMaterialDetails' => $details,
        ]);
    }
}
