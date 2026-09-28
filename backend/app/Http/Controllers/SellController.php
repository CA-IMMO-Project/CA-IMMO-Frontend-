<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyDocument;
use App\Models\PropertyMedia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SellController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:100',
            'lastName' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'email' => 'required|email|max:255',
            'birthDate' => 'nullable|date',
            'profession' => 'nullable|string|max:150',
            'country' => 'nullable|string|max:100',
            'bank' => 'nullable|string',

            'idType' => 'nullable|string|max:100',
            'idNumber' => 'nullable|string|max:100',

            'title' => 'required|string|max:255',
            'reference' => 'nullable|string|max:100',
            'area' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:0',
            'pricePerSqm' => 'nullable|numeric|min:0',

            'description' => 'nullable|string',
            'relief' => 'nullable|string',
            'access' => 'nullable|string',
            'water' => 'nullable|string',
            'electricity' => 'nullable|string',

            'region' => 'nullable|string',
            'district' => 'nullable|string',
            'commune' => 'nullable|string',
            'fokontany' => 'nullable|string',
            'address' => 'nullable|string',

            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            'payment' => 'nullable|string',
            'duration' => 'nullable|string',
            'deposit' => 'nullable|string',
            'customDeposit' => 'nullable|numeric',

            'photos' => 'required|array|min:3|max:12',
            'photos.*' => 'file|mimes:jpg,jpeg,png,webp|max:15360',

            'video' => 'nullable|file|mimes:mp4,mov|max:102400',

            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png|max:20480',

            'documentTypes' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($request, $validated) {

            $user = User::where('email', $validated['email'])->first();

            if (!$user) {
                $user = User::create([
                    'first_name' => $validated['firstName'],
                    'last_name' => $validated['lastName'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'birth_date' => $validated['birthDate'] ?? null,
                    'profession' => $validated['profession'] ?? null,
                    'country' => $validated['country'] ?? 'Madagascar',
                    'has_bank_account' =>
                        ($validated['bank'] ?? 'Non') === 'Oui',
                    'password' => Str::random(32),
                ]);
            }

            $reference = 'VEN-' .
                now()->format('ymd') .
                '-' .
                random_int(10, 99);

            $property = Property::create([
                'owner_id' => $user->id,
                'reference' => $reference,

                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,

                'area' => $validated['area'],
                'price' => $validated['price'],
                'price_per_sqm' =>
                    $validated['pricePerSqm'] ??
                    ($validated['area'] > 0
                        ? $validated['price'] / $validated['area']
                        : null),

                'relief' => $validated['relief'] ?? null,
                'access' => $validated['access'] ?? null,
                'water' => $validated['water'] ?? null,
                'electricity' => $validated['electricity'] ?? null,

                'region' => $validated['region'] ?? null,
                'district' => $validated['district'] ?? null,
                'commune' => $validated['commune'] ?? null,
                'fokontany' => $validated['fokontany'] ?? null,
                'address' => $validated['address'] ?? null,

                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,

                'payment' => $validated['payment'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'deposit' => $validated['deposit'] ?? null,
                'custom_deposit' => $validated['customDeposit'] ?? null,

                'verified' => false,
                'available' => false,
                'status' => 'pending_verification',
                'submitted_at' => now(),
            ]);

            foreach ($request->file('photos', []) as $index => $photo) {

                $path = $photo->store(
                    'properties/' . $property->id . '/photos',
                    'public'
                );

                PropertyMedia::create([
                    'property_id' => $property->id,
                    'type' => 'photo',
                    'path' => $path,
                    'original_name' => $photo->getClientOriginalName(),
                    'sort_order' => $index,
                ]);
            }

            if ($request->hasFile('video')) {

                $video = $request->file('video');

                $path = $video->store(
                    'properties/' . $property->id . '/videos',
                    'public'
                );

                PropertyMedia::create([
                    'property_id' => $property->id,
                    'type' => 'video',
                    'path' => $path,
                    'original_name' => $video->getClientOriginalName(),
                    'sort_order' => 0,
                ]);
            }

            $documentTypes = $request->input('documentTypes', []);

            foreach ($request->file('documents', []) as $index => $document) {

                $path = $document->store(
                    'properties/' . $property->id . '/documents',
                    'public'
                );

                PropertyDocument::create([
                    'property_id' => $property->id,
                    'type' => $documentTypes[$index] ?? 'Autre document',
                    'path' => $path,
                    'original_name' => $document->getClientOriginalName(),
                    'status' => 'pending',
                ]);
            }

            return response()->json([
                'message' => 'Terrain envoyé avec succès.',
                'reference' => $reference,
                'status' => 'En vérification',
                'property' => $property->load([
                    'media',
                    'documents'
                ]),
            ], 201);
        });
    }
}
